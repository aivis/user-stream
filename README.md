user-stream
=============
### Version: 0.0.6 ###

Simple Node.js Twitter (API 1.1) user stream client (https://dev.twitter.com/docs/streaming-apis/streams/user)

Install
-------
```npm install user-stream```

Usage
-------
```javascript
var Stream = require('user-stream');
var stream = new Stream({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
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
- ```data```        - stream data in JSON format
- ```garbage```     - stream data who can't be parsed to JSON
- ```close```       - stream close event (stream connection closed)
- ```error```       - error event (request error, response error, response status code greater than 200)
- ```connected```   - stream created
- ```heartbeat```   - twitter emitted heartbeat

Methods
-------
- ```stream```  - create stream connection
- ```destroy``` - destroy/close stream connection

### Streaming API request parameters [link](https://dev.twitter.com/docs/streaming-apis/parameters) ###
```javascript
var params = {
    with: 'user'
}
//create stream
stream.stream(params);
```
#### Reserved parameters for lib
- ```delimited``` 
- ```stall_warnings```
