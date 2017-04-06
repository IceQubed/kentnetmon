# kentnetmon
*iPerf3 web frontend &amp; datalogger*

This system allows a user to set up automated iPerf3 tests and view the results of previous tests in a graphical format. This is the 'webserver' part of the project - the 'agents' are Raspberry Pis or any other machine on the network that runs iPerf3 as a server.

![Screenshot](http://i.imgur.com/MEstUXo.png)

## Server Installation:
 1. Ensure port 5201 and 8080 are open, and the server has open access to download npm packages from the internet
 2.	Install Node.js - https://nodejs.org/en/download/
 3.	Install MongoDB - https://docs.mongodb.com/manual/administration/install-community/
 4.	Set up the MongoDB database to store the KentNetMon data
 5.	Use git clone to download the project to the folder you want to run it from
 6.	In the project folder run ‘npm install’ to download all necessary packages
 7.	Run ‘npm install forever -g’ to install the ‘Forever’ package
 8.	Edit line 235 of database.js in the project folder with the database connection string of the database you set up in step 4
 9.	Run ‘forever start app.js’ – the server should now be running on port 8080.

## Agent Installation
 1.	Install Raspbian on a Pi
 2.	Enable SSH in raspi-config to allow remote access
 3.	Expand file system in raspi-config to make full use of SD card size
 4.	Install iPerf3 (NOT iPerf)
 5.	Add line to /etc/rc.local : ‘iperf3 -s -D’
 6.	If desired, set up WiFi on the Pi
 7.	Place Pi wherever needed on campus

## Server Maintenance
 - It may be desired to manually edit the database’s data. RoboMongo is recommended for this purpose. Port 27017 will need to be open for the connection to work.
 - If the server needs to be taken down, use ‘forever stopall’.
 - If changes are made to the server code in the git repository, use ‘git pull && npm i && forever restartall’ to update. Next do step 8 of server installation again. 
 - Refer to the ‘forever’ usage guide for more options - https://www.npmjs.com/package/forever#command-line-usage 

##Website Usage
Google Chrome, Microsoft Edge, and Chrome for Android are supported. Other browsers may incorrectly display graphs or date selection input.

The image above shows the main ‘dashboard’ page of the system, from which graphs of previous results are shown along the figures on the left-hand side showing the latest data. The date range of the system can be selected from the drop-down calendar. When the date range is changed, the page will reload data for the specified graph. 

The user can hover over a result in the graph, to see a readout of the full measurement and date/time for that result. This is more accurate than estimating from the graph’s Y axis alone. If one of the graph legends is clicked, it is toggled from being displayed on the graph.

Tests can be ran from the side menu, allowing the user to run tests as required instead of only to a schedule. Both TCP and UDP tests – or both in turn – can be started from the dashboard.

The ‘mini graph’ shown below the graph is a ‘sub-graph’, which allows the user to zoom in to the main graph. Simply click and drag along the mini graph on the range to be viewed. The view can be moved by dragging the highlighted section across the mini graph, and can be reset by clicking on the mini graph outside the selected area.

There is a scheduling page for controlling the timing of planned testing. It is recommended to schedule tests at 30 minute intervals if testing is desired for more than a few days. This is because a lower interval causes a very high number of tests to be ran across a day, meaning the page’s graphs will load very slowly due to the excess data points to be displayed. The schedule page's drop-down menu has some useful default values, however for more control use the ‘advanced setup’ option, allowing entry of the schedule in cron-like format. Refer to the link on the scheduling page for more information. Schedules can be deleted from this page. Feel free to experiment with the advanced setup option, as the schedules will be displayed when they are set meaning the user can see exactly when the test will run as soon as they add the schedule.

The 'add agent' page is a simple form that allows entry of a new agent into the system. Name the agent something memorable, for example ‘Dev Pi’, provide its address, for example ‘129.12.136.4’, and its location, for example ‘Darwin Wiring Centre’. On submitting the form, the user is redirected to the home page. 

Agent deletion is handled from the home page, and pops up a confirmation box. Agent deletion removes all associated data such as results and schedules, so do not delete an agent if result history is required. 

