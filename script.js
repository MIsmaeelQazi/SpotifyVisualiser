const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 512;
analysier.smoothingTimeConstant = 0.85;
const AudioData = new Uint8Array(analysier.frequencyBinCount)
const colors = [{top:"#00ffcc",mid:"#0044ff", center:"#020205", shadow:"#00ffcc"},
    {top:"#ff00aa",mid:"#7a00ff", center:"#00ffff", shadow:"#00ffff"},
    {top:"#ff3300",mid:"#ff9900", center:"#00ffff", shadow:"#ff3300"},
    {top:"#ff0000",mid:"#00ff00", center:"#0000ff", shadow:"#ff00ff"},
    {top:"#4b0032",mid:"#110022", center:"#000000", shadow:"#4b0082"},
];
let DaTheme = 1;
window.addEventListener("keydown",(event)=> {
    if (event.key==="1") DaTheme = 0;
    if (event.key==="2") DaTheme = 1;
    if (event.key==="3") DaTheme = 2;
    if (event.key==="4") DaTheme = 3;
    if (event.key==="5") DaTheme = 4;
});


let notes;
let CenterX,CenterY;
let MaxHeight;
function Size(){
    DaCanvas.width = window.innerWidth;
    DaCanvas.height = window.innerHeight;
    CenterX = DaCanvas.width/2;
    CenterY = DaCanvas.height/2;

    MaxHeight = DaCanvas.height*0.45;
    notes = Math.min(150,Math.floor(DaCanvas.width/25));
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
        document.getElementById("Start").innerText = "capture denied - try again";
    }
}


function Bar(){
    DaBrush.fillStyle = "rgba(0,0,0,0.25)";
    DaBrush.fillRect(0,0,DaCanvas.width, DaCanvas.height);
    analysier.getByteFrequencyData(AudioData);
    let barbase = DaCanvas.height/2;

    let sliceWidth = DaCanvas.width / notes;
    let barWidth = sliceWidth *0.6;

    let Theme = colors[DaTheme];
    let colorGradient = DaBrush.createLinearGradient(0,barbase-MaxHeight,0,barbase +MaxHeight);
    colorGradient.addColorStop(0,Theme.top);
    colorGradient.addColorStop(0.25,Theme.mid);
    colorGradient.addColorStop(0.5,Theme.center);
    colorGradient.addColorStop(0.75,Theme.mid);
    colorGradient.addColorStop(1,Theme.top);

    DaBrush.fillStyle = colorGradient;
    DaBrush.shadowBlur = 15;
    DaBrush.shadowColor = Theme.shadow;

    for(let _=0;_<notes;_++){

        let x = (sliceWidth*_) +(sliceWidth*0.2);
        let Freq = AudioData[_]/255;

        let FreqMultiplier = 1 +(_/notes)*0.8;
        if (_ < 5) FreqMultiplier = 0.8;

        let Height =Math.pow(Freq,1.4)*MaxHeight* FreqMultiplier;
        if (Height<2) Height =2;
        DaBrush.fillRect(x,barbase,barWidth,-Height)
        DaBrush.fillRect(x,barbase,barWidth,Height)
        
    }
    DaBrush.shadowBlur = 0;
}

function MovingOnes(){
    Bar();
    requestAnimationFrame(MovingOnes);
    
}

