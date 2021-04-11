var isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream;
var timeOnPage = Date.now()
var visualsHidden = false;
var setupFinished = false;
function startAmplitude(){
	var autoplay = Cookies.get("playState") != "paused";

	try {
		if (BagelVis != undefined) {
			Amplitude.init({
				"songs": mySongs,
				visualizations: [{
					object: BagelVis,
					params: {}
				}],
				visualization: 'BagelVis',
				"autoplay": autoplay
			});
		}
	} catch {
		Amplitude.init({
			"songs": mySongs,
			"autoplay": autoplay
		});
	}
	Amplitude.bindNewElements();
}


function songCookieUpdate(){
	try {
		if (Amplitude.getSongPlayedSeconds() != undefined) {
			Cookies.set("songIndex", Amplitude.getActiveIndex());
			var timestamp = Amplitude.getSongPlayedSeconds();
			if (Date.now() - timeOnPage > 1100) {
				var state = "paused";
				//cant use getplayer state because it's broken for some reason. Instead, keep track of how far we go through the song each update
				if (timestamp != Cookies.get("songTime")) {
					state = "playing";
				}

				//console.log(Amplitude.getPlayerState());
				//Cookies.set("playState", Amplitude.getPlayerState())
				Cookies.set("playState", state);
			}
			Cookies.set("songTime", timestamp);

		}
	} catch {
		console.log('something went wrong');
		return;
	}
	document.getElementById("songInfo").innerHTML = mySongs[Amplitude.getActiveIndex()]["name"];
}


function cookieSetup()
{
	
	if (Cookies.get("songIndex") != undefined) {
		console.log("cookies are already set");
		var songTime = Cookies.get("songTime");
		if (!isIOS)
			SkipTo(Cookies.get("songIndex"), songTime);
	} else {
		console.log("setting cookies");
		Cookies.set("songIndex", 0);
		Cookies.set("songTime", 0);
		Cookies.set("playState", Amplitude.getPlayerState());
	}
	setTimeout(function () {
		setInterval(songCookieUpdate, 10);
	}, 500);
}

function SongPlayerStart(){
	if(setupFinished) return;
	document.getElementById('visualizer').setAttribute("class", "amplitude-visualization");
	startAmplitude()
	songplayer = document.getElementById("song-player");
	
	//taken from https://521dimensions.com/open-source/amplitudejs/docs/examples/multiple-songs.html and barely modified
	document.getElementById('song-played-progress').addEventListener('click', function (e) {
		var offset = this.getBoundingClientRect();
		var x = e.pageX - offset.left;
		Amplitude.setSongPlayedPercentage((parseFloat(x) / parseFloat(this.offsetWidth)) * 100);
	});

	setupFinished = true;
	//-------------------------------setup cookies-------------------------------
	cookieSetup()

	var playerstate = Cookies.get("playState");
	if (playerstate == "stopped" || playerstate == "paused") {
		setTimeout(Amplitude.pause, 30);
	}

	Amplitude.bindNewElements();
	songplayer.style.visibility = "visible"

}


//-------------Controls-----------------


function hideVisuals() {
	doVisualize = !doVisualize;
}

function SkipTo(trackIndex, seconds) {
	console.log("Skipping to " + seconds);
	Amplitude.skipTo(seconds, trackIndex);
	PlaySong();
}

function PlaySong() {
	console.log("Playing song...");
	setTimeout(songCookieUpdate, 10);
	if (isIOS)
		return;
	//MouseEnter();
	//setTimeout(MouseLeave, 500);
}

window.addEventListener('keydown', function (e) {
	if (e.keyCode == 32 && e.target == document.body) {
		e.preventDefault(); //don't scroll on pressing spacebar
		document.getElementById("play-pause").click()
	}
});


setTimeout(function () {
	if (!setupFinished) Setup();
}, 900)