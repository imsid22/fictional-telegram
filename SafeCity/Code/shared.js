// Shared code needed by all three pages. 
 
// Prefix to use for Local Storage.  You may change this. 
var APP_PREFIX = "userSavedRuns" 
// Array of saved Run objects. 
var savedRuns = []; 
var favArray=[];
var same;
// a temporary variable to save the data
var temp;
var startSecond, endSecond;
//shared variables for all Javascript files
var runJSON, runAttempt, run, runInstance, chosenJSON, fav;

class Run{ 
     
    //creates an object containing the properties below 
    constructor(startLocation,endLocation,startTime,endTime,startTimetoLocale,endTimetoLocale){ 
        this._startLocation=startLocation;
        this._endLocation=endLocation;
        this._pathTaken=[];
        this._startTime=startTime;
        this._endTime=endTime; 
        this._startTimetoLocale=startTimetoLocale;
        this._endTimetoLocale=endTimetoLocale;
        this._timeTaken;
        this._distanceRan;
        this._averageSpeed;
        this._nickname;
        this._description;
    }
    
    //Getters
    get startLocation(){ 
        return this._startLocation; 
    } 
    get endLocation(){ 
        return this._endLocation; 
    } 
    get startTime(){
        return this._startTime;
    }
    get endTime(){
        return this._endTime;
    }
    get startTimetoLocale(){
        return this._startTimetoLocale;
    }
    get endTimetoLocale(){
        return this._endTimetoLocale;
    }
    get timeTaken(){
        return this._timeTaken;
    }
    get distanceRan(){
        return this._distanceRan;
    }
    get averageSpeed(){
        return this._averageSpeed;
    }
    get pathTaken(){
        return this._pathTaken;
    }
    get nickname(){
        return this._nickname;
    }
    get description(){
        return this._description;
    }

    //setters to ensure data returned is valid
    set startLocation(startLocation){
        return this._startLocation = startLocation;
    }
    set endLocation(endLocation){
        return this._endLocation = endLocation;
    }
    set startTime(startTime){
        return this._startTime = startTime;
    }
    set endTime(endTime){
        return this._endTime = endTime;
    }
    set startTimetoLocale(startTimetoLocale){
        return this._startTimetoLocale = startTimetoLocale;
    }
    set endTimetoLocale(endTimetoLocale){
        return this._endTimetoLocale = endTimetoLocale;
    }
    set timeTaken(timeTaken){
        return this._timeTaken = timeTaken;
    }
    set distanceRan(distanceRan){
        return this._distanceRan = distanceRan;
    }
    set averageSpeed(averageSpeed){
        return this._averageSpeed = averageSpeed;
    }
    set pathTaken(pathTaken){
        return this._pathTaken = pathTaken;
    }
    set nickname(nickname){
        return this._nickname = nickname;
    }
    set description(description){
        return this._description = description;
    }
    
    //Method for Time duration
    timeTaken(){
        var resultTime = this._endTime - this._startTime; 
        var diff = Math.ceil(resultTime / 1000); 
        this._timeTaken = diff;
        return diff ;
    }
    
    //Method for Distance Remaining 
    distanceRan(){
        var resultDist = google.maps.geometry.spherical.computeDistanceBetween(this._startLocation, this._endLocation);
        this._distanceRan = resultDist;
        return resultDist.toFixed(2);
    }
    //Method for Average Speed
    averageSpeed(){
        var resultSpeed = this._distanceRan/this._timeTaken
        return resultSpeed.toFixed(2);
    }
    
    //Method for pushing coordinates of user into the array
    pathCoord(coordinate){
        for(var i=0; i<coordinate.length; i++){
            this._pathTaken.push(coordinate[i]);
        }
    }
    
    initialiseFromPDO(PDOObject){
        this._startLocation = new google.maps.LatLng(PDOObject._startLocation.lat, PDOObject._startLocation.lng);
        this._endLocation = new google.maps.LatLng(PDOObject._endLocation.lat, PDOObject._endLocation.lng);
        this._startTime = PDOObject._startTime;
        this._endTime = PDOObject._endTime; 
        this._nickname = PDOObject._nickname;
        this._description = PDOObject._description;
        for (var i=0;i < PDOObject._pathTaken.length; i++){
            var temp = new google.maps.LatLng(PDOObject._pathTaken[i].lat, PDOObject._pathTaken[i].lng);
            this._pathTaken.push(temp);
        }
        this._reattempt = PDOObject._reattempt;
}
}

