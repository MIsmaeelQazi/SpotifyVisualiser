const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 512;
analysier.smoothingTimeConstant = 0.85;
const AudioData = new Uint8Array(analysier.frequencyBinCount)
const colors = [
    { name: "VI / JINX", bg: "radial-gradient(circle at center, #1a0005 0%, #000000 100%)", topEdge: "#ffcc00", topMid: "#cc0033", center: "#050000", bottomMid: "#0088ff", bottomEdge: "#ff00ff", shadow: "#0088ff" },
    { name: "JAYCE / VIKTOR", bg: "radial-gradient(circle at center, #00051a 0%, #000000 100%)", topEdge: "#ffffff", topMid: "#0055ff", center: "#000005", bottomMid: "#5d3fd3", bottomEdge: "#00ff00", shadow: "#5d3fd3" },
    { name: "EKKO / JINX", bg: "radial-gradient(circle at center, #001a0a 0%, #000000 100%)", topEdge: "#ffcc00", topMid: "#00cc66", center: "#000500", bottomMid: "#0088ff", bottomEdge: "#aa00ff", shadow: "#00cc66" },
    { name: "VANDER / SILCO", bg: "radial-gradient(circle at center, #1a0500 0%, #000000 100%)", topEdge: "#ff6600", topMid: "#8b0000", center: "#050000", bottomMid: "#003311", bottomEdge: "#ff0000", shadow: "#ff0000" },
    { name: "CAITLYN / VI", bg: "radial-gradient(circle at center, #05051a 0%, #000000 100%)", topEdge: "#ffffff", topMid: "#0033aa", center: "#000005", bottomMid: "#cc0033", bottomEdge: "#ff9900", shadow: "#0033aa" },
    { name: "SEVIKA / VI", bg: "radial-gradient(circle at center, #0f001a 0%, #000000 100%)", topEdge: "#00ff00", topMid: "#5d3fd3", center: "#050005", bottomMid: "#cc0033", bottomEdge: "#ffcc00", shadow: "#5d3fd3" },
    { name: "HEIMERDINGER / EKKO", bg: "radial-gradient(circle at center, #1a1500 0%, #000000 100%)", topEdge: "#ffffff", topMid: "#ffaa00", center: "#050500", bottomMid: "#00cc66", bottomEdge: "#00ffcc", shadow: "#ffaa00" },
    { name: "SINGED / VIKTOR", bg: "radial-gradient(circle at center, #0a1a00 0%, #000000 100%)", topEdge: "#aaff00", topMid: "#334400", center: "#000000", bottomMid: "#330066", bottomEdge: "#00ffff", shadow: "#330066" },
    { name: "PURE AMBIENT", bg: "radial-gradient(circle at center, #05001a 0%, #000000 100%)", topEdge: "#6600ff", topMid: "#220044", center: "#000000", bottomMid: "#220044", bottomEdge: "#6600ff", shadow: "#220044" }];


let DaTheme = 0;
let stars = [];
const NoOfStars = 120;

function Starry(){
    particles = [];
    for(let _ = 0; _ < NoOfStars;_++){
        stars.push({
            x:Math.random() * window.innerWidth,
            y:Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5)* 0.5,
            vy:(Math.random()- 0.5) * 0.5,
            size:Math.random() * 1 +0.2,
            opacity:Math.random() * 0.2 +0.05
        });
    }
}
Starry();


function UpdateUI(){
    let Theme = colors[DaTheme]
    document.body.style.background = Theme.bg;
    const StartButton = document.getElementById("Start");
    if (StartButton.classList.contains("playing-mode")){
        StartButton.innerText =Theme.name;

    }
    else{
        StartButton.innerText = "START:" +Theme.name;
    }
    StartButton.style.borderColor = Theme.shadow;
    StartButton.style.color = Theme.shadow;
    StartButton.style.boxShadow = `0 0 15px ${Theme.shadow}40, inset 0 0 10px ${Theme.shadow}20`;
}
UpdateUI();


window.addEventListener("keydown",(event)=> {
    
    if (event.key==="ArrowRight") DaTheme += 1;
    if (event.key==="ArrowLeft") DaTheme -= 1;
    if (DaTheme < 0){
        DaTheme = colors.length -1;}
    if (DaTheme >= colors.length){
        DaTheme = 0;
    }
    UpdateUI();
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
    Starry();
}

Size();
window.addEventListener("resize",Size);

async function startVisualizer(){
    try {
        if (DaAudio.state === "suspended"){
            DaAudio.resume();
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
        stream.getVideoTracks()[0].stop();
        const source = DaAudio.createMediaStreamSource(stream);
        source.connect(analysier);
        

        document.getElementById("Start").classList.add("playing-mode");
        MovingOnes();
    }
    catch(err){
        console.error("Audio capture failed:", err);
        document.getElementById("Start").classList.add("CAPTURE DENIED - TRY AGAIN");
    }
}


function Bar(){
    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    analysier.getByteFrequencyData(AudioData);
    let barbase = DaCanvas.height/2;
    let Theme = colors[DaTheme];

    let Bass = (AudioData[0]+AudioData[1]+AudioData[2]+AudioData[3]+AudioData[4])/5/255;
    DaBrush.fillStyle = Theme.shadow;
    stars.forEach(p =>{
        p.x+= p.vx * (1 +Bass*10);
        p.y += p .vy * (1 +Bass*10);

        if (p.x <0) p.x= DaCanvas.width;
        if (p.x>DaCanvas.width) p.x = 0;
        if(p.y < 0) p.y = DaCanvas.height;
        if(p.y > DaCanvas.height) p.y = 0;

        DaBrush.beginPath();
        DaBrush.arc(p.x,p.y,p.size,0,Math.PI * 2);

        DaBrush.arc(p.x,p.y,p.size,0,Math.PI*2);
        DaBrush.opacity = Math.min(1,p.opacity + (Bass*0.8));
        DaBrush.fill();

    });
    DaBrush.opacity = 1;





    let sliceWidth = DaCanvas.width / notes;
    let barWidth = sliceWidth *0.6;

    
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

