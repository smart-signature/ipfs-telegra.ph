
# ⚛ IPFS telegra.ph clone

Minimalist publishing tool for post data to IPFS network.
UI cloned from [Telegra.ph](http://telegra.ph)

## Demo ([click](https://ipfs.io/ipfs/QmbvveWddPW9ogjhPfByJybDAeE42eHna6a8bf6Qk2SF9B))
IPFS hash:QmbvveWddPW9ogjhPfByJybDAeE42eHna6a8bf6Qk2SF9B

You can access it through your local node or through a public IPFS gateway:
https://ipfs.io/ipfs/QmbvveWddPW9ogjhPfByJybDAeE42eHna6a8bf6Qk2SF9B

[Example post](https://ipfs.io/ipfs/QmRntMvqmhEH1YZDfEVeR8GS23XcL3hJpL2DEGP3NMeU7J/)

## Develop
```
git clone https://github.com/alexstep/ipfs-telegra.ph/ telegra.ph
cd telegra.ph

npm install
npm start
npm run deploy
```

## Thanks
 * https://github.com/silentcicero/ipfs-mini
 * http://telegra.ph
 * https://www.cachep2p.com


## FAQ

> prototype-website/node_modules/ipfsd-ctl/node_modules/go-ipfs-dep/src/index.js:102
      if (res.statusCode !== 200) {
              ^
TypeError: Cannot read property 'statusCode' of undefined

https://github.com/ipfs/go-ipfs/issues/5883#issuecomment-455150852