document.head.innerHTML += ''
var onPhone = document.documentElement.clientWidth < document.documentElement.clientHeight;
mySongs = []
var timeOnPage = Date.now()
var isHovering = false;
var visualsHidden = false;
var isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream;
//var fileDepth = "../"
var mediaPlayerHTML = `
        <div id="songPlayer">
            <div class="amplitude-play-pause" amplitude-main-play-pause="true" id="play-pause"></div>
                <progress class="amplitude-song-played-progress" amplitude-main-song-played-progress="true" id="song-played-progress"></progress>
                <div class="time-container">
                    <div style="float: left; margin-left: 30px;"><span class="current-time">
                    <span class="amplitude-current-minutes" amplitude-main-current-minutes="true"></span>:<span class="amplitude-current-seconds" amplitude-main-current-seconds="true"></span>
                    </span></div>
                    <div style="float: right; margin-right: 30px;">
                    <span class="duration">
                    <span class="amplitude-duration-minutes" amplitude-main-duration-minutes="true"></span>:<span class="amplitude-duration-seconds" amplitude-main-duration-seconds="true"></span>
                    </span></div><br>
                    <div style='text-align: center' id="songInfo">Driving Simulator Music</div>   
                </div>
        </div>
`
var setupFinished = false;
var songSetupFinished = false;

var themeIndex = 1;
var themeGrayscale = {
	"backgroundcolor": "#313231",
	"textcolor": "#F4F3EF",
	"navlink": "#3f738c",
	"linkhover": "#DFBF57",
	"navbackground": "#212221",
	"glowshadow": "#889797",
	"fontfamily": "'Teko', sans-serif",
	"fontsize": "10pt"
};

var themeOriginal = {
	"backgroundcolor": "#4e0128",
	"textcolor": "#ede8c3",
	"navlink": "#308693",
	"linkhover": "#ff441f",
	"navbackground": "#38021d",
	"glowshadow": "#cc086a",
	"fontfamily": "'Teko', sans-serif",
	"fontsize": "10pt"
};
var themePaper = {
	"backgroundcolor": "#f1f1f1",
	"textcolor": "#090A09",
	"navlink": "#3F738C",
	"linkhover": "#A04A92",
	"navbackground": "#889797",
	"glowshadow": "#9E9EA0",
	"fontfamily": "'Roboto', sans-serif",
	"fontsize": "7.25pt"
};
var themes = [themeGrayscale, themeOriginal, themePaper];

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
function updateTheme() {
	themeIndex = localStorage.themeIndex
	if (themeIndex == undefined)
		themeIndex = 0;

	let root = document.documentElement;
	var tt = themes[themeIndex]
	root.style.setProperty("--backgroundcolor", tt["backgroundcolor"]);
	root.style.setProperty("--textcolor", tt["textcolor"]);
	root.style.setProperty("--navlink", tt["navlink"]);
	root.style.setProperty("--navbackground", tt["navbackground"]);
	root.style.setProperty("--glowshadow", tt["glowshadow"]);
	root.style.setProperty("--fontfamily", tt["fontfamily"]);
	root.style.setProperty("--fontsize", tt["fontsize"]);
	var rgb1 = hexToRgb(tt['navbackground']);
	var rgb2 = hexToRgb(tt['backgroundcolor']);
	var rgba1 = "rgba(" + rgb1.r + "," + rgb1.g + "," + rgb1.b + ",1)";
	var rgba2 = "rgba(" + rgb2.r + "," + rgb2.g + "," + rgb2.b + ",1)";
	root.style.setProperty("--pageheader", "linear-gradient(180deg, " + rgba1 + " 0%, " + rgba1 + " 80%, " + rgba2 + " 100%)");

}

function setTheme(i) {
	themeIndex = i;
	localStorage.themeIndex = i;
	updateTheme();
}
updateTheme();

function AddSong(name, desc, url, tags, disableHtml) {
	console.log(disableHtml);
	var fileDepthPrefix = "";
	try {
		if (fileDepth != undefined) fileDepthPrefix = fileDepth;
	} catch {
		//continue
	}
	var href = "";
	if (isIOS)
		href = 'target="_blank" href="https://soundcloud.com/trevorbagels';
	var html = '<div' + ' class="music amplitude-skip-to" data-amplitude-song-index="' + mySongs.length + '" onclick="PlaySong()" data-amplitude-location="0"><div class="background"></div><h3>' + name + '</h3><p>' + desc + '</p></div>';
	/*if(disableHtml == null && document.getElementById("musicgrid") != null)
	{
		document.getElementById("musicgrid").innerHTML += html   
	}*/
	mySongs.push({
		"name": name,
		"artist": "Trevor Bagels",
		"album": "none",
		"url": fileDepthPrefix + url,
		"html": html,
		"addHTML": disableHtml
	})
	return html;
}

function Hover() {
	isHovering = true;
	console.log("HOVER");
	songplayer = document.getElementById("songPlayer");
	songplayer.classList.toggle("songPlayerHover");
	songplayer.classList.toggle("songPlayerNotHover");
}

