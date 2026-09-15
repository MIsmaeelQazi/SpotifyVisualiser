const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");
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

let Frequencies = [];
let height = 100;
function Bar(){
    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    DaBrush.fillStyle = "white";
    for(let _=0;_<notes;_++){
        let x = (DaCanvas.width/notes)*_;
        let Distance = Math.abs(x - CenterX);
        if (Frequencies[_] === undefined){
            Frequencies[_] = Math.random
        }
        let Height = Freq *MaxHeight;
        DaBrush.fillRect(x,CenterY - Height/2,5,Height)
        
    }
}


Bar()
function MovingOnes(){
    Bar();
    requestAnimationFrame(MovingOnes);
    
}

MovingOnes();
