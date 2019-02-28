var chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
var endpoint = 'https://mainnet.eoscannon.io';

var eos = Eos({
    keyProvider: '',
    httpEndpoint: endpoint,
    chainId: chainId,
  });

var network = null;
var identity = null;
var currentAccount = null;

function checkoutNetworks() {
  var httpEndpoint = endpoint.split('://');
  var host = httpEndpoint[1].split(':');

  network = {
    blockchain: 'eos',
    host: host[0],
    port: host.length > 1 ? host[0] : (httpEndpoint[0].toLowerCase() == 'https' ? 443 : 80),
    chainId: chainId,
    protocol: httpEndpoint[0],
    httpEndpoint : endpoint,
  };

  console.log(`network conf：${JSON.stringify(network)}`);
}

function hasScatter() {
  return scatter !== undefined;
}

function getAccountName() {
  return identity == null || identity.accounts == null || identity.accounts[0].name;
}

function checkAccount() {
  try {
    eos.getAccount({ account_name: getAccountName() }).then(res => {
      var cb = res.core_liquid_balance;
      balance = res.length == 0 ? 0 : new Number(cb.split(' ')[0]).valueOf();
      console.log(getAccountName()+', '+cb);

      var cl = res.cpu_limit;
      cpuAvailable = new Number((cl.available * 100 / cl.max)).toFixed(2) + '%';
      console.log(cpuAvailable);
      hasCPU = cl.available > 0 && ((cl.available / cl.max) >= 0.1);

      ramAvailable = new Number((res.ram_usage * 100 / res.ram_quota)).toFixed(2) + '%';
      console.log(ramAvailable);

      // setTimeout(checkAccount, 1000);
    }).catch(err => {
      console.log(`checkAccount error：${JSON.stringify(err)}`);
      // setTimeout(checkAccount, 1000);
    });
  } catch (error) {
    console.log(`checkAccount error：${JSON.stringify(error)}`);
    // setTimeout(checkAccount, 1000);
  }
}

function open(successCallback, errorCallbak) {
  let that = this;
  if (!hasScatter()) {
    errorCallbak("scatter required");
    return;
  }
  checkoutNetworks();
  scatter.suggestNetwork(network).then(() => {
    const requirements = { accounts: [network] };
    scatter.getIdentity(requirements).then(
      function (i) {
        if (!i) {
          return errorCallbak(null);
        }
        identity = i;
        currentAccount = identity.accounts[0];
        console.log(identity.accounts[0].name);
        // eos = scatter.eos(network, Eos, { expireInSeconds: 60 }, "https");
        successCallback();
      }
    ).catch(error => {
      errorCallbak(error);
    });
  }).catch(error => {
    errorCallbak(error);
  });
}

function login() {
  if (!hasScatter()) {
    alert('scatter required');
    return;
  }
  scatter.connect('SIGNATURE').then(connected => {
    open(function () {
      alert(`Login success：${JSON.stringify(identity.accounts[0].name)}`);
      console.log(`Login success：${JSON.stringify(identity.accounts[0].name)}`);
      checkAccount();
    }, function (error) {
      console.log(`Login error：${JSON.stringify(error)}，Please refresh page.`);
    });
  });
}

function logout() {
  if (identity) {
    identity = null;
    if (hasScatter()) {
      scatter.forgetIdentity().then(() => {
        console.log('logout success');
      });
    }
  }
}

const publish =  function(callback){
  if (currentAccount == null) {
      alert('请先登录');
  }

  var eos = scatter.eos(network, Eos);

  eos.transaction({
      actions: [
          {
              account: 'signature.bp',
              name:    'publish',
              authorization: [{
                  actor:      currentAccount.name,
                  permission: currentAccount.authority
              }],
              data: {
              from:    currentAccount.name,
              fission_factor: 2000
              }
          }
      ]
  }).then(result => {
      callback(result.transaction_id,currentAccount.name);
  }).catch(error => {
    alert('error:'+JSON.stringify(error));
  });
}


function transferEOS({memo = '',amount = 0}){
  if (currentAccount == null) {
    alert('请先登录');
  }
  var eos = scatter.eos(network, Eos);
  eos.transaction({
    actions: [
      {
        account: 'eosio.token',
        name:    'transfer',
        authorization: [{
          actor:      currentAccount.name,
          permission: currentAccount.authority
        }],
        data: {
        from:    currentAccount.name,
        to: 'signature.bp',
        quantity: `${(amount).toFixed(4).toString()} EOS`,
        memo: memo
        }
      }
    ]
  }).then(result => {
    alert('publish success!');
  }).catch(error => {
    alert('error:'+JSON.stringify(error));
  });
}

function input() {
  let amountStr = prompt("请输入打赏金额","");
  let amount = parseFloat(amountStr);
  console.log(amount);
  let shareaccount = getRefer();
  let shareid = null;
  if (shareaccount == null) {
    transferEOS({
      amount: amount,
      memo: `share ${signid}`
    })
  } else {
    for(var i = sharerows.length - 1; i >= 0; i--) {
      if(sharerows[i].reader === currentAccount.name) {
        shareid = sharerows[i].id;
        break;
      }
    }

    if(shareid != null) {
      if (amount != null) {
        transferEOS({
          amount: amount,
          memo: `share ${signid} ${shareid}`
        })
      }
    } else {
      if (amount != null) {
        transferEOS({
          amount: amount,
          memo: `share ${signid}`
        })
      }
    }
  }  
}


async function getSharesInfo() {
  const { rows } = await eos.getTableRows({
    json: true,
    code: 'signature.bp',
    scope: 'signature.bp',
    table: 'shares',
    limit: 10000,
  });
  return rows;
}

async function getSignsInfo() {
  const { rows } = await eos.getTableRows({
    json: true,
    code: 'signature.bp',
    scope: 'signature.bp',
    table: 'signs',
    limit: 10000,
  });
  return rows;
}

async function getMaxShareId() {
  var rows = await getSharesInfo();
  var len = rows.length;

  return len - 1;
}

async function getMaxSignId() {
  var rows = await getSignsInfo();
  var len = rows.length;
  var maxId = 0;

  for (var i = 0; i < len; i++) {
    for (obj in rows[i]) {
      if (obj.id > maxId) {
        maxId = obj.id;
      }
    }
  }

  return maxId;
}

// 分享链接时生成的链接
 function getReferUrl(myShareId) {
  if (currentAccount == null) {
    alert('请先登录');
  } 
  const loc = window.location.href;
  var url = loc.split('/');
  return `https://ipfs.io/ipfs/${url[4]}/?#/invite/${currentAccount.name}`;
}

// 得到share account
function getRefer() {
  const pureloc = window.location.hash.split('/');
  return pureloc[2];
}

function getPureUrl() {
  const loc = window.location.href;
  var url = loc.split('/');
  return `https://ipfs.io/ipfs/${url[4]}/`;
}

