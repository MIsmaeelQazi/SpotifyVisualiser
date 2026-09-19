const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 512;
analysier.smoothingTimeConstant = 0.85;
const AudioData = new Uint8Array(analysier.frequencyBinCount)
const colors = [
    { name: "VI / JINX", bg: "radial-gradient(circle at center, #1a0010 0%, #000000 100%)", topEdge: "#ff3399", topMid: "#cc0066", center: "#050005", bottomMid: "#0088ff", bottomEdge: "#00e5ff", shadow: "#ff3399" },
    { name: "JAYCE / VIKTOR", bg: "radial-gradient(circle at center, #00101a 0%, #000000 100%)", topEdge: "#ffd700", topMid: "#4fc3f7", center: "#00050a", bottomMid: "#007a7a", bottomEdge: "#00ffcc", shadow: "#4fc3f7" },
    { name: "EKKO / JINX", bg: "radial-gradient(circle at center, #001a0a 0%, #000000 100%)", topEdge: "#00ff88", topMid: "#00994d", center: "#001a0a", bottomMid: "#0088ff", bottomEdge: "#ff33cc", shadow: "#00cc66" },
    { name: "VANDER / SILCO", bg: "radial-gradient(circle at center, #1a0500 0%, #000000 100%)", topEdge: "#ff8800", topMid: "#cc4400", center: "#1a0500", bottomMid: "#4b0082", bottomEdge: "#00cccc", shadow: "#cc4400" },
    { name: "CAITLYN / VI", bg: "radial-gradient(circle at center, #05051a 0%, #000000 100%)", topEdge: "#cceeff", topMid: "#3388ff", center: "#05051a", bottomMid: "#cc0066", bottomEdge: "#ff3399", shadow: "#3388ff" },
    { name: "SEVIKA / VI", bg: "radial-gradient(circle at center, #0f001a 0%, #000000 100%)", topEdge: "#ffaa00", topMid: "#9900cc", center: "#0f001a", bottomMid: "#cc0066", bottomEdge: "#ff3399", shadow: "#9900cc" },
    { name: "HEIMERDINGER / EKKO", bg: "radial-gradient(circle at center, #1a1500 0%, #000000 100%)", topEdge: "#ffcc00", topMid: "#4488ff", center: "#1a1500", bottomMid: "#00994d", bottomEdge: "#00ff88", shadow: "#ffcc00" },
    { name: "SINGED / VIKTOR", bg: "radial-gradient(circle at center, #0a1a00 0%, #000000 100%)", topEdge: "#aaff00", topMid: "#558800", center: "#0a1a00", bottomMid: "#007a7a", bottomEdge: "#00ffff", shadow: "#558800" },
    { name: "VANDER / VI", bg: "radial-gradient(circle at center, #1a0a00 0%, #000000 100%)", topEdge: "#ff8800", topMid: "#cc4400", center: "#1a0a05", bottomMid: "#cc0066", bottomEdge: "#ff3399", shadow: "#ff6633" },
    { name: "SILCO / JINX", bg: "radial-gradient(circle at center, #0f001a 0%, #000000 100%)", topEdge: "#00cccc", topMid: "#4b0082", center: "#05001a", bottomMid: "#0088ff", bottomEdge: "#ff33cc", shadow: "#4b0082" },
    { name: "MEL / AMBESSA", bg: "radial-gradient(circle at center, #1a0005 0%, #000000 100%)", topEdge: "#ffcc00", topMid: "#cc0033", center: "#1a0005", bottomMid: "#660022", bottomEdge: "#990033", shadow: "#cc0033" },
    { name: "CAITLYN / CASSANDRA", bg: "radial-gradient(circle at center, #05050f 0%, #000000 100%)", topEdge: "#cceeff", topMid: "#3388ff", center: "#05050a", bottomMid: "#336699", bottomEdge: "#ffd700", shadow: "#3388ff" },
    { name: "ISHA / JINX", bg: "radial-gradient(circle at center, #0f0015 0%, #000000 100%)", topEdge: "#ffccee", topMid: "#cc99ff", center: "#0f0015", bottomMid: "#0088ff", bottomEdge: "#ff33cc", shadow: "#cc99ff" },
    { name: "JINX / CAITLYN", bg: "radial-gradient(circle at center, #05051a 0%, #000000 100%)", topEdge: "#ff33cc", topMid: "#0088ff", center: "#05051a", bottomMid: "#336699", bottomEdge: "#cceeff", shadow: "#0088ff" },
    { name: "JAYCE / VI", bg: "radial-gradient(circle at center, #05050a 0%, #000000 100%)", topEdge: "#ffd700", topMid: "#4fc3f7", center: "#05050a", bottomMid: "#cc0066", bottomEdge: "#ff3399", shadow: "#4fc3f7" },
    { name: "PURE AMBIENT", bg: "radial-gradient(circle at center, #05001a 0%, #000000 100%)", topEdge: "#6600ff", topMid: "#220044", center: "#000000", bottomMid: "#220044", bottomEdge: "#6600ff", shadow: "#220044" }
];

