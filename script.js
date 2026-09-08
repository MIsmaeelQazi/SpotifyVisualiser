const DaCanvas = document.getElementById("Bars");
const DaBrush = DaCanvas.getContext("2d");

function Size(){
    DaCanvas.width = window.innnerWidth;
    DaCanvas.height = window.innnerHeight;
}

Size();
window.addEventListener("resize",Size);

function Bar(){

    DaBrush.clearRect(0,0,DaCanvas.width,DaCanvas.height);
    DaBrush.fillStyle = "white";
    DaBrush.fillRect(DaCanvas.width/2 -25,DaCanvas.height / 2, 50, 100);
}

Bar()