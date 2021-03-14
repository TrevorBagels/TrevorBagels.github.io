function togglethemeDropdown() {
	document.getElementById("themedropdown").classList.toggle("show");
}
window.onclick = function (event) {
	if (!event.target.matches('#themeselector')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
window.onscroll = function(){
	if(window.scrollY > window.height + 50){
		document.getElementById("downarrow").style.visibility = 'hidden';
	}
}
function copyText(target) {
	/* Get the text field */
	var copyText = document.getElementById(target).querySelector("input");
	console.log(copyText)
	copiedMarker = document.getElementById(target).querySelector('span');
	copiedMarker.classList.remove("copiedMarkerActive");
	copiedMarker.classList.remove("copiedMarker");
	copiedMarker.classList.add("copiedMarkerActive");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
}




//hmmm. seems like as the year changes, daylight savings time makes stuff weird.
function calcTime(offset) {
	var dstThing = 0//-60
	var d = new Date();
	var utc = d.getTime() + ((d.getTimezoneOffset() + dstThing) * 60000);
	var nd = new Date(utc + (3600000 * offset));
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
		"This day doesn't exist"
	]
	return days[nd.getDay()] + ", " + nd.getMonth() + "/" + nd.getDate() + ", " + nd.toLocaleString()
		.split(
			",")[1];
}
//if past march 14th, then offset = 7-blahblahblah, else, it's 8 - that other stuff
var offset = 7 - new Date().getTimezoneOffset() / 60;

function SetTime() {
	otherpart = "<br>(-" + offset + " hours)"
	if (offset == 0)
		otherpart = ""
	document.getElementById("currentTime").innerHTML = "<code> " + calcTime('-7') + " (PST)" +
		otherpart +
		"</code>"
}
SetTime();
setInterval(SetTime, 500)




function yourCookiesUpdate() {
	document.getElementById("yourCookies").innerHTML = "Your cookies look like this: <br>" +
		"Song index: " + Cookies.get("songIndex") + ", Song Time: " + Cookies.get("songTime") +
		", Play State: " + Cookies.get("playState");
}
setInterval(yourCookiesUpdate, 500)


//<!--Fixing thing on mobile-->
width = document.documentElement.clientWidth;
height = document.documentElement.clientHeight;
if (width < height * 1.15) {
	document.getElementById("projectscontainer").id = "";
}
if (width < height) {
	console.log("fix stuff");
	//fix stuff. we're in a mobile looking view
	document.getElementById("currentTime").style = "font-size: 12pt";
	document.querySelectorAll('.anchor').forEach(function (e) {
		e.style.top = "-200px";
	});
	document.getElementById("currentTime").innerHTML = "";
	document.getElementById("currentTime").id = "";
	document.getElementById("currentTimeMobile").id = "currentTime";
}


var platformIndex = 0;
var platforms = ["Amazon Music", "Apple Music", "Spotify", "YouTube Music"]
var platformLinks = [
	"https://music.amazon.com/artists/B08GBXXK1F?ref=dm_sh_b388-b502-dmcp-5d5c-19eef&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
	"https://music.apple.com/us/artist/trevor-bagels/1528425500",
	"https://open.spotify.com/artist/5VE7ctwQ5n5NKEl68PWaQA?si=Nwc_zLbdTLCiPO1NJu8GFg",
	"https://music.youtube.com/channel/UCHD9fLzph_3tNheEIidKdUQ"
]

function updatePlatforms() {
	platformIndex += 1;
	if (platformIndex >= platformLinks.length) platformIndex = 0;
	document.getElementById("musicplatforms").innerHTML = "<a target='_blank' href='" + platformLinks[
		platformIndex] + "'>" + platforms[platformIndex] + "</a>"
}
setInterval(updatePlatforms, 1800);





//music

var slideIndex = 0;
function nextMusicSlide(dir)
{
	var i;
	slideIndex += 1;
	var n = slideIndex;
	var slides = document.getElementsByClassName("musicgrid");
	if (n >= slides.length) {slideIndex = 0}
	if (n < 0) {slideIndex = slides.length-1}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	slides[slideIndex].style.display = "grid";
}
