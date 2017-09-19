var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var timeline = require('./timeline2.js');
var Feature = require('platform/feature');
//var PIN_ID = "CSontheGOTest";

//todo display messages on errors when cant load etc
// Hysuo65lk
var bGcolor = Feature.color("white", "white");
var highlightcolor = Feature.color("VividCerulean", "black");
var highlighttextcolor = Feature.color("black", "white");
var Clay = require('clay');
//var clayConfig = require('config2.json');
var clayConfig = "";
var clay = "";

var menu = new UI.Menu({
    backgroundColor: bGcolor,
    highlightBackgroundColor: highlightcolor,
    highlightTextColor: highlighttextcolor
});
var splashWindow = new UI.Window({ fullscreen: true});

function makeSplash(){
    console.log("making splash");
    var splashImage = new UI.Image({
        image: 'IMAGE_LOGO_CSGO_SPLASH'
    })
    splashWindow.add(splashImage);
    splashWindow.show();
}

//Create a new UI
//turns out you cant change font in a pebblejs menu list :(
// so sad


Pebble.addEventListener('showConfiguration', function(e) {
    console.log('fetching config json for clay');
    var reqConfig = new XMLHttpRequest();
    //console.log('watchtoken' + Pebble.getWatchToken());
    //todo PLEASE dont forget to change this. maybe I should make it variable at the top of the code so i dont have to change it once
    var url = 'http://pebble.mrwhal3.com/pebble/v1/' + Pebble.getWatchToken() + '/filterconfig';
    //console.log(url);
    reqConfig.open('GET', url);
    // Specify the callback for when the request is completed
    reqConfig.onload = function() {
            var configCard = new UI.Card({
             });
        if(reqConfig.readyState === 4 ){
            if(reqConfig.status === 200){
                // The request was successfully completed!
                var jsonConfig = JSON.parse(reqConfig.responseText);
                clayConfig = reqConfig.responseText;
                console.log(clayConfig);
                clay = new Clay(jsonConfig, null, {autoHandleEvents: false});
                Pebble.openURL(clay.generateUrl());
            }else{
                console.log('Error in http');
                configCard.title("Not successful");
                configCard.body("Error fetching config page. Status " + reqConfig.statusText);
                configCard.show();
            }
        }else{
            console.log('reqConfig state is error');
            configCard.title("Not successful");
            configCard.body("Error fetching config page. Status " + reqConfig.statusText);
            configCard.show();
        }
    };
    // Send the request
  reqConfig.send(null);


});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    console.log('something broke in returning');
    return;
  }
  console.log('returning from webview');
  var dict = clay.getSettings(e.response);
  //console.log(dict);
  // Save the Clay settings to the Settings module.
  Settings.option(dict);

  //console.log(JSON.stringify(dict));
  //todo after closing config, reload the window. call getCSGO?
  //https://forums.pebble.com/t/pebblejs-how-to-dynamically-create-a-ui-menu/11191/17
  //check if setting is enabled, then call it

  //menu.hide();
  if(isEnabled()){
      //makeSplash();
      //setTimeout(function(){
       //   menu.hide();
     // }, 400)
      
      //menu = new UI.Menu();
      //menu.remove(2);
      //menu.each(function(index){
      //    console.log('element  ' + JSON.stringify(index));
      //});
      //menu.hide()
      //menu(clear = true);
      getCSGO(JSON.stringify(dict));
  }else{
      getCSGO();
  }

});

Pebble.addEventListener('ready', function() {
  // PebbleKit JS is ready!
  console.log('PebbleKit JS ready!');
});

//Main seciton start
makeSplash();
if(isEnabled()){
    var options = Settings.option();
    console.log(JSON.stringify(options));
    getCSGO(JSON.stringify(options))
}else{
    getCSGO();
}

//todo extend this to be able to handle the filter options too
/*
 * Function is used to get the json feed from the datastore
 * Maybe make this require URL as input, would make it more friendly to change
 * IP is hard coded at this time, once domain name is setup will replace with that
 */
