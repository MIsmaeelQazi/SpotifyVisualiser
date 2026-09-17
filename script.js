const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const Muzic = document.getElementById("Muzic")
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
const Source = DaAudio.createMediaElementSource(Muzic);


Source.connect(analysier);
analysier.connect(DaAudio.destination);
analysier.fftSize = 128;
const AudioData = new Uint8Array(analysier.frequencyBinCount);


let notes = 50;
let CenterX = DaCanvas.width/2;
let CenterY = DaCanvas.height/2;
let MaxHeight = 300;
function Size(){
    DaCanvas.width = window.innerWidth;
    DaCanvas.height = window.innerHeight;
    CenterX = DaCanvas.width/2;
    CenterY = DaCanvas.height/2;
}
Size();
window.addEventListener("resize",Size);
function Bar(){
    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    DaBrush.fillStyle = "white";
    analysier.getByteFrequencyData(AudioData);
    for(let _=0;_<notes;_++){
        let x = (DaCanvas.width/notes)*_;
        let Distance = Math.abs(x - CenterX);
        let Freq = AudioData[_]/255;
        let Height = Freq *MaxHeight;
        DaBrush.fillRect(x,CenterY - Height/2,5,Height)
        
    }
}


Bar()
function MovingOnes(){
    Bar();
    requestAnimationFrame(MovingOnes);
    
}

function Controls(){
    if (DaAudio.state === "suspended"){
        DaAudio.resume();
    }
    if (Muzic.paused){
        document.getElementById("PlayPause").innerText = "pause";
    }
    else{
        Muzic.pause();
        document.getElementById("PlayPause").innerText = "play"
    }


}

MovingOnes();
