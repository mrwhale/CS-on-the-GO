var UI = require('ui');
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

Pebble.addEventListener('ready', function() {
  // PebbleKit JS is ready!
  console.log('PebbleKit JS ready!');

  getCSGO();
});

var menu = new UI.Menu();

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
            //console.log('Got response: ' + req.responseText);
            var json = JSON.parse(req.responseText);
            console.log('creatingUpcoming menu items');
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

function createUpcomingMenu(matches){
    //create "items" array for each match and then display menu
    var items = [];
    var secUpcoming = { title: 'Upcoming' };
    menu.section(0, secUpcoming);
    for(i in matches){
      //console.log(matches[i].tournament);
      menu.item(0, i, {title: matches[i].homeTeam + " vs " + matches[i].awayTeam, subtitle: matches[i].timestamp})
    }
}

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

function createCompletedMenu(matches){
    //create "items" array for each match and then display menu
    var items = [];
    var secCompleted = { title: 'Completed' };
    menu.section(2, secCompleted);
    for(i in matches){
      //console.log(matches[i].tournament);
      menu.item(2, i, {title: matches[i].homeTeam + " vs " + matches[i].awayTeam, subtitle: "2 : 0"})
    }
}

menu.show();