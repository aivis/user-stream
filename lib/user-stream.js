var oauth   = require('oauth'),
    events  = require('events'),
    util    = require("util");

var user_stream_url     = 'https://userstream.twitter.com/1.1/user.json',
    request_token_url   = 'https://api.twitter.com/oauth/request_token',
    access_token_url    = 'https://api.twitter.com/oauth/access_token';

module.exports = Stream;

function Stream(params) {
    
    if (!(this instanceof Stream)) {
        return new Stream(params);  
    } 
    
    events.EventEmitter.call(this);
    
    this.params = params;
    
    this.oauth = new oauth.OAuth(
        request_token_url,
        access_token_url,
        this.params.consumer_key,
        this.params.consumer_secret,
        '1.0', 
        null, 
        'HMAC-SHA1', 
        null,
        {
          'Accept': '*/*',
          'Connection'
          : 'close',
          'User-Agent': 'user-stream.js'
        }
    );
    
}

//inherit
util.inherits(Stream, events.EventEmitter);

/**
 * Create twitter use stream
 * 
 * Events:
 * - data
 * - garbage
 * - close
 * - error
 * - connected
 * - heartbeat
 * 
 */
Stream.prototype.stream = function(params) {
    
    var stream = this;
    
    if (typeof params != 'object') {
        params = {};
    }
    
    //required params for lib
    params.stall_warnings = 'true';
    
    var request = this.oauth.post(
        user_stream_url,
        this.params.access_token_key,
        this.params.access_token_secret,
        params, 
        null
    );

    /**
     * Destroy socket
     */
    this.destroy = function() {

        request.abort();

    }

    request.on('response', function(response) {

        // Any response code greater then 200 from steam API is an error
        if(response.statusCode > 200) {

            stream.emit('error', {type: 'response', data: {code:response.statusCode}});
          
        } else {
            
            //emit connected event
            stream.emit('connected');
            
            response.setEncoding('utf8');
            var data = '';

            response.on('data', function(chunk) {

                data += chunk.toString('utf8');

               //is heartbeat?
                if (data == '\r\n') {
                    stream.emit('heartbeat');
                    return;
                }

                var index, json;

                while((index = data.indexOf('\r\n')) > -1) {
                    json = data.slice(0, index);
                    data = data.slice(index + 2);
                    if(json.length > 0) {
                        try {
                            stream.emit('data', JSON.parse(json));
                        } catch(e) {
                            stream.emit('garbage', data);
                        }
                    }
                }
            });

            response.on('error', function(error) {
                
                stream.emit('close', error);

            });
            
            response.on('end', function() {

                stream.emit('close', 'socket end');
    
            });
            

            response.on('close', function() {

                request.abort();
          
            });
        }

    });
    
    request.on('error', function(error) {
        
        stream.emit('error', {type: 'request', data: error});
        
    });
    
    request.end();
           
}