function getCSGO(filter){
  if(filter === undefined){
      //filter not defined to no do anything
      //todo PLLLLLLEEEEASE dont forget to change this back to not staging when i go live
      var url = 'http://pebble.mrwhal3.com/pebble/v1/' + Pebble.getWatchToken();
  }else{
      var url = 'http://pebble.mrwhal3.com/pebble/v1/' + Pebble.getWatchToken() + "/" + filter;
  }
  console.log('fetching csgo');
  var req = new XMLHttpRequest();
  //console.log('watchtoken' + Pebble.getWatchToken());
  //var url = 'http://pebble.mrwhal3.com/pebble/v1/' + Pebble.getWatchToken();
  console.log(url);
  req.open('GET', url);
  // Specify the callback for when the request is completed
  req.onload = function() {
    var httpCard = new UI.Card({
    });
    if(req.readyState === 4 ){
        if(req.status === 200){
            // The request was successfully completed!
            json = JSON.parse(req.responseText);
            //console.log(req.responseText);
            console.log('Creating Live menu items');
            createLiveMenu(json.liveMatches);
            console.log('creating Upcoming menu items');
            createUpcomingMenu(json.upcomingMatches);
            console.log('Creating Complted menu items');
            createCompletedMenu(json.completedMatches);
            amReady();

        }else{
            console.log('Error in http');
            httpCard.title("Not successful");
            httpCard.body("Error in fetching match results. HTTP Status: " + req.statusText);
            httpCard.show();
        }
    }else{
        console.log('req state is error' + req.responseText);
        httpCard.title("Not successful");
        httpCard.body("Error fetching match results. Status: " + req.readyState);
        httpCard.show();
    }
  };

  // Send the request
  req.send(null);
  //https://pebble.github.io/pebblejs/
}


function isEnabled(){
    if(Settings.option('enabled')){
        console.log('Enabled, lets get things ready');
        return true;
    }else{
        console.log('Disabled, sending default filter');
        return false;
    }
}

/*
 * Function to create the Live Matches part of the menu
 * Takes a json object as input, and draws up its own section in the menu
 */
function createLiveMenu(matches){
    //create 'items' array for each match and then display menu
    var items = [];
    var secLive = { title: 'Live' };
    menu.section(0, secLive);
    for(i in matches){
      //If nick not exist, create a temp one
      if(matches[i].awayNick === ""){
          matches[i].awayNick = matches[i].awayTeam.substring(0,6);
          console.log("away nick: " + matches[i].awayNick);
      }
      if(matches[i].homeNick === ""){
          matches[i].homeNick = matches[i].homeTeam.substring(0,6);
          console.log("home nick: " + matches[i].homeNick);
      }
      //console.log(matches[i].tournament);
	//If not scores then display the tournament as the subtitle 
	if(matches[i].homeScore == null || matches[i].awayScore == null){ 
		console.log("live scores not there lets display tournament")
		menu.item(0, i, {title: matches[i].homeNick + ' vs ' + matches[i].awayNick, subtitle: matches[i].tournament}); 
	}else{ 
		//Else we display the scores in the subtitle 
		menu.item(0, i, {title: matches[i].homeNick + ' vs ' + matches[i].awayNick, subtitle: matches[i].homeScore + ' - ' + matches[i].awayScore});
	} 
								       
    }
}

/*  
 * Function to create the Upcoming Matches part of the menu
 * Takes a json object as input, and draws up its own section in the menu
 */
function createUpcomingMenu(matches){
    //create 'items' array for each match and then display menu
    var items = [];
    var secUpcoming = { title: 'Upcoming' };
    menu.section(1, secUpcoming);
    for(i in matches){
      //console.log(matches[i].tournament);
      x = Date.now();
      y = matches[i].timestamp * 1000;
      z = y - x;
      //If nick not exist, create a temp one
      if(matches[i].awayNick === ""){
          matches[i].awayNick = matches[i].awayTeam.substring(0,6);
          //console.log("away nick: " + matches[i].awayNick);
      }
      if(matches[i].homeNick === ""){
          matches[i].homeNick = matches[i].homeTeam.substring(0,6);
          //console.log("home nick: " + matches[i].homeNick);
      }
      menu.item(1, i, {title: matches[i].homeNick + ' vs ' + matches[i].awayNick, subtitle: millisToTime(z)});
    }
}

/*
 * Function to create the completed matches part of the menu
 */