function MouseEnter() {
	isHovering = false;
	songplayer = document.getElementById("songPlayer");
	songplayer.classList.add("songPlayerHover");
	songplayer.classList.remove("songPlayerNotHover");
}

function MouseLeave() {
	songplayer = document.getElementById("songPlayer");
	songplayer.classList.remove("songPlayerHover");
	songplayer.classList.add("songPlayerNotHover");
}

function SongSetup() {
	if (songSetupFinished)
		return;
	songSetupFinished = true;
	AddSong("Driving Simulator Music", "Menu music I made for an unreleased driving simulator.", "Music/1/DrivingSim.mp3", []);
	AddSong("Orchestral Action Music", "Action music I made for an indie RPG.", "Music/1/OrchestralAction.mp3", [])
	AddSong("Zombie Shooter Soundtrack", "The overall soundtrack for a zombie shooter game. It starts out calm, and eventually becomes more tense.", "Music/1/ZombieApocGameFull.3.mp3", [])
	AddSong("Welcome To Space", "Some upbeat music for the <i>Welcome, Primitive Lifeform, to Space</i> Soundtrack", "Music/2/WelcomeToSpace.mp3", [])
	AddSong("The Ordinance", "The theme for a spaceship capable of mass destruction, from Welcome, Primitive Lifeform, To Space (WPLTS).", "Music/2/TheOrdinance.mp3", [])
	AddSong("ACX-48", "The theme for a mining facility, in which players are encouraged to raid, from WPLTS.", "Music/2/ACX48.mp3", [])
	AddSong("Smooth PE Jazz", "", "Music/PeJazz/Smooth Pe Jazz.wav", [], true);
	AddSong("Attack Of The Drill Sargeant", "", "Music/PeJazz/Attack Of The Drill Sargeant.wav", [], true);
	AddSong("Sweat and Fatigue", "", "Music/PeJazz/Sweat.wav", [], true);
	AddSong("Slippery Floors and Squeaky Shoes", "", "Music/PeJazz/slippery.wav", [], true);
	AddSong("My Kneecaps Ran Away", "", "Music/PeJazz/My Kneecaps Ran Away (tragic).wav", [], true);
	if (isIOS)
		setTimeout(InitAmplitude, 100)
	else
		InitAmplitude()

}

function InitAmplitude() {
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

function Setup() {
	SongSetup();
	if (setupFinished) return;
	for (var x = 0; x < mySongs.length; x++) {
		if (mySongs[x]["addHTML"] != true && document.getElementById("musicgrid") != null)
			document.getElementById("musicgrid").innerHTML += mySongs[x]["html"];
	}
	if (document.getElementById("songPlayer") == undefined)
		document.body.innerHTML += mediaPlayerHTML;
	setupFinished = true;
	songplayer = document.getElementById("songPlayer");
	if (onPhone) {
		console.log(songPlayer);
		songPlayer.style.width = "100%";
		document.getElementById("song-played-progress").style.width = "90%";
		setTimeout(MouseEnter, 1000);
	}
	console.log('test')

	//taken from https://521dimensions.com/open-source/amplitudejs/docs/examples/multiple-songs.html and barely modified
	document.getElementById('song-played-progress').addEventListener('click', function (e) {
		var offset = this.getBoundingClientRect();
		var x = e.pageX - offset.left;
		Amplitude.setSongPlayedPercentage((parseFloat(x) / parseFloat(this.offsetWidth)) * 100);
	});
	if (!onPhone && !isIOS) {
		songplayer.classList.toggle("songPlayerNotHover")
		songplayer.addEventListener("mouseenter", function () {
			isHovering = true;
			setTimeout(function () {
				if (isHovering) MouseEnter()
			}, 500);
		});
		songplayer.addEventListener("mouseleave", MouseLeave)
	}
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
	if (localStorage.themeIndex == undefined)
		localStorage.themeIndex = 0;

	setTimeout(function () {
		setInterval(SongCookieUpdate, 10);
	}, 500);
	var playerstate = Cookies.get("playState");
	if (!isIOS)
		if (playerstate == "stopped" || playerstate == "paused") {
			setTimeout(Amplitude.pause, 30);
			console.log("PAUSE because of last playerstate. ")
		}
	Amplitude.bindNewElements();
	songplayer.style.visibility = "visible"
}

function SongCookieUpdate() {
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
var visualizerCode = ""

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
	setTimeout(SongCookieUpdate, 10);
	if (onPhone || isIOS)
		return;
	MouseEnter();
	setTimeout(MouseLeave, 500);
}

window.addEventListener('keydown', function (e) {
	if (e.keyCode == 32 && e.target == document.body) {
		e.preventDefault(); //don't scroll on pressing spacebar
		document.getElementById("play-pause").click()
	}
});
SongSetup();
setTimeout(function () {
	if (!setupFinished) Setup();
}, 900)