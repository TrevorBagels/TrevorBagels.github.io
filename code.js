document.head.innerHTML += ''
var onPhone = document.documentElement.clientWidth < document.documentElement.clientHeight;
mySongs = []
var isHovering = false;
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
function AddSong(name, desc, url, tags, disableHtml)
{
	console.log(disableHtml);
	var fileDepthPrefix = "";
	try{
		if(fileDepth != undefined) fileDepthPrefix = fileDepth;
	}
	catch{
		//continue
	}
	
	var html = '<div class="music amplitude-skip-to" data-amplitude-song-index="'+mySongs.length+'" onclick="PlaySong()" data-amplitude-location="0"><div class="background"></div><h3>'+name+'</h3><p>'+desc+'</p></div>';
	if(disableHtml == null && document.getElementById("musicgrid") != null)
	{
		document.getElementById("musicgrid").innerHTML += html   
	}
	mySongs.push({"name": name, "artist": "Trevor Bagels", "album": "none", "url": fileDepthPrefix + url, "html": html, "addHTML": disableHtml})
	return html;
}
function Hover()
{
	isHovering = true;
	console.log("HOVER");
	songplayer = document.getElementById("songPlayer");
	songplayer.classList.toggle("songPlayerHover");
	songplayer.classList.toggle("songPlayerNotHover");
}
function MouseEnter()
{
	isHovering = false;
	songplayer = document.getElementById("songPlayer");
	songplayer.classList.add("songPlayerHover");
	songplayer.classList.remove("songPlayerNotHover");
}
function MouseLeave()
{
	songplayer = document.getElementById("songPlayer");
	songplayer.classList.remove("songPlayerHover");
	songplayer.classList.add("songPlayerNotHover");
}
function SongSetup()
{
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
	AddSong("My Kneecaps Ran Away", "", "Music/PeJazz/My Kneecaps Ran Away.wav", [], true);
}

function Setup()
{
	if(setupFinished) return;
	setupFinished = true;
	SongSetup();
	if(document.getElementById("songPlayer") == undefined)
		document.body.innerHTML += mediaPlayerHTML;
	Amplitude.init({"songs": mySongs, "autoplay": true});
	songplayer = document.getElementById("songPlayer");
	if(onPhone)
	{
		console.log(songPlayer);
		songPlayer.style.width = "100%";
		document.getElementById("song-played-progress").style.width = "90%";
		setTimeout(MouseEnter, 1000);
	}
	console.log('test')

	//taken from https://521dimensions.com/open-source/amplitudejs/docs/examples/multiple-songs.html and barely modified
	document.getElementById('song-played-progress').addEventListener('click', function(e){
			var offset = this.getBoundingClientRect();
			var x = e.pageX - offset.left;
			Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
	});
	if(!onPhone)
	{
		songplayer.classList.toggle("songPlayerNotHover")
		songplayer.addEventListener("mouseenter", function(){isHovering = true; setTimeout(function(){
			if(isHovering)MouseEnter()
		}, 500);});
		songplayer.addEventListener("mouseleave", MouseLeave)
	}
	if(Cookies.get("songIndex") != undefined)
	{
		console.log("cookies are already set");
		var songTime = Cookies.get("songTime");
		SkipTo(Cookies.get("songIndex"), songTime);
	}
	else{
		console.log("setting cookies");
		Cookies.set("songIndex", 0);
		Cookies.set("songTime", 0);
		Cookies.set("playState", Amplitude.getPlayerState());
	}
	
	setTimeout(function(){setInterval(SongCookieUpdate, 10);}, 500);
	var playerstate = Cookies.get("playState");
	if(playerstate == "stopped" || playerstate == "paused")
		Amplitude.pause();
}
function SongCookieUpdate()
{
	try{
		if(Amplitude.getSongPlayedSeconds() != undefined)
		{
			Cookies.set("songIndex", Amplitude.getActiveIndex());
			Cookies.set("songTime", Amplitude.getSongPlayedSeconds());
			Cookies.set("playState", Amplitude.getPlayerState())
		}
	}
	catch{
		console.log('something went wrong');
		return;
	}
	document.getElementById("songInfo").innerHTML = mySongs[Amplitude.getActiveIndex()]["name"];
}
function SkipTo(trackIndex, seconds)
{
	console.log("Skipping to " + seconds);
	Amplitude.skipTo(seconds, trackIndex);
	PlaySong();
}
function PlaySong()
{
	console.log("Playing song...");
	setTimeout(SongCookieUpdate, 10);
	if(onPhone)
		return;	
	MouseEnter();
	setTimeout(MouseLeave, 500);
}

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    	e.preventDefault(); //don't scroll on pressing spacebar
    	document.getElementById("play-pause").click()
  }
});

setTimeout(function(){if(!setupFinished) Setup();}, 900)
