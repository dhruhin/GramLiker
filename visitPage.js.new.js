var page = require('webpage').create();
page.viewportSize = { width:1024 , height: 600 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36';
var handle = require('system').args[1];
if(phantom.cookies==""){
	phantom.exit();
}
handle = handle.replace('@', '');
var visited = false;
var output = "";
page.open('https:/www.instagram.com/'+handle, function() {
	// wait for response
	 	output = page.evaluate(function() {
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
	visited = true;
});

page.onLoadFinished = function(status){
	if(status=='success' && visited){
		if(output=="")
			console.log('Account Private/Invalid: ' + page.url);
		else
			console.log('Account Visited: ' + page.url);
		phantom.exit();
	}
};
