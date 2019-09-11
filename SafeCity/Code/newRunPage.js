// Code for the Measure Run page.

//The following variables are made global for future use
var markers = [];
var marker=null;
var randomMarker=null;

var heatMapKeeper;

//variables to work with the running app itself 
var map, infoWindow, pos, posCurrent, outputMessage, startLocation, endLocation, posArray, newposArray, totalDist, tempPos1, tempPos2, checkDist, runName, runDescribe, accuracy, tempRun, startTime, endTime;
var distRemain = 0;
var run;
var newpos = null;
var check=null;
var output="";
var runStart = false;
//temporary variables for the run class
var startTimegetTime,endTimegetTime,startTimetoLocale, endTimetoLocale;

//variables for the google API
var line,loopFunc, ID, marker, circle,pathID;
var output;
var lineCoords=[];
var distBetween = 0;
var indexDist = 0;

//variables for reattempt Run
var startMarker,endMarker,startposArray;
var chosen = false;

////disabling the button initially
//document.getElementById("NewDest").disabled = true;
//
////Initial condition to check if the user has selected a destination or not.
//if (newpos==null) {
//    document.getElementById("NewRun").disabled = true;    
//    document.getElementById("endRun").disabled = true;    
//}

displayMessage("Finding where you are...");

//load chosen from storage to determine if the user is reattempting run;
chosen=JSON.parse(localStorage.getItem("reattemptRun"));

//check if reattempt is chosen.
if(chosen==true){
    var runIndex = localStorage.getItem(APP_PREFIX + "-selectedRun"); 
    var storedRuns = JSON.parse(localStorage.getItem(APP_PREFIX, runJSON));
    userRun = storedRuns[runIndex];
}