function createCompletedMenu(matches){
    //create 'items' array for each match and then display menu
    var items = [];
    var secCompleted = { title: 'Completed' };
    menu.section(2, secCompleted);
    for(i in matches){
      //console.log(matches[i].tournament);
      //If nick not exist, create a temp one
      if(matches[i].awayNick === ""){
          matches[i].awayNick = matches[i].awayTeam.substring(0,6);
          //console.log("away nick: " + matches[i].awayNick);
      }
      if(matches[i].homeNick === ""){
          matches[i].homeNick = matches[i].homeTeam.substring(0,6);
          //console.log("home nick: " + matches[i].homeNick);
      }
      menu.item(2, i, {title: matches[i].homeNick + ' vs ' + matches[i].awayNick, subtitle: matches[i].homeScoreTotal + ' : ' + matches[i].awayScoreTotal});
    }
}

/*
* Main window creation
*/
menu.on('select', function(e){
    // Only show extra info Card if section is Completed Matches.
    // This is an easy hack to not open the card if the section is live or upcoming
    if(e.sectionIndex === 0 || e.sectionIndex === 1){
        return;
    }
    console.log('click');
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //create a new window for the more info to be displayed in
    var wind = new UI.Window({
        status: true,
        scrollable: true,
        backgroundColor: 'white'
        });
    //create a text element to put the header in
    //144 x 168 aplite
    var textTourn = new UI.Text({
        position: new Vector2(0,0),
        size: new Vector2(144,20),
        backgroundColor: 'White',
        color: 'black',
        font: 'gothic-18-bold',
        textOverflow: 'ellipsis',
        textAlign: 'center'
    });
    var textDate = new UI.Text({
        position: new Vector2(0,20),
        size: new Vector2(144,20),
        backgroundColor: 'White',
        color: 'black',
        font: 'gothic-14'
    });
/* Going to leave this out for now, maybe bring it in when i can somehow
detect whta stage its in
    var textStage = new UI.Text({
     position: new Vector2(0,20),
     size: new Vector2(144,15),
     backgroundColor: 'White',
     color: 'Black',
     font: 'gothic-14',
     textAlign: 'center'
   }); */

   //Lets create some UI elements to display the cards
    var line = new UI.Line({
        position: new Vector2(71, 40),
        position2: new Vector2(71, 85),
        strokeColor: 'black',
        strokeWidth: 2
    });

    var textHome = new UI.Text({
        position: new Vector2(0, 40),
        size: new Vector2(71, 30),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-14',
        textOverflow: 'wrap'
    });

    var textAway = new UI.Text({
        position: new Vector2(73, 40),
        size: new Vector2(71, 30),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-14',
        textOverflow: 'wrap'
        //textAlign: 'center'
    });

    var textHomeScore = new UI.Text({
        position: new Vector2(0, 70),
        size: new Vector2(71, 15),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18-bold',
        textOverflow: 'wrap'
        });

    var textAwayScore = new UI.Text({
        position: new Vector2(73, 70),
        size: new Vector2(71, 15),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18-bold',
        textOverflow: 'wrap'
     });

    var textMap0 = new UI.Text({
        position: new Vector2(0, 85),
        size: new Vector2(144, 20),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
    });
    var textMapScoreHome0 = new UI.Text({
        position: new Vector2(0, 105),
        size: new Vector2(71, 18),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
    });
    var textMapScoreAway0 = new UI.Text({
        position: new Vector2(73, 105),
        size: new Vector2(71, 18),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
    });
    var textMap1 = new UI.Text({
        position: new Vector2(0, 123),
        size: new Vector2(144, 20),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
        });
    var textMapScoreHome1 = new UI.Text({
        position: new Vector2(0, 143),
        size: new Vector2(71, 18),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
         });
    var textMapScoreAway1 = new UI.Text({
        position: new Vector2(73, 143),
        size: new Vector2(71, 18),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
        });
    var textMap2 = new UI.Text({
        position: new Vector2(0, 161),
        size: new Vector2(144, 20),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
        });
    var textMapScoreHome2 = new UI.Text({
        position: new Vector2(0, 181),
        size: new Vector2(71, 18),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
        });
    var textMapScoreAway2 = new UI.Text({
        position: new Vector2(73, 181),
        size: new Vector2(71, 18),
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black',
        font: 'gothic-18',
        textAlign: 'center',
        textOverflow: 'wrap'
        });
    var timeTemp = json.completedMatches[e.itemIndex].timestamp * 1000;
    var test = new Date(timeTemp);
//If section is in the upcoming area
   if(e.sectionIndex === 0){
       var array = 'liveMatches';
       textHome.text(json.liveMatches[e.itemIndex].homeTeam);
       textAway.text(json.liveMatches[e.itemIndex].awayTeam);
       textTourn.text(json.liveMatches[e.itemIndex].tournament);
   }
   //If section is in the live area
   else if(e.sectionIndex === 1){
       var array = 'upcomingMatches';
       textHome.text(json.upcomingMatches[e.itemIndex].homeTeam);
       textAway.text(json.upcomingMatches[e.itemIndex].awayTeam);
       textTourn.text(json.upcomingMatches[e.itemIndex].tournament);
   //If section is in the completed area
   }else if(e.sectionIndex === 2){
       //todo if its a 1 mapper, but the same team play 2 maps, join them together into 1 list
       textHome.text(json.completedMatches[e.itemIndex].homeTeam);
       textAway.text(json.completedMatches[e.itemIndex].awayTeam);
       textTourn.text(json.completedMatches[e.itemIndex].tournament);
       var h = test.getHours();
       var m = test.getMinutes();
       console.log("date for completed match: " + test.toDateString() + " " + (h<=9 ? '0' + h : h) + ":" + (m<=9 ? '0' + m : m))
       textDate.text(test.toDateString() + " " + (h<=9 ? '0' + h : h) + ":" + (m<=9 ? '0' + m : m));
       var mapCount = json.completedMatches[e.itemIndex].maps.length;
       //lets find out how many maps there are, and create a card that fits that bill
       console.log("map cpunt: " + mapCount);
       for(j = 0; j < mapCount;j++){
           if(j === 0){
               if(mapCount == 1){
                   //If there is only 1 map, then only display the map name
                   textMap0.text(json.completedMatches[e.itemIndex].maps[j].mapName);
                   wind.add(textMap0);
               }else{
               //add to map0
               // if more then 1 map, then we want to show map scores too
                    textMap0.text(json.completedMatches[e.itemIndex].maps[j].mapName);
                    textMapScoreHome0.text(json.completedMatches[e.itemIndex].maps[j].homeScore);
                    textMapScoreAway0.text(json.completedMatches[e.itemIndex].maps[j].awayScore);
                    var line2 = new UI.Line({
                        position: new Vector2(71, 105),
                        position2: new Vector2(71, 123),
                        strokeColor: 'black',
                        strokeWidth: 2
                    });
                    wind.add(line2);
                    wind.add(textMap0);
                    wind.add(textMapScoreHome0);
                    wind.add(textMapScoreAway0);
               }
           }else if(j === 1){
               //add to map1
               console.log("j is 1");
               textMap1.text(json.completedMatches[e.itemIndex].maps[j].mapName);
               textMapScoreHome1.text(json.completedMatches[e.itemIndex].maps[j].homeScore);
               textMapScoreAway1.text(json.completedMatches[e.itemIndex].maps[j].awayScore);
               var line3 = new UI.Line({
                        position: new Vector2(71, 143),
                        position2: new Vector2(71, 161),
                        strokeColor: 'black',
                        strokeWidth: 2
               });
               wind.add(line3);
               wind.add(textMap1);
               wind.add(textMapScoreHome1);
               wind.add(textMapScoreAway1);
           }else if(j === 2){
               console.log("j is 2");
               //add to map1
               textMap2.text(json.completedMatches[e.itemIndex].maps[j].mapName);
               textMapScoreHome2.text(json.completedMatches[e.itemIndex].maps[j].homeScore);
               textMapScoreAway2.text(json.completedMatches[e.itemIndex].maps[j].awayScore);
               var line4 = new UI.Line({
                        position: new Vector2(71, 181),
                        position2: new Vector2(71, 199),
                        strokeColor: 'black',
                        strokeWidth: 2
               });
               wind.add(line4);
               wind.add(textMap2);
               wind.add(textMapScoreHome2);
               wind.add(textMapScoreAway2);
           }
           //create text feild where map can go, then add them to window
       }
       //textMap.text(textMapInfo);
       textHomeScore.text(json.completedMatches[e.itemIndex].homeScoreTotal);
       textAwayScore.text(json.completedMatches[e.itemIndex].awayScoreTotal);
   }
   //textStage.text('Grand Final');
   //card.body('test card');

   //card.add(line);
    //card.show();
    wind.add(textTourn);
    wind.add(textDate);
    wind.add(line);
   // wind.add(textStage);
    wind.add(textHome);
    wind.add(textAway)
    //wind.add(textMap);
    wind.add(textHomeScore);
    wind.add(textAwayScore);
    wind.show();
});

