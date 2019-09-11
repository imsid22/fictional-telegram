// Code for the View Run page.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var runIndex = localStorage.getItem(APP_PREFIX + "-selectedRun"); 

if (runIndex !== null)
{
    // If a run index was specified, show name in header bar title. This
    // is just to demonstrate navigation.  You should set the page header bar
    // title to an appropriate description of the run being displayed.
    
    //retrieve data from localStorage, parse it to be used later to display the route of user's run
    var storedRuns = JSON.parse(localStorage.getItem(APP_PREFIX, runJSON));
    var runNames = [];
    for (i=0; i < storedRuns.length; i++){
        runNames.push(storedRuns[i]._nickname);
    }
    userRun = storedRuns[runIndex];
    document.getElementById("headerBarTitle").textContent = runNames[runIndex];
}

// Code for the Measure Run page.
var marker=null;
var randomMarker=null;
var map, infoWindow, locStart, locEnd, locat, userPath;
var initial = true;
//function for displaying the Map
function initMap() {
    // Initialise map, centred on the start location of the user
    
    runInstance = new Run();
    runInstance.initialiseFromPDO(userRun);
        
    map = new google.maps.Map(document.getElementById('map'), {
            center: runInstance.startLocation,
            zoom: 18
        });

    var startMarker = new google.maps.Marker({
                position: runInstance.startLocation,
                icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3
                    },
                draggable: false,
                map: map,
    });  
    var endMarker = new google.maps.Marker({
                position: runInstance.endLocation,
                draggable: false,
                icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3
                    },
                map: map,
        });    
    var userPath = new google.maps.Polyline({
                path: runInstance.pathTaken,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2.4,
                map: map
            });
    userPath.setMap(map);
    
    document.getElementById("distRan").innerHTML=runInstance.distanceRan();
    document.getElementById("timeTaken").innerHTML=runInstance.timeTaken();
    document.getElementById("speed").innerHTML=runInstance.averageSpeed();
    document.getElementById("description").innerHTML=runInstance.description;
    document.getElementById("nickname").innerHTML=runNames[runIndex];
}

//function in case user wants to reattempt run
function reattemptRun() {
    chosen = true;
    chosenJSON = JSON.stringify(chosen);
    localStorage.setItem("reattemptRun",chosenJSON);
    document.location.href='newRun.html';
}

//deletes the current run
function deleteRun(){
    
    //removes specified object from the savedRuns array
    storedRuns.splice(runIndex,1);
    
    //save new data
    runJSON = JSON.stringify(storedRuns);
    localStorage.setItem(APP_PREFIX,runJSON);
    document.location.href='index.html';
}

function favourite(){
    var storedRuns = JSON.parse(localStorage.getItem(APP_PREFIX, runJSON))
    
favArray = JSON.parse(localStorage.getItem("favlist",fav));

if (localStorage.getItem("favlist")){
    same = favArray.indexOf(runIndex);
    if(same == -1){
        favArray.push(runIndex);
        console.log(favArray);
        console.log(storedRuns[runIndex]._nickname+" is added to favourites");
        displayMessage(storedRuns[runIndex]._nickname+" is added to favourites");
        fav = JSON.stringify(favArray);
        localStorage.setItem("favlist",fav); 
    }
    else{
        favArray = JSON.parse(localStorage.getItem("favlist"))
        console.log(favArray);
        console.log(same);
        favArray.splice(same,1);
        console.log(favArray)
        console.log(storedRuns[runIndex]._nickname+" is removed from favourites")
        displayMessage(storedRuns[runIndex]._nickname+" is removed from favourites")
        fav = JSON.stringify(favArray);
        localStorage.setItem("favlist",fav); 
    }
}
else{
    if(initial==true){
        favArray=[];
        favArray.push(runIndex);
        console.log(favArray);
        console.log(storedRuns[runIndex]._nickname+" is added to favourites");
        displayMessage(storedRuns[runIndex]._nickname+" is added to favourites");
        fav = JSON.stringify(favArray);
        localStorage.setItem("favlist",fav);
        initial = false;
    }
    else{
        favArray = JSON.parse(localStorage.getItem("favlist"))
        console.log(favArray);
        console.log(same);
        favArray.splice(same,1);
        console.log(favArray)
        console.log(storedRuns[runIndex]._nickname+" is removed from favourites")
        displayMessage(storedRuns[runIndex]._nickname+" is removed from favourites")
        fav = JSON.stringify(favArray);
        localStorage.setItem("favlist",fav); 
    }
}
}