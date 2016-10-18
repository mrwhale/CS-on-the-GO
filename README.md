# CS on the GO

Pebble app to display upcoming, live and completed CSGO match details

Displays all upcoming CSGO match information,
as well as completed match information with extra detials listed if you click through (see screenshots for example). You can also filter the results to what you desire

App can be found here:
http://apps.getpebble.com/en_US/application/57c24bc35e3c3db4850002af

http://pblweb.com/badge/57c24bc35e3c3db4850002af/orange/small

This app is built entirely with [pebbleJS](https://pebble.github.io/pebblejs/). If it gets enough liking, I will consider re-writing the watch part in c (so its native, performance and battery boost etc)
Originally written in pebblejs as it was super easy, didnt have to worry about appmessage and could get a prototype up pretty quick (within 8 hours I had a working app)
It seems I will have to rewrite in C, or wait until they release rockyjs api to have this working with pebble2 :(

#### Known issue
There is an issue where I can't seem to reload the page after a config change in the settings page. This just means if the filter results that are returned after you change the filters are fewer then what is already displayed on the screen, you will see old results until you restart the app. Still trying to find a work around for this

### How to use

1. Install the app!
2. Scroll through the menu to view details!
* Press the select button on any completed Match to show more details
* Long Press on any upcoming match to add a pin to your timeline!

### Features
* view live, upcoming and completed CSGO match details
* view more information for completed matches
* Pin upcoming matches to your timeline, and be reminded when they start
* filter your results based on the teams/tournaments you want to follow!

### screenshots


### Upcoming features in 1.1 release
1. Colour!
2. Diorite support (os4.0)

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
