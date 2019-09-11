/// Code for the main app page (Past Runs list).

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

function viewRun(runIndex)
{
    // Save the desired run to local storage so it can be accessed from View Run page.
    localStorage.setItem(APP_PREFIX + "-selectedRun", runIndex);
    // ... and load the View Run page.
    location.href = 'viewRun.html';
}

var runIndex = localStorage.getItem(APP_PREFIX + "-selectedRun"); 
var userRun;
if (runIndex !== null)
{
    // If a run index was specified, show name in header bar title. This
    // is just to demonstrate navigation.  You should set the page header bar
    // title to an appropriate description of the run being displayed.
    
    //retrieve data from localStorage, parse it to be used later to display the route of user's run
    var storedRuns = JSON.parse(localStorage.getItem(APP_PREFIX, runJSON));
}
 
 function displayLists(){
    var output="";
    if(storedRuns == null || storedRuns.length == 0) {
       return null;
       }
    else{
    for(var i=0; i<storedRuns.length; i++){
        userRun = storedRuns[i];
        output +='<li class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"  onclick="viewRun('+i+');"><span class="mdl-list__item-primary-content"><h4 style="color:black">'+ userRun._nickname + '<br></h4><span class="mdl-list__item-sub-title" style="color:black">Run completed on: '+ userRun._startTimetoLocale +'</span></span></li>'+'<br>';
    }
    }
    document.getElementById("runsList").innerHTML=output;
}

function favLists(){
    var output="";
    favArray = JSON.parse(localStorage.getItem("favlist", fav));
    if(favArray == null || favArray.length == 0){
        output ='<li class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"  onclick="viewRun();"><span class="mdl-list__item-primary-content"><h6 style="color:black">No favourite Runs saved<br></h6></span></li>'+'<br>';
    }
    else{
    for(var i=0; i<favArray.length; i++){
        index = favArray[i];
        userRun = storedRuns[index];
        output +='<li class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"  onclick="viewRun('+index+');"><span class="mdl-list__item-primary-content"><h6 style="color:black">'+ userRun._nickname + '<br></h6></span></li>'+'<br>';
    }
    }
    document.getElementById("favList").innerHTML=output;
}

favLists()
displayLists();

//destroy all data
function override(){   
    if (APP_PREFIX !== null){
        confirm('Delete all runs?');
        localStorage.removeItem(APP_PREFIX);
        localStorage.removeItem("favlist");
        document.location.reload();
        displayMessage("Delete succesful");
        chosen=false;
        chosenJSON = JSON.stringify(chosen);
        localStorage.setItem("reattemptRun",chosenJSON);
    }   
    else{
        displayMessage("All runs deleted");
        chosen=false;
        chosenJSON = JSON.stringify(chosen);
        localStorage.setItem("reattemptRun",chosenJSON);
    }
}