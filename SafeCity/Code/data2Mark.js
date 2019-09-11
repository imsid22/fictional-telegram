//variables for markers
var markers = [];
var marker;
var lat;
var long;
var dataArray = [];
var markerLatLng = [];
var markerCluster;
var heatMapKeeper;


//variables for cctv
var cctvs = [];
var cctv;
var cctvArray = [];

//heatmap
var heatmap;

// PopupBox
var contentString='';

var dangerKeywords = ["unsafe", "walking", "dark", "lighting", "drug", "busy", "homeless", "lit", "alcohol", "loitering", "drinking", "drunk", "drugs", "violence", "abuse", "addicts", "fights", "attacked"];

$(document).ready(function() {
$.ajax({
        type: "GET",
        url: "https://data.gov.au/dataset/50fc8f90-bb4d-4484-809d-e9eb7bbfb826/resource/0861e09c-41f1-4088-a81a-758d0db8f770/download/right-to-the-night.csv",
        dataType: "text",
        success: function(data) {
       
        dataArray = processData(data);
        newDataArray = rateData(dataArray, dangerKeywords);    
            
        var heat_data = document.getElementById('heatswitch');
            heat_data.addEventListener('onclick', Enable_heatmap(this.checked));   
            displayPieChart(crimeCategory(newDataArray));
        //console.log(newDataArray[252].seriousness);
        }
    });    
});


//Lighting
$.ajax({
  type: "GET",
  url: "https://data.gov.au/dataset/c99c0bc9-7354-4da5-b730-dee8f729341f/resource/75f8f990-e094-4ddf-b307-2dd9e1d8dbce/download/publiclighting.json",
  dataType: "text",
  success: function(data) {

    publicLightingData = JSON.parse(data);
      loadGeoJsonString(publicLightingData);
   
   }
});

$.ajax({
 type: "GET",
 url: "https://data.gov.au/dataset/e99f92a8-beea-4725-9897-c1854eb9cc3d/resource/e9e0a68d-1bc9-4f49-8df5-7528d2129100/download/cctv.csv",
 dataType: "text",
 success: function(data) {

   cctvData = processData(data);

   for (var i = 0, l = cctvData.length; i < l; i++) {

      lat = parseFloat(cctvData[i].lat);

      long = parseFloat(cctvData[i].long);
      latlng = new google.maps.LatLng(lat, long);

       var badCCTVRating = 0;

       for (var j = 0, k = markers.length; j < k; j++) {

           //PSEUDOCODE    the markers part get the lat and long
           //use some compute sperichal or something
           var lat1 = lat* (Math.PI/180), lat2 = parseFloat(newDataArray[j].Latitude)* (Math.PI/180), long1 = long* (Math.PI/180), long2 = parseFloat(newDataArray[j].Longitude)* (Math.PI/180), R = 6371e3;
          var x = (long2-long1) * Math.cos((lat1+lat2)/2);

          var y = (lat2-lat1);

          var d = Math.sqrt(x*x + y*y) * R;

        
           //console.log(d);
          if(d < 500 )
          {
              if(newDataArray[j].seriousness >= 2);
              {
                  badCCTVRating++;

              }
          }
      }

       if (badCCTVRating >= 2){
           var icon ={url: "https://png.icons8.com/ios/80/000000/wallmount-camera-filled.png", scaledSize: new google.maps.Size(21,34)};

           var cctv = new google.maps.Marker({
           position: latlng,
           icon: icon,
           draggable: false,
           map: map
         });

           cctvs.push(cctv);

           cctv.setMap(map);
       }

       else {
           var icon ={url: "https://png.icons8.com/ultraviolet/80/000000/wallmount-camera.png", scaledSize: new google.maps.Size(21,34)};

           var cctv = new google.maps.Marker({
           position: latlng,
           icon: icon,
           draggable: false,
           map: map
         });

           cctvs.push(cctv);

           cctv.setMap(map);
       }

      }

     //var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/m'});

   }

});

function loadGeoJsonString(geojson) {
        map.data.addGeoJson(geojson);
    map.data.setStyle(function(feature)
                      {
        return {icon:"https://png.icons8.com/office/40/000000/idea.png", scaledSize: new google.maps.Size(21,34)}
        
    })
      }

function processData(text) {
  let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
  for (l of text) {
      if ('"' === l) {
          if (s && l === p) row[i] += l;
          s = !s;
      } else if (',' === l && s) l = row[++i] = '';
      else if ('\n' === l && s) {
          if ('\r' === p) row[i] = row[i].slice(0, -1);
          row = ret[++r] = [l = '']; i = 0;
      } else row[i] += l;
      p = l;
  }
  var objArr = [];
  var headers = ret[0];

  for(var k = 1; k < ret.length; k++) {
      var data = ret[k];
      var obj = {};
      for(var j = 0; j < data.length; j++)
      {
          obj[headers[j].trim()] = data[j].trim()
      }
      objArr.push(obj);
  }
  return objArr;

};

