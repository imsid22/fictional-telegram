var cctvs = [];
var cctv;
var lat;
var long;
var cctvData = [];

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
        
        var deepskyblue = "00BFFF";
        var mint = "#F5FFFA";
        

        var icon ={url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7C" + deepskyblue, scaledSize: new google.maps.Size(42,68)};
                   
        var cctv = new google.maps.Marker({
        position: latlng,
        icon: icon,
        draggable: false,
        map: map
      });

       cctvs.push(cctv);

       cctv.setMap(map);

       }
      
      //var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/m'});
    console.log(cctvs);
      
    }        
   
});