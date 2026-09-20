// Declaration 

const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
const DaAudio = new (window.AudioContext || window.webkitAudioContext)();
const analysier = DaAudio.createAnalyser();
analysier.fftSize = 512;
analysier.smoothingTimeConstant = 0.85;
const AudioData = new Uint8Array(analysier.frequencyBinCount)
const colors = [
    { name: "VI / JINX", bg: "radial-gradient(circle at center, #1a0005 0%, #000000 100%)", topEdge: "#ffaa00", topMid: "#cc0000", center: "#050005", bottomMid: "#0077ff", bottomEdge: "#ff00aa", shadow: "#0077ff" },
    { name: "JAYCE / VIKTOR", bg: "radial-gradient(circle at center, #000a1a 0%, #000000 100%)", topEdge: "#ffffff", topMid: "#00ccff", center: "#00050a", bottomMid: "#7a00cc", bottomEdge: "#00ff66", shadow: "#7a00cc" },
    { name: "EKKO / JINX", bg: "radial-gradient(circle at center, #001a0a 0%, #000000 100%)", topEdge: "#ffcc00", topMid: "#00cc44", center: "#001a0a", bottomMid: "#0077ff", bottomEdge: "#ff00aa", shadow: "#00cc44" },
    { name: "VANDER / SILCO", bg: "radial-gradient(circle at center, #1a0500 0%, #000000 100%)", topEdge: "#ff5500", topMid: "#8b0000", center: "#1a0500", bottomMid: "#99004d", bottomEdge: "#ff3300", shadow: "#99004d" },
    { name: "CAITLYN / VI", bg: "radial-gradient(circle at center, #05051a 0%, #000000 100%)", topEdge: "#00ffff", topMid: "#0044cc", center: "#05051a", bottomMid: "#cc0000", bottomEdge: "#ffaa00", shadow: "#0044cc" },
    { name: "SEVIKA / VI", bg: "radial-gradient(circle at center, #0f001a 0%, #000000 100%)", topEdge: "#00ff44", topMid: "#8800cc", center: "#0f001a", bottomMid: "#cc0000", bottomEdge: "#ffaa00", shadow: "#8800cc" },
    { name: "HEIMERDINGER / EKKO", bg: "radial-gradient(circle at center, #1a1500 0%, #000000 100%)", topEdge: "#ffffff", topMid: "#cc9900", center: "#1a1500", bottomMid: "#00cc44", bottomEdge: "#ffcc00", shadow: "#cc9900" },
    { name: "SINGED / VIKTOR", bg: "radial-gradient(circle at center, #0a1a00 0%, #000000 100%)", topEdge: "#ccff00", topMid: "#339900", center: "#0a1a00", bottomMid: "#7a00cc", bottomEdge: "#00ff66", shadow: "#7a00cc" },
    { name: "VANDER / VI", bg: "radial-gradient(circle at center, #1a0a00 0%, #000000 100%)", topEdge: "#ff5500", topMid: "#8b0000", center: "#1a0a05", bottomMid: "#cc0000", bottomEdge: "#ffaa00", shadow: "#8b0000" },
    { name: "SILCO / JINX", bg: "radial-gradient(circle at center, #0f001a 0%, #000000 100%)", topEdge: "#ff3300", topMid: "#99004d", center: "#0f001a", bottomMid: "#0077ff", bottomEdge: "#ff00aa", shadow: "#99004d" },
    { name: "MEL / AMBESSA", bg: "radial-gradient(circle at center, #1a1400 0%, #000000 100%)", topEdge: "#ffe680", topMid: "#cca300", center: "#1a1400", bottomMid: "#990000", bottomEdge: "#ff4400", shadow: "#cca300" },
    { name: "CAITLYN / CASSANDRA", bg: "radial-gradient(circle at center, #000b1a 0%, #000000 100%)", topEdge: "#00ffff", topMid: "#0044cc", center: "#000b1a", bottomMid: "#336699", bottomEdge: "#ffcc66", shadow: "#0044cc" },
    { name: "ISHA / JINX", bg: "radial-gradient(circle at center, #1a1500 0%, #000000 100%)", topEdge: "#ccffff", topMid: "#ccaa00", center: "#1a1500", bottomMid: "#0077ff", bottomEdge: "#ff00aa", shadow: "#ccaa00" },
    { name: "JINX / CAITLYN", bg: "radial-gradient(circle at center, #05001a 0%, #000000 100%)", topEdge: "#ff00aa", topMid: "#0077ff", center: "#05001a", bottomMid: "#0044cc", bottomEdge: "#00ffff", shadow: "#0077ff" },
    { name: "JAYCE / VI", bg: "radial-gradient(circle at center, #000a1a 0%, #000000 100%)", topEdge: "#ffffff", topMid: "#00ccff", center: "#000a1a", bottomMid: "#cc0000", bottomEdge: "#ffaa00", shadow: "#00ccff" }
];