menu.on('longSelect',function(e){
    //on longselect for an upcoming match, lets add a pin to timeline dude
    //Only do it for upcoming matches
    if(e.sectionIndex === 0 || e.sectionIndex === 2){
        return;
    }
    var pinCard = new UI.Card({
            body: 'Adding Pin...',
            style: 'large',
            title: 'CSontheGO'
    });
    pinCard.show()
    //create pin
    // Need to make the epoch time into milliseconds to conform to what js needs
    var timeMs = json.upcomingMatches[e.itemIndex]['timestamp'] * 1000;
    var datePin = new Date(timeMs).toISOString();
    console.log("date " + datePin);
    //Lets also create the body text here
    if(json.upcomingMatches[e.itemIndex]['awayNick'] === ""){
        json.upcomingMatches[e.itemIndex]['awayNick'] = json.upcomingMatches[e.itemIndex]['awayNick'].substring(0,6);
        console.log("away nick: " + json.upcomingMatches[e.itemIndex]['awayNick']);
    }
    if(json.upcomingMatches[e.itemIndex]['homeNick'] === ""){
        json.upcomingMatches[e.itemIndex]['homeNick'] = json.upcomingMatches[e.itemIndex]['homeNick'].substring(0,6);
        console.log("home nick: " + json.upcomingMatches[e.itemIndex]['homeNick']);
    }

    body = json.upcomingMatches[e.itemIndex]['tournament'] + "\n" + json.upcomingMatches[e.itemIndex]['homeTeam'] + " vs " + json.upcomingMatches[e.itemIndex]['awayTeam'];
    var PIN_ID = 'csonthego' + e.itemIndex + timeMs;
    var pin = {
        'id': PIN_ID,
        'time': datePin,
        'layout': {
            'type': 'genericPin',
            'title': json.upcomingMatches[e.itemIndex]['homeNick'] + " vs " + json.upcomingMatches[e.itemIndex]['awayNick'],
            'body': body,
            'tinyIcon': 'system://images/SCHEDULED_EVENT',
            'backgroundColor': 'VividCerulean'
        },
        "reminders": [
        {
            "time": datePin,
            "layout": {
                 "type": "genericReminder",
                 "tinyIcon": 'system://images/SCHEDULED_EVENT',
                 "title": json.upcomingMatches[e.itemIndex]['homeNick'] + " vs " + json.upcomingMatches[e.itemIndex]['awayNick'] + " match is starting.."
            }
         }]
    };
    console.log('Inserting pin in the future: ' + JSON.stringify(pin));

    timeline.insertUserPin(pin, function(responseText){

        console.log('Result: ' + responseText);
        if(responseText === "OK"){
            pinCard.body("Successfully added pin!");
            //todo lets buzz or do an onscreen notification!
            //Add a card with successfully added notification and hide in 3s
            setTimeout(function() {
                pinCard.hide();
            }, 1500);
        }else{
            //display card with error message :(
            pinCard.title("Not successful");
            pinCard.body("Did not add because of: " + responseText);
        }
    });

});


function amReady(){
    splashWindow.hide()
    menu.show();
}

function millisToTime(ms) {
    x = ms / 1000;
    var seconds = Math.floor(x % 60);
    x /= 60;
    var minutes = Math.floor(x % 60);
    x /= 60;
    var hours = Math.floor(x % 24);
    x /= 24;
    var days = Math.floor(x);
    if (days == '' && hours == '') {
        return minutes + ' Minutes, '  + seconds + ' Seconds';
    } else if (days == '') {
        return  hours + ' Hours, ' + minutes + ' Minutes';
    } else {
        return  days + ' Days, ' + hours + ' Hours, ' + minutes + ' Minutes';
    }

}