function rateData(arrList, keywords) {

    var commentList = [];


    for (var i = 0; i < arrList.length; i++) {
       var keyHashtags = [];
       var dangerRating = 2;
       var comment = arrList[i][ 'Your Comment' ];
       var punctuations = [",", ".", "?", "!", "@", "(", ")", "[", "]", "{", "}", "'", "-", ":", ";", ":-", "_", "—", "\""];
       if (comment != undefined){

           comment = comment.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
           comment = comment.replace(/\s{2,}/g," ");



           commentList = comment.split(" ");

           for (var j = 0; j < commentList.length; j++){
               var check = 0;
               for (var k = 0; k<keywords.length; k++){
                   if (commentList[j].toLowerCase() == keywords[k]){
                       for (var l = 0; l < keyHashtags.length; l++){
                           if (commentList[i] == keyHashtags[l]){
                               check = 1;
                           }
                       }
                       if (check == 0) {
                           keyHashtags.push("#"+commentList[j]);
                       }

                       if (dangerRating < 5 ){
                           if (arrList[i].Category == "Sad=Unsafe"){
                               dangerRating ++;
                           }else {
                               dangerRating = 1;
                           }

                       }
                   }
               }
           }

           arrList[i].seriousness = dangerRating;
           arrList[i].hashtags = keyHashtags;
           
           lat = parseFloat(arrList[i].Latitude);
           //console.log(parseFloat(arrList[i].Latitude));
           long = parseFloat(arrList[i].Longitude);
           latlng = new google.maps.LatLng(lat, long);
           //console.log(latlng.lat);
            var hexRed = "FF0000";
            var hexLightRed="FF8800"
            var hexYellow = "FFFF00";
            var hexLightGreen ="88FF00"
            var hexGreen = "00FF00";
            var deepskyblue = "00BFFF";
            var mint = "#F5FFFA";
            
           var pinColor=hexGreen;
           
            if (dangerRating == 2){
                
                pinColor=hexLightGreen;
           }
           
            else if(dangerRating==3)
         {
              pinColor=hexYellow;
         }
     else if(dangerRating==4)
             {
             pinColor=hexLightRed;
             }
     else if(dangerRating==5)
         {
             pinColor=hexRed;
         }
           var icon ={url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7C" + pinColor, scaledSize: new google.maps.Size(21,34)
                      };
           //{url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(70,70)};
            contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading">'+arrList[i].Address+'</h1>'+
            '<div id="bodyContent">'+
            '<p>'+keyHashtags+'</p>'+
            '</div>'+
            '</div>';
            var infowindow=new google.maps.InfoWindow({
            content: contentString
        });
               var marker = new google.maps.Marker({
                position: latlng,
                icon: icon,
                draggable: false,
                //maxWidth: 320
                map: map
              });
                        
           google.maps.event.addListener(marker,'click',(function(marker, contentString, infowindow){
               return function(){
                   infowindow.setContent(contentString);
                   infowindow.open(map, marker);
               };
           })(marker, contentString, infowindow));
           markers.push(marker);
           markerLatLng.push({location: latlng, weight: dangerRating});
           
           marker.setMap(map);
               
       }
       //console.log(commentList);
       
   }
    markerCluster = new MarkerClusterer(map, markers, {imagePath: '/m'});
    
    return arrList;
}









function crimeCategory(arrayList){

   var categoryObj = {};

   for (var i = 0; i < arrayList.length; i++){
//        var frequency = 1;
       var present = 0;
       if (arrayList[i].Category == "Sad = Unsafe"){
           var propertyValue = arrayList[i][ 'What made you feel like this?' ];
           if (propertyValue != ""){
               const keys = Object.keys(categoryObj);
               for (const key of keys){

                   if (key == propertyValue){
                       categoryObj[key] += 1;
                       //frequency += 1;
                       present = 1;
                   }

               }
               if (present != 1){

                   categoryObj[propertyValue] = 1;
               }
           }
       }
   }
   return categoryObj;
}

// Draw the chart and set the chart values
function drawChart(statObj) {
 var array = [];
 var subArray = [];

 const entries = Object.entries(statObj);

 entries.unshift(['Category','frequency']);


 var data = google.visualization.arrayToDataTable(entries);

 // Optional; add a title and set the width and height of the chart
 var options = {'title':'September 2018 average reports', 'width':300, 'height':200};

 // Display the chart inside the <div> element with id="piechart"
 var chart = new google.visualization.PieChart(document.getElementById('piechart'));
 chart.draw(data, options);
}

function displayPieChart(staticObj)
{
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(function (){drawChart(staticObj);});
}

function activateHeatMap(){

    var heatmap = new google.maps.visualization.HeatmapLayer({
    data: markerLatLng,
    radius: 15
    });

    heatmap.setMap(map);
    
    return heatmap;
}

function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markerCluster.clearMarkers();
}

function activateMarkers(heatmap){
    heatmap.setMap(null);
    markerCluster = new MarkerClusterer(map, markers, {imagePath: '/m'});
}

function Enable_heatmap(){
    if(document.getElementById('heatswitch').checked){
    DeleteMarkers();
    heatMapKeeper = activateHeatMap();
    }
    else{
        if(heatMapKeeper!=null){
        activateMarkers(heatMapKeeper);
        }
    }
}

function showPie()
{
    document.getElementById('pieChart').hidden=false;
}