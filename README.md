# Assignment 2: Shuffling Pines
# Benjamin Salter
Shuffling Pines: an app for a vaguely ominous place to send one's loved ones.
The main page has a patient submission form, then upon submission automatically switches to a patient management form.
The patient management form has live editing - no submit required.

# gulp options:
## gulp test: runs jshint and karma
## gulp build: builds the source and copies it into dist directory
## gulp autorun: creates an autorun/autobuild server
## default runs build & test

Fastest way to get it up and going:
run npm install and bower install, then run gulp build, then gulp autorun and point your browser to the url it provides, or point your browser at the dist/index.html file.

Known issues:
input type="date" doesn't work properly in Firefox. After fiddling with it for a while, I decided to just
use an ordinary text input for the transition date. That does allow a user to enter an invalid date.
Had a lot of problems testing with localStorage within Jasmine, so I eventually gave up.


