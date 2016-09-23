# CS on the GO

Pebble app to display upcoming, live and completed CSGO match details

This app is currently in beta, and the basic functionality works. Displays all upcoming CSGO match information,
as well as completed match information with extra detials listed if you click through (see screenshots for example)

App can be found here:
http://apps.getpebble.com/en_US/application/57c24bc35e3c3db4850002af

This app is built entirely with [pebbleJS](https://pebble.github.io/pebblejs/). If it gets enough liking, I will consider re-writing the watch part in c (so its native, performance and battery boost etc)
Originally written in pebblejs as it was super easy, didnt have to worry about appmessage and could get a prototype up pretty quick (within 8 hours I had a working app)
It seems I will have to rewrite in C, or wait until they release rockyjs api to have this working with pebble2 :(

### How to use

1. Install the app!
2. Scroll through the menu to view details!
  * Press the select button on any completed Match to show more details

### Features
* view live, upcoming and completed CSGO match details
* view more information for completed matches
* Pin upcoming matches to your timeline, and be reminded when they start

### screenshots


### Upcoming features in 1.0 release

1. Configuration page
  * Filter results how you want. Choose what tournaments you want to see, what teams you wish to only see, and what type, and how many
2. Pin upcoming matches to your timeline with long press!
3. Colour!
4. Diorite support (os4.0)

### Feature ideas for later releases

1. Add reminder/timeline pin for live games
2. More filters. Filter the results based on more things
4. List and view team information
3. Statistics. Get team stats
4. Upcoming "card" to show team vs team stats based on previous match ups and percentage to win
5. live match "card" to display current game info.

### Credits
[pebbleJS](https://pebble.github.io/pebblejs/)
[Pebble Clay](https://github.com/pebble/clay/blob/v0.1.7/README.md)
