var UI = require('ui');
var Vector2 = require('vector2');

//todo display messages on errors when cant load etc
// Hysuo65lk
// 
//todo add this splash screen on load
//var splashScreen = new UI.Card({ banner: 'images/splash.png' });
//splashScreen.show();

//Event listener to make sure app is ready!

Pebble.addEventListener('ready', function() {
  // PebbleKit JS is ready!
  console.log('PebbleKit JS ready!');
});
//Create a new UI
//turns out you cant change font in a pebblejs menu list :( 
// so sad

var menu = new UI.Menu();
getCSGO();

//todo extend this to be able to handle the filter options too
/*
 * Function is used to get the json feed from the datastore
 * Maybe make this require URL as input, would make it more friendly to change
 * IP is hard coded at this time, once domain name is setup will replace with that
 */


function getCSGO(){
  console.log('fetching csgo');
  var req = new XMLHttpRequest();
  console.log('watchtoken' + Pebble.getWatchToken());
  var url = 'http://52.65.110.247/pebble/v1/' + Pebble.getWatchToken();
  console.log(url);
  req.open("GET", url);
  // Specify the callback for when the request is completed
  req.onload = function() {
    if(req.readyState === 4 ){
        if(req.status === 200){
            // The request was successfully completed!
            json = JSON.parse(req.responseText);
            console.log('creating Upcoming menu items');
            createUpcomingMenu(json.upcomingMatches);
            console.log('Creating Live menu items');
            createLiveMenu(json.liveMatches);
            console.log('Creating Complted menu items');
            createCompletedMenu(json.completedMatches);
            
            
        }else{
            console.log('Error in http');
        }
    }else{
        console.log('req state is error');
    }
  };

  // Send the request
  req.send(null);
  //https://pebble.github.io/pebblejs/
}

/*
 * Function to create the Upcoming Matches part of the menu
 * Takes a json object as input, and draws up its own section in the menu
 */
function createUpcomingMenu(matches){
    //create "items" array for each match and then display menu
    var items = [];
    var secUpcoming = { title: 'Upcoming' };
    menu.section(0, secUpcoming);
    for(i in matches){
      //console.log(matches[i].tournament);
      x = Date.now()
      y = matches[i].timestamp * 1000;
      z = y - x;
    if (matches[i].homeNick !== "") {
        homeName = matches[i].homeNick;
        awayName = matches[i].awayNick;

    } else {
        homeName = matches[i].homeTeam;
        awayName = matches[i].awayTeam;

    }
      menu.item(0, i, {title: homeName + " vs " + awayName, subtitle: millisToTime(z)})
    }
}
/*
 * Function to create the Live Matches part of the menu
 * Takes a json object as input, and draws up its own section in the menu
 * todo if there are no live matches, dont display
 * todo move live matches to the first part of the menu
 */
function createLiveMenu(matches){
    //create "items" array for each match and then display menu
    var items = [];
    var secLive = { title: 'Live' };
    menu.section(1, secLive);
    for(i in matches){
      //console.log(matches[i].tournament);
      menu.item(1, i, {title: matches[i].homeTeam + " vs " + matches[i].awayTeam})
    }
}

/*
 * Function to create the completed matches part of the menu
 */
function createCompletedMenu(matches){
    //create "items" array for each match and then display menu
    var items = [];
    var secCompleted = { title: 'Completed' };
    menu.section(2, secCompleted);
    for(i in matches){
      //console.log(matches[i].tournament);
      menu.item(2, i, {title: matches[i].homeNick + " vs " + matches[i].awayNick, subtitle: matches[i].homeScoreTotal + " : " + matches[i].awayScoreTotal})
    }
}

