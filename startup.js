var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

document.onkeydown = keyDown;
document.onkeyup = keyUp;

var keys = [0, 0, 0, 0];

function keyDown(e){
    switch(e.keyCode) {
        case 38: //up
        case 87:
            keys[0]=1;
            break;
        case 37: //left
        case 65:
            keys[1]=1;
            break;
        case 40: //down
        case 83:
            keys[2]=1;
            break;
        case 39: //right
        case 68:
            keys[3]=1;
            break;
        default:
            break;
    }
}

function keyUp(e){
    switch(e.keyCode) {
        case 87:
        case 38:
            keys[0]=0;
            break;
        case 65:
        case 37:
            keys[1]=0;
            break;
        case 83:
        case 40:
            keys[2]=0;
            break;
        case 68:
        case 39:
            keys[3]=0;
            break;
        default:
            break;
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var rotate2d = function(x, y , centerx, centery, ang)
{
    ang = ang * (Math.PI/180);
    x-=centerx;
    y-=centery;
    return(
        [x * Math.cos(ang) - y * Math.sin(ang),
        x * Math.sin(ang) + y * Math.cos(ang)]
    )
}

function line(x1,y1,x2,y2){
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function distanceBetween(x1,y1,x2,y2){
    return(Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2)));
}



//Real code starts here now

//Collision doesn't work because the move speed is more than 2
var level = 0;
var blockSize = 50;
var coinSize = blockSize / 4;
var blockColor = "#00bfff";
var checkpointColor = "#66ff66";
var shadeColor = "#cccccc";
var coinColor = "#FFFF00";
var onLoad = true;
var blockLineWidth = 3;
var enemyColor = "#0000FF";

var walls = [];

//add walls to all the levels
for(var i=0; i<levels.length; i++){
    //the top and bottom of each level should all be walls
    var startOnes=[];
    var endOnes=[];

    var firstLine = levels[i][0];
    var lastLine = levels[i][levels[i].length-1];

    var startLength = firstLine.length;
    var endLength = lastLine.length;


    for(var j=0; j<startLength; j++){
        startOnes.push(1);
    }

    for(var j=0; j<endLength; j++){
        endOnes.push(1);
    }

        //add them to the current level
    levels[i].unshift(startOnes);
    levels[i].push(endOnes);

        //now do the side walls
    for(var j=0; j<levels[i].length; j++){
        levels[i][j].unshift(1);
        levels[i][j].push(1);
    }
        
}

//change coins to actual space
for(var i = 0; i<coins.length; i++){
    for(var j = 0; j<coins[i].length; j++){
        var coin = coins[i][j];
        coins[i][j] = [coin[0] * blockSize + blockSize/2, coin[1] * blockSize + blockSize/2];
    }
}