let notes;
let CenterX,CenterY;
let MaxHeight;
let DaTheme = 0;
const NoOfStars = 300;
let Caps = new Array(256).fill(0)
let stars
// this function is the background mainly 


function Starry(){
    stars = [];
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



// in case of resizing 
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

// to switch themes and modes  
let Mode = "Straight"
function UpdateUI(){
    let Theme = colors[DaTheme]
    document.body.style.background = Theme.bg;
    const StartButton = document.getElementById("Start");

    let buttonText = Theme.name;
    if (!StartButton.classList.contains("playing-mode")){
        buttonText = "START: " + buttonText;
    }

    StartButton.innerHTML = `<span style="
        background: linear-gradient(to right, ${Theme.topEdge}, ${Theme.bottomEdge});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    ">${buttonText}</span>`;

    StartButton.style.background = "rgba(5, 5, 10, 0.6)"; 
    StartButton.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    StartButton.style.textShadow = "none";
    StartButton.style.transition = "box-shadow 0.5s ease";
    
    StartButton.style.boxShadow = `
        -30px 0 60px ${Theme.topEdge}60, 
         30px 0 60px ${Theme.bottomEdge}60, 
        inset -20px 0 25px ${Theme.bottomEdge}30, 
        inset 20px 0 25px ${Theme.topEdge}30
    `;

}
UpdateUI();
    


// just basic controls 
window.addEventListener("keydown",(event)=> {
    
    if (event.key==="ArrowRight") DaTheme += 1;
    if (event.key==="ArrowLeft") DaTheme -= 1;
    if (DaTheme < 0){
        DaTheme = colors.length -1;}
    if (DaTheme >= colors.length){
        DaTheme = 0;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown"){
        Mode = (Mode ==="Straight")? "HexCore":"Straight";
    }
    UpdateUI();
});

// this visualizer uses comp audio using screen share with audio so in this it kills video and uses the audio
async function startVisualizer(){
    try {
        if (DaAudio.state === "suspended"){
            await DaAudio.resume();
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
        stream.getVideoTracks()[0].stop();
        const source = DaAudio.createMediaStreamSource(stream);
        source.connect(analysier);
        

        document.getElementById("Start").classList.add("playing-mode");
        UpdateUI();
        RunThisShi();
    }
    catch(err){
        console.error("Audio capture failed:", err);
        document.getElementById("Start").innerText ="CAPTURE DENIED - TRY AGAIN";
    }
}

// this is the main function in this i draw everything using canvas  
function DrawingEverything(){
    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    analysier.getByteFrequencyData(AudioData);
    let barbase = DaCanvas.height/2;
    let Theme = colors[DaTheme];

    let Bass = (AudioData[0]+AudioData[1]+AudioData[2]+AudioData[3]+AudioData[4])/5/255;
    
    
    DaBrush.fillStyle = Theme.shadow;
    stars.forEach(p =>{
        p.x += p.vx * (1 + Bass*10);
        p.y += p.vy * (1 + Bass*10);

        if (p.x < 0) p.x = DaCanvas.width;
        if (p.x > DaCanvas.width) p.x = 0;
        if (p.y < 0) p.y = DaCanvas.height;
        if (p.y > DaCanvas.height) p.y = 0;

        let isLeft = p.x < CenterX;
        let pEdge = isLeft ? Theme.topEdge : Theme.bottomEdge;
        let pMid = isLeft ? Theme.topMid : Theme.bottomMid;

        DaBrush.beginPath();
        if (Mode === "HexCore"){
            DaBrush.arc(p.x, p.y, p.size*12, 0, Math.PI *2);
            DaBrush.fillStyle = pMid;
            DaBrush.globalAlpha = Math.min(0.2, (p.globalAlpha*0.4) + (Bass*0.2) + (breath*0.2));
            DaBrush.shadowBlur = 15;
            DaBrush.shadowColor = pEdge;
            DaBrush.fill();
        } else {
            DaBrush.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            DaBrush.fillStyle = pEdge;
            DaBrush.globalAlpha = Math.min(1, p.globalAlpha + (Bass*0.8) + breath);
            DaBrush.shadowBlur = 0;
            DaBrush.fill();
        }
    });
    DaBrush.globalAlpha = 1;
    DaBrush.shadowBlur = 0;

    let glitchOffset = 0;
    if(Bass > 0.92){
        glitchOffset = (Math.random()-0.5)*(Bass*30);
    }
    let hexRadius= 130;
    if (Mode === "HexCore"){
        DaBrush.beginPath();
        DaBrush.arc(CenterX +glitchOffset, CenterY +glitchOffset,hexRadius -5,0,Math.PI *2);
        DaBrush.fillStyle = Theme.center;
        DaBrush.shadowBlur = 20 + (Bass *80);
        DaBrush.shadowColor = Theme.topMid;
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

    for(let _=0; _<notes; _++){

        let Freq = AudioData[_]/255;
        let FreqMultiplier = 1 +(_/notes)*0.8;
        if (_ < 5) FreqMultiplier = 0.8;
        let Height = Math.pow(Freq,1.4)*MaxHeight* FreqMultiplier;
        if (Height<2) Height = 0;
        
        if (Height > Caps[_]) Caps[_] = Height; else Caps[_] -= 3;
        if (Caps[_]<2) Caps[_] = 0;

        if (Mode === "Straight"){
            let x = (sliceWidth*_) + (sliceWidth *0.2) + glitchOffset;
            DaBrush.fillStyle = colorGradient;
            DaBrush.fillRect(x,barbase,barWidth,-Height);
            DaBrush.fillRect(x,barbase,barWidth,Height);
            DaBrush.fillStyle = Theme.topEdge;
            DaBrush.fillRect(x,barbase-Caps[_] -6, barWidth,3);
            DaBrush.fillStyle = Theme.bottomEdge;
            DaBrush.fillRect(x,barbase+Caps[_] +3, barWidth,3);
        }
        else {
            let angle = _ * ((Math.PI *2)/notes);
            DaBrush.save();
            DaBrush.translate(CenterX + glitchOffset, CenterY + glitchOffset);
            DaBrush.rotate(angle);
            
            // --- THE SPLIT RIVALRY ENGINE ---
            // If Math.cos is negative, we are drawing on the left side of the circle
            let isLeftBar = Math.cos(angle) < 0; 
            
            // Assign colors based on which side the current bar is on
            let activeEdge = isLeftBar ? Theme.topEdge : Theme.bottomEdge;
            let activeMid = isLeftBar ? Theme.topMid : Theme.bottomMid;

            let hexGradient = DaBrush.createLinearGradient(0, hexRadius, 0, hexRadius + MaxHeight);
            hexGradient.addColorStop(0, Theme.center);
            hexGradient.addColorStop(0.3, activeMid);
            hexGradient.addColorStop(1, activeEdge);
            
            DaBrush.fillStyle = hexGradient;
            DaBrush.fillRect(-barWidth/2, hexRadius, barWidth, Height);
            
            // Color the gravity cap to match its side!
            DaBrush.fillStyle = activeEdge; 
            DaBrush.fillRect(-barWidth/2, hexRadius + Caps[_] + 5, barWidth, 4);
            
            DaBrush.restore();
        }
    }
}
// Animation
function RunThisShi(){
    DrawingEverything();
    requestAnimationFrame(RunThisShi);
    
}
