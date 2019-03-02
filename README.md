# Smart Signature Prototype 
This is the Website Frontend of Smart Signature Prototype. This repo is cloned from [ipfs-telegra.ph](https://github.com/alexstep/ipfs-telegra.ph).


欢迎来到 Smart Signature Prototype 的前端代码仓库。本代码克隆自 [ipfs-telegra.ph](https://github.com/alexstep/ipfs-telegra.ph)。作为 Prototype，这份代码将贯彻最小可用的原则，实现 [原型合约](https://github.com/smart-signature/smart-signature-EOS-contract) 中的方法。

## Develop

###开发时请注意清除浏览器缓存###

```
git clone https://github.com/smart-signature/prototype-website
cd prototype-website

npm install
npm start
npm run deploy
```

## FAQ
> prototype-website/node_modules/ipfsd-ctl/node_modules/go-ipfs-dep/src/index.js:102
      if (res.statusCode !== 200) {
              ^
TypeError: Cannot read property 'statusCode' of undefined

https://github.com/ipfs/go-ipfs/issues/5883#issuecomment-455150852

## Reference
- [Telegram 和 Telegra.ph, 一天世界](https://yitianshijie.net/38) 
- [设计民主态](https://www.huxiu.com/article/168805.html)
- [一个真正改变世界的人去世了，再见，宜家创始人 IK](http://www.qdaily.com/articles/49697.html)
- [EOSPark WebSocket API 订阅 EOS 账户变动 Node.js 代码示例 - EOS 区块链开发实战](https://www.jianshu.com/p/833f06d7a7a8)
- [dfuse：为EOS打造的流式API](https://www.dfuse.io)