var svr = require('socket-server')({port:8080});
svr.hook = function(ws){
  ws.on('message', function(data, flags){
		ws.topic = data;
	})
	return ws;
}


var tw = T('', '');

function sendem(){
	for(id in svr.clientlist){
		var topic = svr.clientlist[id].topic;
		if(topic){
			tw.api('search/tweets.json?count=2&q='+topic, function(r){
				console.log(id, r.statuses[0]);
	    		svr.send(id, JSON.stringify(r.statuses[0]))
			});
		}
	}
}
setInterval(sendem, 20000);

function T(cons_key, cons_secret){      
    var r = require('request');
    return {
        tok: null,
        api: function(name, cb){
            var th = this;
            if(!this.tok){
                r.post({url: 'https://api.twitter.com/oauth2/token/', 
                headers: {Authorization: 'Basic ' + new Buffer(cons_key +':'+ cons_secret).toString('base64')},
                form: {grant_type: 'client_credentials'}
                }, function(e,r,b){th.tok=JSON.parse(b).access_token; th.api(name, cb)});
                return;
            }
            r.get({
                url: 'https://api.twitter.com/1.1/'+name,
                headers: {Authorization: 'Bearer ' + th.tok}
            }, function(e,r,b){cb(JSON.parse(b))})
        }
    }
}
