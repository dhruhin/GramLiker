var TIMEOUT = 3000;
var page = require('webpage').create();
page.viewportSize = { width:1024 , height: 600 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36';
if(phantom.cookies==""){
	phantom.exit();
}
var handle = require('system').args[1];
handle = handle.replace('@', '')
page.open('https:/www.instagram.com/'+handle, function() {
	// wait for response
	var output = page.evaluate(function() {
		var tags = document.getElementsByTagName("a");
		var links = [];
		for(var i = 0; i < tags.length; i++){
			if(tags[i].href.contains("taken-by="+document.URL.split('/')[3])){
				links.push(tags[i]);
			}
		}
		return links.toString();
	});
	var fs = require('fs');
	var path = 'posts.dat';
	fs.write(path, output, 'w');

	setTimeout(function() {
		var error = page.evaluate(function () {
			var element = document.getElementById('errorAlert');
			var error_message = false;
			if (element !== null) {
				error_message = element.innerText.trim();
			}
			return error_message;
		});

		//page.render('after-submit.png');
		if (!error) {
			if(output==""){
				console.log('Account Private/Invalid: ' + page.url);
			}else
			console.log('Account Visited: ' + page.url);
		} else {
			console.log('Page Visit Failed: ' + error);
		}
		phantom.exit();
	}, TIMEOUT);
});
