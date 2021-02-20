var pejazzpage = `
		<nav><a href="javascript:LoadPage('index.html', mainPageData)">Back</a></nav>
        <div id='content'>
            <br>
            <h2>SMOOTH PE JAZZ</h2>
            <p>A musical style I generated through the creation of several programs (using python and midi utilities). Enjoy the mayhem.</p>
            <br><br></div>
            <div class="AudioPlayer" style='width: 100%;'>
    <div><h3 style="display:inline-block;padding-right: 20px;width: 20%;">Smooth PE Jazz</h3><audio  controls preload="metadata" style="width:300px;display: inline;height:25px;"><source src="Music/PeJazz/Smooth Pe Jazz.wav" type="audio/mpeg"></audio></div>
    <div><h3 style="display:inline-block;padding-right: 20px;width: 20%;">Attack of the Drill Sargeant</h3><audio  controls preload="metadata" style="width:300px;display: inline;height:25px;"><source src="Music/PeJazz/Attack Of The Drill Sargeant.wav" type="audio/mpeg"></audio></div>
    <div><h3 style="display:inline-block;padding-right: 20px;width: 20%;">Birds Don't Run The Mile</h3><audio  controls preload="metadata" style="width:300px;display: inline;height:25px;"><source src="Music/PeJazz/BirdsDontNeedExercise.wav" type="audio/mpeg"></audio></div>
    <div><h3 style="display:inline-block;padding-right: 20px;width: 20%;">Sweat and Fatigue</h3><audio  controls preload="metadata" style="width:300px;display: inline;height:25px;"><source src="Music/PeJazz/Sweat.wav" type="audio/mpeg"></audio></div>
    <div><h3 style="display:inline-block;padding-right: 20px;width: 20%;">Slippery Floors and Squeaky Shoes</h3><audio  controls preload="metadata" style="width:300px;display: inline;height:25px;"><source src="Music/PeJazz/slippery.wav" type="audio/mpeg"></audio></div>
    <div><h3 style="display:inline-block;padding-right: 20px;width: 20%;">My Kneecaps Ran Away</h3><audio  controls preload="metadata" style="width:300px;display: inline;height:25px;"><source src="Music/PeJazz/My Kneecaps Ran Away (tragic).wav" type="audio/mpeg"></audio></div>
    </div>
    <style>
    #cover
    {
        width: 100%;
  position: sticky;
  top: -15%;
  z-index: -1;
    }
    /*
    #containerMain
    {
    perspective: 100vw;
  transform-style: preserve-3d;
    height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
    }*/
    #content
    {
        perspective: 50vw;
    position: relative;
    display: block;
    z-index: 1;
    }
    </style>
`
//this is when I was trying to add dynamic page loading. not as easy as I thought, this file is pretty much pointless