const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 256;
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
        document.getElementById("UILayer").classList.add("hidden");
        MovingOnes();
    }
    catch(err){
        console.error("Audio capture failed:", err);
        document.getElementsById("Start").innerText = "capture denied - try again";
    }
}


function Bar(){
    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    DaBrush.fillStyle = "#1db954";
    analysier.getByteFrequencyData(AudioData);
    let barbase = DaCanvas.height - 100;
    let barWidth = (DaCanvas.width/notes)-2;
    for(let _=0;_<notes;_++){
        let x = (DaCanvas.width/notes)*_;
        let Freq = AudioData[_]/255;
        let Height = Freq *MaxHeight;
        DaBrush.fillRect(x,barbase,barWidth,-Height)
        
    }
}

function MovingOnes(){
    Bar();
    requestAnimationFrame(MovingOnes);
    
}