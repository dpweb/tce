var ws;
function _ws(url, fn){
  ws = new WebSocket(url);
	ws.onmessage = function(m) {
		fn(JSON.parse(m.data), ws);
	}
	setTimeout(function(){
		ws.send('javascript');
	},2000)
	return ws;
}
var id = 1;
function btnclick(notifId, btnIndex){
	if(id){
		if(!btnIndex){
			return window.open('window.html');
			window.open('http://twitter.com/'+notifId);
			setTimeout(function(){ id = 1 }, 4000);
			id = 0;
			return;
		}
		//chrome.app.window.create("window.html", {bounds: {width:600, height:400}});
		ws.close();
		id = 0;
		setTimeout(function(){ id = 1 }, 4000);
	}
}

var cli = _ws('ws://localhost:8080', function(o, ws){
	var buttons = [];
	buttons.push({ title: "Go To" });
	chrome.notifications.create(o.user.screen_name, {
			type : "basic",
			title: o.user.name + ' @' + o.user.screen_name,
			message: o.text,
			//imageUrl: chrome.runtime.getURL(o.user.profile_image_url),
			iconUrl: 'twitter.jpg',
			buttons: buttons
	}, function(){});
	chrome.notifications.onButtonClicked.addListener(btnclick);
})

