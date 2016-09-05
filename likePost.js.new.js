var page = require('webpage').create();
page.viewportSize = { width:1024 , height: 600 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36';
if(phantom.cookies==""){
	phantom.exit();
}
var number = require('system').args[1];

var fs = require('fs');
var content = fs.read('posts.dat');
var links = content.split(',');
if(links[0]=="" || !number || number >= links.length || number < 0) phantom.exit();
var visit1 = false, visit2 = false;
page.open(links[number], function() {
	// wait for response
	page.evaluate(function() {
		var evObj = document.createEvent('Events');
		evObj.initEvent('click', true, false);
		var tags = document.getElementsByClassName("coreSpriteHeartFull");
		if(tags.length > 0){ tags[0].dispatchEvent(evObj);}
		location.reload();
	});
		visit1 = true;
});

page.onLoadFinished = function(status){
	if(status=='success' && visit1 && !visit2){
		page.evaluate(function () {
			var evObj = document.createEvent('Events');
			evObj.initEvent('click', true, false);
			tags = document.getElementsByClassName("coreSpriteHeartOpen");
			if(tags.length > 0){ tags[0].dispatchEvent(evObj); }
			location.reload();
		});
		visit2 = true;
	}else if(status=='success' && visit1 && visit2){
		if(page.url.indexOf('#')==-1)
			console.log('Like Unsuccessful: ' + page.url);
		else
			console.log('Like Successful: ' + page.url);
		phantom.exit();
	}
};