/*
* Main window creation
*/
menu.on('select', function(e){
   console.log('click');
   console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
   //create a new window for the more info to be displayed in
   var wind = new UI.Window({
     status: true,
     scrollable: true
     });
   //create a text element to put the header in
   //144 x 168
   var textTourn = new UI.Text({
     position: new Vector2(0,0),
     size: new Vector2(144,20),
     backgroundColor: 'White',
     color: 'Black',
     font: 'gothic-18-bold',
     textOverflow: 'wrap',
     textAlign: 'center'
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

   var textHome = new UI.Text({
      position: new Vector2(0, 20),
      size: new Vector2(71, 30),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-14',
      textOverflow: 'wrap'
    });

    var textAway = new UI.Text({
      position: new Vector2(73, 20),
      size: new Vector2(71, 30),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-14',
      textOverflow: 'wrap',
      textAlign: 'center'

    });

   var textHomeScore = new UI.Text({
      position: new Vector2(0, 50),
      size: new Vector2(71, 15),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-18-bold',
      textOverflow: 'wrap'
    });

    var textAwayScore = new UI.Text({
      position: new Vector2(73, 50),
      size: new Vector2(71, 15),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-18-bold',
      textOverflow: 'wrap',
      textAlign: 'center'

    });


//If section is in the upcoming area
   if(e.sectionIndex === 0){
       var array = 'upcomingMatches';
       textHome.text(json.upcomingMatches[e.itemIndex].homeTeam);
       textAway.text(json.upcomingMatches[e.itemIndex].awayTeam);
       textTourn.text(json.upcomingMatches[e.itemIndex].tournament);
   }
   //If section is in the live area
   else if(e.sectionIndex === 1){
       var array = 'liveMatches';
       textHome.text(json.liveMatches[e.itemIndex].homeTeam);
       textAway.text(json.liveMatches[e.itemIndex].awayTeam);
       textTourn.text(json.liveMatches[e.itemIndex].tournament);
   //If section is in the completed area
   }else if(e.sectionIndex === 2){
       textHome.text(json.completedMatches[e.itemIndex].homeTeam);
       textAway.text(json.completedMatches[e.itemIndex].awayTeam);
       textTourn.text(json.completedMatches[e.itemIndex].tournament);
       var mapCount = json.completedMatches[e.itemIndex].maps.length;
       for(j = 0; j < mapCount;j++){
             textMap = new UI.Text({
                position: new Vector2(0, 65),
                size: new Vector2(144, 30),
                borderColor: 'white',
                backgroundColor: 'white',
                color: 'black',
                font: 'gothic-18',
                textAlign: 'center',
                textOverflow: 'wrap'
            });
            textMap.text(json.completedMatches[e.itemIndex].maps[j].mapName);
           console.log(json.completedMatches[e.itemIndex].maps[j].mapName);
           wind.add(textMap);
           //create text feild where map can go, then add them to window
       }
       textHomeScore.text(json.completedMatches[e.itemIndex].homeScoreTotal);
       textAwayScore.text(json.completedMatches[e.itemIndex].awayScoreTotal);
   }
   //textStage.text('Grand Final');
   //card.body('test card');
   var line = new UI.Line({
    position: new Vector2(10, 10),
    position2: new Vector2(72, 84),
    strokeColor: 'white'
   });
   //card.add(line);
    //card.show();
    wind.add(textTourn);
   // wind.add(textStage);
    wind.add(textHome);
    wind.add(textAway)
    wind.add(textHomeScore);
    wind.add(textAwayScore);
    wind.show();
});
menu.show();

/*menu.selection(function(e){
   console.log('click'); 
});
menu.on('click', 'select', function(e) {
    var card = new UI.Card();
    card.title('A Card');
    card.body('the simplest window')
    card.show();
});*/
function millisToTime(ms) {
    x = ms / 1000;
    seconds = Math.floor(x % 60);
    x /= 60;
    minutes = Math.floor(x % 60);
    x /= 60;
    hours = Math.floor(x % 24);
    x /= 24;
    days = Math.floor(x);
    if (days == "" && hours == "") {
        return minutes + " Minutes, "  + seconds + " Seconds";
    } else if (days == "") {
        return  hours + " Hours, " + minutes + " Minutes";
    } else {
        return  days + " Days, " + hours + " Hours, " + minutes + " Minutes";
    }

}