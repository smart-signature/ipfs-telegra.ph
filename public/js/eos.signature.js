/*
function login(){
    var network = {blockchain:'eos', protocol:'https', host:'api.eosbeijing.one', port:443, chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'};
  
    var eos = scatter.eos(network, Eos);
    console.log('id before', scatter.identity)
    scatter.forgetIdentity().then(function(){
        scatter.getIdentity({accounts:[network]}).then(function(id){
            const account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
            console.log('acc', account);
  
            eos.transaction({
              actions: [
                  {
                      account: 'signature.bp',
                      name:    'create',
                      authorization: [{
                          actor:      account.name,
                          permission: account.authority
                      }],
                      data: {
                          from:    account.name
                      }
                  }
              ]
          }).then(result => {
            alert('success!');
          }).catch(error => {
            alert('error:'+JSON.stringify(error));
          });
        
            /*
            eos.contract("signature.bp").then(contr => {
              contr.create(account.name, 2, {
                authorization: [{ actor:account.name, permission:account.authority}]
              }).then(result => {
                  console.log(result);
              });
            });
            
            /*
            eos.transfer(account.name, 'signatu', '0.0001 EOS', '').then(function(res){
                console.log('res', res);
            }).catch(function(err){
                console.log('err', err);
            })
            
        })
    })
  }
  */


// mainnet
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

const publish =  function(){
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
    alert('publish success!');
  }).catch(error => {
    alert('error:'+JSON.stringify(error));
  });
}