let DaTheme = 0;
let stars = [];
const NoOfStars = 120;
let Caps = new Array(256).fill(0)

function Starry(){
    particles = [];
    for(let _ = 0; _ < NoOfStars;_++){
        stars.push({
            x:Math.random() * window.innerWidth,
            y:Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5)* 0.5,
            vy:(Math.random()- 0.5) * 0.5,
            size:Math.random() * 1 +0.2,
            globalAlpha:Math.random() * 0.2 +0.05
        });
    }
}
Starry();

let Mode = "Bars"
function UpdateUI(){
    let Theme = colors[DaTheme]
    document.body.style.background = Theme.bg;
    const StartButton = document.getElementById("Start");
    let modeText = Mode ==="HexCore"? "(Hex-Core)":"";
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
    if (event.key === "ArrowUp" || event.key === "ArrowDown"){
        Mode = (Mode ==="Bars")? "HexCore":"Bars";
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
        UpdateUI();
        MovingOnes();
    }
    catch(err){
        console.error("Audio capture failed:", err);
        document.getElementById("Start").innerText ="CAPTURE DENIED - TRY AGAIN";
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
        if (Mode === "HexCore"){

            DaBrush.arc(p.x,p.size*12,0,Math.PI *2);
            DaBrush.fillStyle = Theme.topMid;
            DaBrush.globalAlpha = Math.min(0.2, (p.opacity*0.4) + (Bass*0.2));
            DaBrush.shadowBlur = 15;
            DaBrush.shadowColor = Theme.bottomMid;

        }
        else{
        DaBrush.arc(p.x,p.y,p.size,0,Math.PI * 2);
        DaBrush.fillStyle = Theme.shadow;
        DaBrush.globalAlpha = Math.min(1,p.globalAlpha + (Bass*0.8));
        DaBrush.shadowBlur = 0;
        
        DaBrush.fill();
        }
    });
    DaBrush.globalAlpha = 1;
    DaBrush.shadowBlur = 0;

    let glitchOffset = 0;
    if(Bass > 0.65){
        glitchOffset = (Math.random()-0.5)*(Bass*30);
    let hexRadius= 130;
    if (Mode === "HexCore"){
        DaBrush.beginPath();
        DaBrush.arc(CenterX +glitchOffset, CenterY +glitchOffset,hexRadius -5,0,Math.PI *2);
        DaBrush.fillStyle = Theme.center;
        DaBrush.shadowBlur = 20 + (Bass *80);
        DaBrush.fill();
        DaBrush.shadowBlur = 0;
    }



    let sliceWidth = DaCanvas.width / notes;
    let barWidth = Mode === "HexCore" ? ((Math.PI*2*hexRadius)/notes) *0.6:sliceWidth*0.6;
    
    let colorGradient = DaBrush.createLinearGradient(0,barbase-MaxHeight,0,barbase +MaxHeight);
    colorGradient.addColorStop(0,Theme.topEdge);
    colorGradient.addColorStop(0.4,Theme.topMid);
    colorGradient.addColorStop(0.5,Theme.center);
    colorGradient.addColorStop(0.6,Theme.bottomMid);
    colorGradient.addColorStop(1,Theme.bottomEdge);

    for(let _=0;_<notes;_++){

        let Freq = AudioData[_]/255;
        let FreqMultiplier = 1 +(_/notes)*0.8;
        if (_ < 5) FreqMultiplier = 0.8;
        let Height =Math.pow(Freq,1.4)*MaxHeight* FreqMultiplier;
        if (Height<2) Height =2;
        if (Height >Caps[_]) Caps[_] = Height; else Caps[_] -= 3;
        if(Caps[_]<2) Caps[_] = 2;


        if(Mode === "Bars"){
            let x = (sliceWidth*_) + (sliceWidth *0.2) + glitchOffset;
            DaBrush.fillStyle = colorGradient;
            DaBrush.fillRect(x,barbase,barWidth,-Height);
            DaBrush.fillRect(x,barbase,barWidth,Height);
            DaBrush.fillStyle = Theme.topEdge;
            DaBrush.fillRect(x,barbase-Caps[_] -6, barWidth,3);
            DaBrush.fillStyle = Theme.bottomEdge;
            DaBrush.fillRect(x,barbase+Caps[_] +3, barWidth,3);
        }

        else{
            let angle= _* ((Math.PI *2)/notes);
            DaBrush.save();
            let hexGradient = DaBrush.createLinearGradient(0,hexRadius,0,hexRadius+ MaxHeight);
            hexGradient.addColorStop(0,Theme.center);
            hexGradient.addColorStop(0.3matchMedia,Theme.topMid);
            hexGradient.addColorStop(1,Theme.topEdge);
            DaBrush.fillStyle = hexGradient;
            DaBrush.fillRect(-barWidth/2,hexRadius,barWidth,height);
            DaBrush.fillStyle = Theme.topEdge;
            DaBrush.fillRect(-barWidth /2, hexRadius +caps[_]+5,barWidth,4);
            DaBrush.restore();

        }
        
    }
    
}

function MovingOnes(){
    Bar();
    requestAnimationFrame(MovingOnes);
    
}

