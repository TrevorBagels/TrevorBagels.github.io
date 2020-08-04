document.head.innerHTML += ''
var onPhone = document.documentElement.clientWidth < document.documentElement.clientHeight;
mySongs = []
var timeOnPage = Date.now()
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
var songSetupFinished = false;
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
	/*if(disableHtml == null && document.getElementById("musicgrid") != null)
	{
		document.getElementById("musicgrid").innerHTML += html   
	}*/
	mySongs.push({"name": name, "artist": "Trevor Bagels", "album": "none", "url": fileDepthPrefix + url, "html": html, "addHTML": disableHtml})
}

function SongSetup()
{
	if(songSetupFinished)
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
	Amplitude.init({"songs": mySongs, visualizations: [
      {object: MichaelBromleyVisualization, params: {}}
      ], visualization: 'michaelbromley_visualization', "autoplay": true});
}

setTimeout(SongSetup(), 1000);
