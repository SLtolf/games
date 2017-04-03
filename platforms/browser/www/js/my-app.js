// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view1');
var view2 = myApp.addView('#view2', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


var myScroll;

$(document).ready(function(){
    
if ( $('html').hasClass('android') ){
  $('.page-content').css('margin-top', '0');  
};

 id = $(this).attr('id');    
    
var data = new Array();
$.getJSON( "data/event_list.json", function( data ) {

   for (i = 0; i < data.length; i++ ) {
    $('.activity-container').append(
       '<a class="detail-link" href="#" id="' + data[i]["id"] + '" >' +
       ' <div class="activity-item" title="' + data[i]["title"] + '" style="background: url(' + data[i]["image"][0] + ')">' +
       '  <div class="meta-wrap">' +
       '   <h3 class="event-title">' + data[i]["title"] + '</h3>' +
       '  </div>' +
       ' </div>' +
       '</a>');
   };

});
    
var dataJSON = new Array();
$.getJSON('data/event_detail.json',function(data){
    var dataJSON = data;

$(document).on('click', '.link-home', function(){ 
    location.reload();
});   
    
$(document).on('click', '.detail-link', function(){
    
    var detailId = $(this).attr('id');
    var dataNr;
    var additionalFields = '';
    // updateDetail( detailId );
    
    for ( i = 0; i < dataJSON.length; i++ ){
        if ( dataJSON[i].responseJSON.id == detailId ){
            console.log( dataJSON[i].responseJSON.id )
            var dataNr = i;
        }
    };
    
    for ( i = 0; i < dataJSON[dataNr].responseJSON.additionalFields.length; i++ ) {
        if ( dataJSON[dataNr].responseJSON.additionalFields[i].label == 'Treffpunkt' ) {
          additionalFields = '<li><i class="icon ion-pin"></i>' + dataJSON[dataNr].responseJSON.additionalFields[i].data + '</li>';
        } else if ( dataJSON[dataNr].responseJSON.additionalFields[i].label == 'Mitnehmen' ) {
          additionalFields = additionalFields + '<li><i class="icon ion-briefcase"></i>' + dataJSON[dataNr].responseJSON.additionalFields[i].data + '</li>';
        } else if ( dataJSON[dataNr].responseJSON.additionalFields[i].label == 'Wichtig' ) {
          additionalFields = additionalFields + '<li><i class="icon ion-alert-circled"></i>' + dataJSON[dataNr].responseJSON.additionalFields[i].data + '</li>';
        } else if ( dataJSON[dataNr].responseJSON.additionalFields[i].type == 'link' ) {
          additionalFields = additionalFields + '<li><i class="icon ion-link"></i><a class="external" href="' + dataJSON[dataNr].responseJSON.additionalFields[i].data.url + '" target="_blank">' + dataJSON[dataNr].responseJSON.additionalFields[i].data.text + '</a></li>';
        }
    }
    
    var dynamicPageIndex = 0;
    // HTML Content of detail page:
    var newPageContent = '<div class="pages no-toolbar">' + 
                         '  <div data-page="detail-page" class="page no-toolbar">' +
                         '    <div class="page-content">' + 
                         '      <div class="header-img-cont" style="background: url(' + dataJSON[dataNr].responseJSON.image[0] + ')"></div>' +
                         '      <a href="#" class="back"><i class="icon ion-ios-arrow-left"></i></a><div class="header-img-overl"></div>' + 
                         '      <h2 class="activity-title">' + dataJSON[dataNr].responseJSON.title + '</h2>' +
                         '      <div class="host-img" style="background-image: url(' + dataJSON[dataNr].responseJSON.allOwners[0].thumbnail[1] + ')"></div>' +
                         '      <div class="detail-desc">' + dataJSON[dataNr].responseJSON.description + '</div>' +
                         '      <ul class="detail-list"><li id="contact"><i class="icon ion-ios-contact"></i><p class="no_margin">' + dataJSON[dataNr].responseJSON.allOwners[0].firstName + ' ' + dataJSON[dataNr].responseJSON.allOwners[0].lastName + '</p></li>'+ additionalFields + '</ul>' +
                         '    </div>' + 
                         '  </div>' + 
                         '</div>';
    
    // OR using .load method if need more options
    view1.router.load({
      content: newPageContent,
      animatePages: true,
    });

    if ( $('html').hasClass('android') ){
        $('.page-content').css('margin-top', '0');  
    };

 });

});      

   

var latitudeT = 46.174569;
var longitudeT = 8.855831;   

$(document).on('click', '.link-map', function(){
    
    getLocation();
    loaded();
        
    function loaded() {
        myScroll = new IScroll('#wrapper', {
            zoom: true,
            mouseWheel: true,
            wheelAction: 'zoom',
            scrollX: true,
            scrollY: true,
            freeScroll: true,
            bounce: true,
            scroll: true,
            zoomStart: 1.2,
            zoomMin: 1,
            zoomMax: 1.8

        });
    }
    
    
   myScroll.scrollTo(-200, -60);

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
 
   // });
   /* console.log('pointLeft ' + pointLeft);
    console.log('pointC[0] ' + pointC[0]);
    console.log('pointA[0] ' + pointA[0]);
    console.log('pointBottom ' + pointBottom);
    */
    
});

    
$.fn.locatorPosition = function(latu, lotu){}
   
$.fn.notifyNoConnection = function(){
    $('.no-connection').css('top', '0px'); 
}
    
$.fn.notifyNoAccess = function(){
    $('.no-gps-access').css('top', '0px'); 
}
    
$.fn.notifyTemporary = function(){
    $('.temporary-connection').css('top', '0px'); 
}

$.fn.notifyNoReach = function(){
    $('.no-reach').css('top', '0px'); 
}
$.fn.notifyReach = function(){
    $('.no-reach, .temporary-connection, .no-gps-access, .no-connection').css('top', '-60px'); 
}

$('.notify-easeout').on('click', function(){
    $(this).parent().css('top', '-60px');
});

    
});

var latitude;
var longitude;

function getLocation(){

    // Wait for device API libraries to load
    document.addEventListener("deviceready", onDeviceReady, false);

    var options = {enableHighAccuracy:true};
    // device APIs are available
    function onDeviceReady() {
        navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

    // onSuccess Geolocation
    function onSuccess(position) {
        console.log( 'position Success' )
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        if ( longitude < 8.8453231 || longitude > 8.858002 || latitude < 46.167926 || latitude > 46.177856 ) {
          $('.locator').hide();
          $.fn.notifyNoReach();    
        } else {
          $('.locator').show();
          $.fn.notifyReach();
        }
        
        //var latitude = 46.174569;
        //var longitude = 8.855831; 
        
        //point Variables [latitude, longitude, bottom (pt), left (pt)]
        var pointA = [46.170138, 8.850099, 159, 242]
        //point Variables [latitude, longitude, bottom(pt), left(pt)]
        var pointC = [46.173308, 8.853315, 342, 370]
        //height Reference Variable
        var refVarHeight = (pointC[0] - pointA[0]) / (pointC[2] - pointA[2]);
        //width Reference Variable
        var refVarWidth = (pointC[1] - pointA[1]) / (pointC[3] - pointA[3]);
        //calc Left     
        var pointLeft = 242 + ( longitude - pointA[1] ) / refVarWidth.toFixed(20);    
        //calc Right    
        var pointBottom = 159 + ( latitude - pointA[0] ) / refVarHeight.toFixed(20);    
        
        //Locator Position update function
        function updateLocator() {
            $('.locator').css({
                'left' : pointLeft + 'pt',
                'bottom' : pointBottom + 'pt'
            });
        }   
        updateLocator()
    };
}
    
    console.log( latitude + ' : ' + longitude );
    
    // onError Callback receives a PositionError object
    function onError(error) {
        var eCode = error.code;
        
        if ( eCode = 1) {
          $.fn.notifyNoAccess();
        } else if ( eCode = 2 ) {
          $.fn.notifyNoConnection();
        } else if ( eCode = 3 ) {
          $.fn.notifyTemporary();
        }
        console.log('code: ' + error.code + '\n')
    }
