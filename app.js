var fs = require('fs');
var TelegramBot = require('node-telegram-bot-api');
var userIDs = ["CONVO_ID_1", "CONVO_ID_2"];
var token = 'TELEGRAM_BOT_TOKEN';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Any kind of message
bot.on('message', function (msg) {

  var fromId = msg.chat.id;
  console.log(fromId+":\n---------------\n"+msg.text+"\n---------------");
  if(msg.text.includes("/setusername")){
    var text = msg.text.replace("/setusername","");
    text = text.trim();
    writeFile(text, "./username");
    bot.sendMessage(fromId, "done");
  }
  else if(msg.text.includes("/setpassword")){
    var text = msg.text.replace("/setpassword","");
    text = text.trim();
    writeFile(text, "./password");
    bot.sendMessage(fromId, "done");
  }
  else if(msg.text.includes("/sethandle")){
    var text = msg.text.replace("/sethandle","");
    text = text.trim();
    writeFile(text, "./handle");
    bot.sendMessage(fromId, "done");
  }
  else if(msg.text.includes("Dropbot")){
    fs.readFile('handle', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      bot.sendMessage(fromId, data);
    });
  }
  else if(msg.text.includes("Top rowbot")){
    var text = msg.text.replace("Top rowbot","");
    text = text.trim();
    writeFile(text+"\n", "./handles.txt");

    var exec = require('child_process').exec;
    var cmd = './insta.sh';
    exec(cmd, function(error, stdout, stderr) {
      //msg.text
      if(stdout.includes("Unsuccessful") || stdout.includes("Failed")){
        for(var user in userIDs)
          bot.sendMessage(user, stdout);
      }else{
        fs.readFile('username', 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }else
            bot.sendMessage(fromId, "d " + "@" + data);
        });
      }

    });
  }
});
function writeFile(data, file){
  fs.writeFile(file, data, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("FILE WRITE: "+file+" was saved");
    }
});

}
