const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 256;
analysier.smoothingTimeConstant = 0.85;
const AudioData = new Uint8Array(analysier.frequencyBinCount)

let notes = 60;
let CenterX,CenterY;
let MaxHeight = 400;
function Size(){
    DaCanvas.width = window.innerWidth;
    DaCanvas.height = window.innerHeight;
    CenterX = DaCanvas.width/2;
    CenterY = DaCanvas.height/2;
}

Size();
window.addEventListener("resize",Size);

async function startVisualizer(){
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
        const source = DaAudio.createMediaStreamSource(stream);
        source.connect(analysier);
        if (DaAudio.state === "suspended"){
            DaAudio.resume();
        }
        document.documentElement.requestFullscreen();
        document.getElementById("UILayer").classList.add("hidden");
        MovingOnes();
    }
    catch(err){
        console.error("Audio capture failed:", err);
        document.getElementById("Start").innerText = "capture denied - try again";
    }
}


function Bar(){
    DaBrush.fillStyle = "rgba(0,0,0,0.25)";
    DaBrush.fillRect(0,0,DaCanvas.width, DaCanvas.height);
    analysier.getByteFrequencyData(AudioData);
    let barbase = DaCanvas.height - 100;
    let barWidth = (DaCanvas.width/notes)-5;

    let colorGradient = DaBrush.createLinearGradient(0,barbase,0,barbase - MaxHeight);
    colorGradient.addColorStop(0,"#0e5c2a");
    colorGradient.addColorStop(1,"#1db954");
    DaBrush.fillStyle = colorGradient;
    DaBrush.shadowBlur = 15;
    DaBrush.shadowColor = "#1db954";

    for(let _=0;_<notes;_++){
        let x = (DaCanvas.width/notes)*_;
        let Freq = AudioData[_]/255;

        let Height =Math.pow(Freq,1.2) *MaxHeight;
        if (Height<2) Height =2;
        DaBrush.fillRect(x,barbase,barWidth,-Height)
        
    }
    DaBrush.shadowBlur = 0;
}

function MovingOnes(){
    Bar();
    requestAnimationFrame(MovingOnes);
    
}