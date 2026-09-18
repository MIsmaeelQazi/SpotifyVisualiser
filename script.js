const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 512;
analysier.smoothingTimeConstant = 0.85;
const AudioData = new Uint8Array(analysier.frequencyBinCount)
const colors = [
    { topEdge: "#ffcc00", topMid: "#cc0033", center: "#050000", bottomMid: "#0088ff", bottomEdge: "#ff00ff", shadow: "#0088ff" },
    { topEdge: "#ffffff", topMid: "#0055ff", center: "#000005", bottomMid: "#5d3fd3", bottomEdge: "#00ff00", shadow: "#5d3fd3" },
    { topEdge: "#ffcc00", topMid: "#00cc66", center: "#000500", bottomMid: "#0088ff", bottomEdge: "#aa00ff", shadow: "#00cc66" },
    { topEdge: "#ff6600", topMid: "#8b0000", center: "#050000", bottomMid: "#003311", bottomEdge: "#ff0000", shadow: "#ff0000" },
    { topEdge: "#ffffff", topMid: "#0033aa", center: "#000005", bottomMid: "#cc0033", bottomEdge: "#ff9900", shadow: "#0033aa" },
    { topEdge: "#00ff00", topMid: "#5d3fd3", center: "#050005", bottomMid: "#cc0033", bottomEdge: "#ffcc00", shadow: "#5d3fd3" },
    { topEdge: "#ffffff", topMid: "#ffaa00", center: "#050500", bottomMid: "#00cc66", bottomEdge: "#00ffcc", shadow: "#ffaa00" },
    { topEdge: "#aaff00", topMid: "#334400", center: "#000000", bottomMid: "#330066", bottomEdge: "#00ffff", shadow: "#330066" },
    { topEdge: "#6600ff", topMid: "#220044", center: "#000000", bottomMid: "#220044", bottomEdge: "#6600ff", shadow: "#220044" }];
let DaTheme = 0;
window.addEventListener("keydown",(event)=> {
    
    if (event.key==="ArrowRight") DaTheme += 1;
    if (event.key==="ArrowLeft") DaTheme -= 1;
    if (DaTheme < 0){
        DaTheme = colors.length -1;}
    if (DaTheme >= colors.length){
        DaTheme = 0;
    }

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
    notes = Math.min(256,Math.floor(DaCanvas.width/10));
}

Size();
window.addEventListener("resize",Size);

async function startVisualizer(){
    try {
        if (DaAudio.state === "suspended"){
            DaAudio.resume();
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
        const source = DaAudio.createMediaStreamSource(stream);
        source.connect(analysier);
        
        document.getElementById("UILayer").classList.add("hidden");
        MovingOnes();
    }
    catch(err){
        console.error("Audio capture failed:", err);
        document.getElementById("Start").innerText = "capture denied - try again";
    }
}


function Bar(){
    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    analysier.getByteFrequencyData(AudioData);
    let barbase = DaCanvas.height/2;

    let sliceWidth = DaCanvas.width / notes;
    let barWidth = sliceWidth *0.6;

    let Theme = colors[DaTheme];
    let colorGradient = DaBrush.createLinearGradient(0,barbase-MaxHeight,0,barbase +MaxHeight);
    colorGradient.addColorStop(0,Theme.topEdge);
    colorGradient.addColorStop(0.4,Theme.topMid);
    colorGradient.addColorStop(0.5,Theme.center);
    colorGradient.addColorStop(0.6,Theme.bottomMid);
    colorGradient.addColorStop(1,Theme.bottomEdge);

    DaBrush.fillStyle = colorGradient;
    DaBrush.shadowBlur = 4;
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

