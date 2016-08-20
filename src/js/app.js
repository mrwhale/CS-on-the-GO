var UI = require('ui');
var Vector2 = require('vector2');
/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 
var ajax = require('ajax');
var UI = require('ui');
var Vector2 = require('vector2');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
ajax({url: 'www.google.com.au'},
    function(data){
      console.log(data);
    });

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }, {
        title: 'Third Item',
      }, {
        title: 'Fourth Item',
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Dynamic\nWindow',
    textAlign: 'center'
  });
  var windSize = wind.size();
  // Center the radial in the window
  var radialPos = radial.position()
      .addSelf(windSize)
      .subSelf(radial.size())
      .multiplyScalar(0.5);
  radial.position(radialPos);
  // Center the textfield in the window
  var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.5);
  textfield.position(textfieldPos);
  wind.add(radial);
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/
//var UI = require('ui');
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
        console.log(i);
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
   var wind = new UI.Window({status: true});
   //create a text element to put the header in
   //144 x 168
   var textHome = new UI.Text({
      position: new Vector2(0, 0),
      size: new Vector2(71, 60),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-14',
      textOverflow: 'wrap'
    });

    var textAway = new UI.Text({
      position: new Vector2(73, 0),
      size: new Vector2(71, 60),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-14',
      textOverflow: 'wrap'
    });

    var textMap = new UI.Text({
      position: new Vector2(0, 60),
      size: new Vector2(144, 30),
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
      font: 'gothic-14',
      textOverflow: 'wrap'
    });

   if(e.sectionIndex === 0){
       var array = 'upcomingMatches';
       textHome.text(json.upcomingMatches[e.itemIndex].homeTeam);
       textAway.text(json.upcomingMatches[e.itemIndex].awayTeam);
       console.log(json.upcomingMatches[e.itemIndex].tournament);
   }
   else if(e.sectionIndex === 1){
       var array = 'liveMatches';
       textHome.text(json.liveMatches[e.itemIndex].homeTeam);
       textAway.text(json.liveMatches[e.itemIndex].awayTeam);
       console.log(json.liveMatches[e.itemIndex].tournament);

   }else if(e.sectionIndex === 2){
       textHome.text(json.completedMatches[e.itemIndex].homeTeam);
       textAway.text(json.completedMatches[e.itemIndex].awayTeam);
       console.log(json.completedMatches[e.itemIndex].tournament);
       textMap.text(json.completedMatches[e.itemIndex].maps[0].mapName);
   }
   //card.body('test card');
   var line = new UI.Line({
    position: new Vector2(10, 10),
    position2: new Vector2(72, 84),
    strokeColor: 'white'
   });
   //card.add(line);
    //card.show();
    wind.add(textMap);
    wind.add(textHome);
    wind.add(textAway)
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