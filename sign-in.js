var TIMEOUT = 2000;
var page = require('webpage').create();
page.viewportSize = { width:1024 , height: 600 };
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36';
//phantom.clearCookies();
var user = require('system').args[1];
var pass = require('system').args[2];
page.open('https:/instagram.com/accounts/login/', function() {
	setTimeout(function(){
		if(page.url=="https://www.instagram.com/"){
			console.log('Login for '+ user +' Successful');
			phantom.exit();
		}
	},TIMEOUT);
	var ig = page.evaluate(function() {
		function getCoords(box) {
			return  {
				x: box.left,
				y: box.top
			};
		}

		function getPosition(type, name) {
			// find fields to fill
			var input = document.getElementsByTagName(type);
			for(var i = 0; i < input.length; i++) {
				if(name && input[i].name == name)  return getCoords(input[i].getBoundingClientRect());
				else if(!name && input[i].className)	return getCoords(input[i].getBoundingClientRect()); // this is for login button
			}
		}
		return {
			user: getPosition('input', 'username'),
			pass: getPosition('input', 'password'),
			login: getPosition('button')
		};
	});

	// fill in data and press login
	page.sendEvent('click',ig.user.x, ig.user.y);
	page.sendEvent('keypress', user);

	page.sendEvent('click',ig.pass.x, ig.pass.y);
	page.sendEvent('keypress', pass);
	page.sendEvent('click',ig.login.x, ig.login.y);
	// wait for response
	setTimeout(function() {
		var error = page.evaluate(function () {
			var element = document.getElementById('errorAlert');
			var error_message = false;
			if (element !== null) {
				error_message = element.innerText.trim();
			}
			return error_message;
		});

		//page.render('home-page.png');
		if (!error) {
			if(page.url=="https://www.instagram.com/")
				console.log('Login for '+ user +' Successful (Not cached)');
			else {
				console.log('Login for '+ user +' Unsuccessful: ' + page.url);
				phantom.clearCookies();
			}
		} else {
			console.log('Login Failed: ' + error);
		}
		phantom.exit();
	}, TIMEOUT);

});
