document.head.innerHTML += ''
width = document.documentElement.clientWidth;
height = document.documentElement.clientHeight;
var onPhone = width < height;
mySongs = []
var isHovering = false;


function AddSong(name, desc, url, tags)
{
	document.getElementById("musicgrid").innerHTML += '<div class="music amplitude-skip-to" data-amplitude-song-index="'+mySongs.length+'" onclick="PlaySong()" data-amplitude-location="0"><div class="background"></div><h3>'+name+'</h3><p>'+desc+'</p></div>'
               
	mySongs.push({"name": name, "artist": "Trevor Bagels", "album": "none", "url": url})
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
function Setup()
{
	songplayer = document.getElementById("songPlayer");
	if(onPhone)
	{
		console.log(songPlayer);
		songPlayer.style.width = "100%";
		document.getElementById("song-played-progress").style.width = "90%";
		setTimeout(MouseEnter, 1000);
	}
	console.log('test')
	AddSong("Driving Simulator Music", "Menu music I made for an unreleased driving simulator.", "Music/1/DrivingSim.mp3");
	AddSong("Orchestral Action Music", "Action music I made for an indie RPG.", "Music/1/OrchestralAction.mp3")
	AddSong("Zombie Shooter Soundtrack", "The overall soundtrack for a zombie shooter game. It starts out calm, and eventually becomes more tense.", "Music/1/ZombieApocGameFull.3.mp3")
	AddSong("Welcome To Space", "Some upbeat music for the <i>Welcome, Primitive Lifeform, to Space</i> Soundtrack", "Music/2/WelcomeToSpace.mp3")
	AddSong("The Ordinance", "The theme for a spaceship capable of mass destruction, from Welcome, Primitive Lifeform, To Space (WPLTS).", "Music/2/TheOrdinance.mp3")
	AddSong("ACX-48", "The theme for a mining facility, in which players are encouraged to raid, from WPLTS.", "Music/2/ACX48.mp3")
	Amplitude.init({songs: mySongs})

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

}
function PlaySong()
{
	setTimeout(function(){document.getElementById("songInfo").innerHTML = mySongs[Amplitude.getActiveIndex()]["name"];}, 10);
	if(onPhone)
		return;	
	MouseEnter()
	setTimeout(MouseLeave, 500);
}

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    	e.preventDefault(); //don't scroll on pressing spacebar
    	document.getElementById("play-pause").click()
  }
});