//function for displaying the Map
function initMap() {
        // Initialise map, centred on Melbourne, Australia.
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -37.5622, lng: 143.8503},
            zoom: 18
        });
              infoWindow = new google.maps.InfoWindow;

        // code to make the system track the user's present location
       if (navigator.geolocation) {
          ID = navigator.geolocation.watchPosition(function(position) {
//             pos = {
//              lat: position.coords.latitude,
//              lng: position.coords.longitude
//            };
              // Put the object into storage
              localStorage.setItem('pos', JSON.stringify(pos))

            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found at: '+' '+pos.lat.toFixed(2)+' '+pos.lng.toFixed(2));
//            infoWindow.open(map);
//            map.setCenter(pos);
//              
            accuracy = position.coords.accuracy;
              
            if(chosen==true){
                reRun();
            }
            else{
//                  //condition to check if the accuracy is less than twenty
//                if(accuracy < 150){
//                    //disable random destination button if accuracy is not good enough
//                    document.getElementById("NewDest").disabled = false;
//                }
//                if(accuracy > 150){
//                    displayMessage("Cannot accurately detect where you are!!");
//                    document.getElementById("NewDest").disabled = true;
//                }
            }
            if(runStart){
                document.getElementById("NewDest").disabled = true;
            }
            if(marker){
                //marker.setMap(null);
            }
            if(circle){
                //circle.setMap(null);
            }
               //place marker at current location 
                marker = new google.maps.Marker({
                position: pos,
                icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3
                    },
                draggable: false,
                map: map
               
            });
              circle = new google.maps.Circle({
                map: map,
                radius: accuracy,    // 10 miles in metres
                fillColor: '#AA0000' 
              });
              //outputs a circle with the marker at the center
              circle.bindTo('center', marker, 'position');

              //to output the information about the user
//            document.getElementById("lat").innerHTML=pos.lat.toFixed(3);
//            document.getElementById("lng").innerHTML=pos.lng.toFixed(3);
//            document.getElementById("accuracy").innerHTML=accuracy.toFixed(3);
//              
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
}

//a function that outputs an error if the user's browser is unable to support the application or cannot connect to the internet service
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//function to produce a random destination within the radius of 60m to 150m              
function randomDestination(pos){
//condition to check if the destination whithin the conditions is satisfied or not. If not, it will continue to loop until it does.
check=true;
while(check){

    //determining marker to become less that 150m
    //and putting it inside the object
    var newlat,newlng, plusMinus, rdm
    var val= []
    
    //determining the randomness(positive and negative)
    for (i = 0; i < 2; i++){
    plusMinus = Math.random()
        if (plusMinus > 0.5) {
        val[i] = (0.002*Math.random())
        }
        else{
        val[i] = (-0.002*Math.random())
        }
    //placing results in rdm array
    rdm = [val[0], val[1]];
    }
    
    //determining new positioning or random destination
    newpos = new Object();
    newpos.lat = pos.lat+(val[0]); 
    newpos.lng = pos.lng+(val[1]); 

    //console.log(newpos); 
    
    //determining the distance between 2 points
    posArray = new google.maps.LatLng(pos.lat, pos.lng);
    newposArray = new google.maps.LatLng(newpos.lat, newpos.lng);

    checkDist = google.maps.geometry.spherical.computeDistanceBetween(posArray, newposArray);
    //console.log("Total Distance "+totalDist)
    
    //break loop as soon as satisfies the conditions
     if (checkDist >= 60 && checkDist <= 150 ){check=false;}
}
     // place marker for random destination
        console.log("marker placed at " + checkDist)
        if(randomMarker)
        {
            //randomMarker.setMap(null);
        }
        //generates a marker on the location of the random location
        randomMarker = new google.maps.Marker({
                position: newposArray,
                draggable: false,
                animation: google.maps.Animation.DROP,
                map: map,
        });
    document.getElementById("NewRun").disabled = false;
}

//function to begin the run. Creates new class and stores into the local variables. Once activated the buttons for producing destinations and beginning a new run are disabled.
function beginRun(){ 
    //disables buttons when function is activated.
    document.getElementById("NewDest").disabled = true;
    document.getElementById("NewRun").disabled = true;
    
    //ensures random Destination is disabled.
    runStart = true;
    
    //disable marker for tracking user in reattempt
    if(chosen==true){
        if(startMarker){
            //startMarker.setMap(null);
            endMarker = new google.maps.Marker({
            position: runInstance._endLocation,
            draggable: false,
            title: "Destination",
            map: map
        });
        }
    }
    
    //loads the Object on the position data from localStorage
    //for StartLocation
    startTime = new Date();
    startTimetoLocale = startTime.toLocaleTimeString();
    startTimegetTime = startTime.getTime();
    
    //Resets the total distance ran by the user back to zero before function is executed.
    totalDist=0;
    
    //loops function to make update the time constantly
    loopFunc = setInterval(updatePath,1000);
}

//a function that is constantly called at time of 500ms in order to draw the line between the current position of the user and the previous location the user was in.
function updatePath(){
    pathID = navigator.geolocation.watchPosition(function(position) {
             pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
    });
    
    //produce a latlng interval for the coordinates of the user at the current positions
    currentCoord = new google.maps.LatLng(pos.lat, pos.lng);

    //updates the array with the coordinates of the user.
    lineCoords.push(currentCoord);
    
    //calculated distance remaining to target destination
    distRemain = google.maps.geometry.spherical.computeDistanceBetween(currentCoord, newposArray);
    
    //To calculate the distance between current position and destination
    if(indexDist >= 1){
        tempPos1 = lineCoords[indexDist-1];
        tempPos2 = lineCoords[indexDist];
        distBetween = google.maps.geometry.spherical.computeDistanceBetween(tempPos1,tempPos2);
    }
    
    //To sum up the distance travelled by the user.
    //totalDist+=distBetween;
    totalDist+=distBetween;
    //draws the line of given coordinates
    polyline = new google.maps.Polyline({
                path: lineCoords,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2.4,
                map: map
            });
    polyline.setMap(map);
    
    //constantly update user on how much distance is left to be completed.
    document.getElementById("distRemain").innerHTML = distRemain.toFixed(2);
    document.getElementById("distRan").innerHTML = totalDist.toFixed(2);
    //condition to execute endRun function if the user is less than 10 metres away from the destination
    if(distRemain < 10){
        indexDist = 0;
        document.getElementById("endRun").disabled = false;
    }
    else{
        document.getElementById("endRun").disabled = true;
    }
    indexDist++;
}

//function triggered when the Run has ended upon condition of distRemain < 10
function endRun(){
    //end the timer and hence stops the function
    clearInterval(loopFunc);
//    //stop following the position of the user
//    navigator.geolocation.clearWatch(pathID);
//    
//    //saves the current time when the function does stop
//    endTime = new Date();
//    endTimetoLocale = endTime.toLocaleTimeString();
//    endTimegetTime = endTime.getTime();
//    
//    //create run Instance
//    run = new Run(posArray,newposArray,startTimegetTime,endTimegetTime,startTimetoLocale,endTimetoLocale);
//    
//    //method to push the coordinates into the pathTaken attribute
//    run.pathCoord(lineCoords);
//    
//    //outputs the time taken by user onto the output display when the run is complete.
//    output+="Results for Run: "+"</br>";
//    output+="Time taken to complete run: "+run.timeTaken()+"s"+"</br>";
//    output+="Total Distance ran: "+run.distanceRan()+"m"+"</br>";
//    output+="Average Speed: "+run.averageSpeed()+"m/s"+"</br>";
//
//    document.getElementById("result").innerHTML = output;
}

//function to store user's run into localStorage
function saveRun(){
    if (typeof(Storage) !== "undefined")
    {
        //condition only branched when array savedRuns contains data
        if(localStorage.getItem(APP_PREFIX)){
            //load previously saved data
            runJSON = localStorage.getItem(APP_PREFIX,runJSON);

            //loads previously saved data array onto savedRuns 
            savedRuns=JSON.parse(runJSON);
            
            //allows user to input data regarding their run.
            runName = prompt("What would you like to name this run?");
            run.nickname = runName;
            
            runDescribe = prompt("Any comments / description you would like to describe for this run?");
            run.description = runDescribe;
            
            //update new run(s) onto the array
            savedRuns.push(run);
            
            //after updated with the new run from user, save the data back into localStorage
            runJSON = JSON.stringify(savedRuns);
            localStorage.setItem(APP_PREFIX,runJSON);
            
            //output messag when is correctly executed
            displayMessage("Your run has been saved");
            document.getElementById("SaveRun").disabled = true;  
            document.location.href='index.html';
        }
        else {
            //branch to this condition only if the application has never saved the data before or contains no data in savedRuns.
            //allows user to input data regarding their run.
            runName = prompt("What would you like to name this run?");
            run.nickname = runName;
            
            runDescribe = prompt("Any comments / description you would like to describe for this run?");
            run.description = runDescribe;
            
            //update savedRuns with data from user's run
            savedRuns.push(run);
            console.log(savedRuns);
            //save run to localStorage
            runJSON = JSON.stringify(savedRuns);
            localStorage.setItem(APP_PREFIX,runJSON);
            displayMessage("Your run has been saved");
            document.getElementById("SaveRun").disabled = true; 
            document.location.href='index.html';
        }
    }
    else
    {
        alert("Your device does not support localStorage.")
        displayMessage("Run cannot be saved.");
    }
        /*runName=prompt("What would you like to name this run?");
        savedRuns.push(run);
        console.log(savedRuns);
        var runJSON = JSON.stringify(savedRuns);
        
        //Stores the data into the localStorage including 
        localStorage.setItem(APP_PREFIX, savedRuns);
        document.location.href = 'index.html';
        displayMessage("Your run has been saved.");*/
    run=null;
    chosenJSON = JSON.stringify(chosen);
    localStorage.setItem("reattemptRun",chosenJSON);
}

function reRun(){
    //Test if user is reattempting run
    if(localStorage.getItem(APP_PREFIX+"-selectedRun")){
        var runIndex = localStorage.getItem(APP_PREFIX + "-selectedRun"); 
        var storedRuns = JSON.parse(localStorage.getItem(APP_PREFIX, runJSON));
        userRun = storedRuns[runIndex];
                  
        document.getElementById("NewDest").disabled = true;
        document.getElementById("NewRun").disabled = true;
        document.getElementById("endRun").disabled = true;
                  
        alert('Please return to starting point of run (boucning marker)');
        displayMessage("Reattempting Run...")
        
        runInstance = new Run();
        runInstance.initialiseFromPDO(userRun);
                  
        startMarker = new google.maps.Marker({
            position: runInstance._startLocation,
            animation: google.maps.Animation.BOUNCE,
            draggable: false,
            title: "Starting Position",
            map: map
        });
        //determining the distance between 2 points
        posArray = new google.maps.LatLng(pos.lat, pos.lng);
        startposArray = runInstance.startLocation;
        newposArray = runInstance.endLocation;
        checkDist = google.maps.geometry.spherical.computeDistanceBetween(posArray, startposArray);
        if(checkDist < 10){
            beginRun();
            chosen = false;
        }
    }
    else{
        alert('Unable to load Run.');
        displayMessage("Error: Run not Found.")
    }
}
                   
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

//var information = '';
//var title_info = '';
//function update_information(){
//    information = '<div id="content">'+
//                '<div id="siteNotice">'+
//                '</div>'+
//                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//                '<div id="bodyContent">'+
//                '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//                'sandstone rock formation in the southern part of the '+
//                'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//                'south west of the nearest large town, Alice Springs; 450&#160;km '+
//                '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//                'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//                'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//                'Aboriginal people of the area. It has many springs, waterholes, '+
//                'rock caves and ancient paintings. Uluru is listed as a World '+
//                'Heritage Site.</p>'+
//                '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//                'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//                '(last visited June 22, 2009).</p>'+
//                '</div>'+
//                '</div>';
//    title_info = '';
//}
//var infowindow = new google.maps.InfoWindow({
//  content: information  
//})