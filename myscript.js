/* BYOT - Build your own Tearsheet */

/*****************************************
TODO:
1. create form
2. Get ads
3. make event based (remove wait)
*****************************************/
var numAds = 0;
function OnLoadPage_Main()
{
	// applied only if entity pane exists
	if (!isTriggerExist())
		return;

	// TODO: remove delay of 20 seconds for ads to load
	// TODO: move to event based on button click
	setTimeout(LoadData(),20000);

	// Main
	ModifyUX();
}

OnLoadPage_Main();

function addOverlays(elms, width, height) {
	var arrOverlayPos = [];
	$.each( elms, function( key, val ) {
		console.log($(val));

		var pos = {top:$(val).offset().top - $(val).scrollTop(), left:$(val).offset().left - $(val).scrollLeft()};
		
		// skip if there is already an overlay in same position
		for	(var index = 0; index < arrOverlayPos.length; index++) {
		    if (arrOverlayPos[index].left == pos.left && arrOverlayPos[index].top == pos.top) {
		    	return true;
		    }
		}

		arrOverlayPos.push(pos);
		numAds++; // increment ads found
		var overlayNode = '<div class="byotBgColor byotOverLay byotlocal'+width+'x'+height+'" style="left: '
			+ pos.left +'px; top: '+ pos.top +'px; width: '+ width +'px; height: '+ height +'px;"> </div>';
		
		// Two choices on where to place overlay
		//$(val).parent().append(overlayNode);
		$("body").append(overlayNode);
	});

}

function findAds() {
	// first we need to add position: relative to all the TDs
	// table based layouts return buggy offsetLeft/Top otherwise
	var elms = $("td");
	$.each( elms, function( key, val ) {
		$(val).css('position',$(val).css('position') || 'relative');
	});
	
	//300x250, 728x90, 160x600
	var elms300 = $("div,iframe,embed").filter(function(){
		return ($(this).outerWidth() == 300 && $(this).outerHeight() == 250);
	});
	addOverlays(elms300,300,250);

	var elms728 = $("div,iframe,embed").filter(function(){
		return ($(this).outerWidth() == 728 && $(this).outerHeight() == 90);
	});
	addOverlays(elms728,728,90);

	var elms160 = $("div,iframe,embed").filter(function(){
		return ($(this).outerWidth() == 160 && $(this).outerHeight() == 600);
	});
	addOverlays(elms160,160,600);

	// show message
	$("body").append("<div id='byotMsg' class='byotBgColor'></div>");
	$('#byotMsg').html('found '+numAds+' ads on this page.');
	$('#byotMsg').fadeIn().delay(5000).fadeOut();
	
	// show overlays
	$('.byotOverLay').delay(1000).fadeIn('fast');
}

// check if a condition is true
// useful if we want to block some sites etc.
function isTriggerExist() {
	return true;
}

function LoadData() {
	findAds();
}

function ModifyUX() {
	
	$( ".byotOverLay" ).hover(
	  function() {
	    $( this ).html("<div class='byotOverlayText'><span class='byotTextHL'>Click</span> to show ad. Then, <span class='byotTextHL'>Drag</span> to reposition</div>");
	  }, function() {
	    $( this ).html("");
	  }
	);
}
/*
chrome.browserAction.onClicked.addListener(function() {
	OnLoadPage_Main();
});
*/

///////////////////////
// UTILITY FUNCTIONS
// TODO: remove
//////////////////////
function getQuery()
{
	return getUrlVars()["q"].replace(/\+|%20/ig, ' ');
}

function getUrlVars()
{
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find, replace, str) {
	str = str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	str = str.replace(/(and|or|the|vs)\s/gi, '');
	return str;
}

function getExtension(imageUrl) {
	return imageUrl.split('.').pop();
}