user-stream
=============
### Version: 0.0.1 ###

Simple Node.js Twitter (API 1.1) user stream client (https://dev.twitter.com/docs/streaming-apis/streams/user)

Currently in development (also README file)!

Install
-------
```npm install user-stream```

Usage
-------
```javascript
var Stream = require('user-stream');
var stream = new Stream({
    consumer_key: 'xxx',
    consumer_secret: 'xxx',
    access_token_key: 'xxx',
    access_token_secret: 'xxx'
});

//create stream
stream.stream();

//listen stream data
stream.on('data', function(json) {
  console.log(json);
});
```

Events
-------
- ```data```
- ```garbage```
- ```close```
- ```error```
- ```connected```
- ```heartbeat```

Methods
-------
- ```stream```
- ```destroy```