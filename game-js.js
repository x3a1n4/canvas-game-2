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
var level = 0;
var blockSize = 40;
var blockColor = "#00bfff";
var checkpointColor = "#66ff66";
var shadeColor = "#cccccc";
var coinColor = "#FFFF00";
//all walls
var walls = [];

//all checkpoints
var checkpoints = [];

//all checkpoint spawns
var spawns = [];

var Player={
    x:0,
    y:0,
    speed: 0.15 * blockSize,
    spawnX: 0,
    spawnY: 0,
    dead: true,
    color:"#FF0000",
    lineWidth:20,
    drawPlayer:function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, blockSize, blockSize);
        ctx.strokeWidth = this.lineWidth;
        ctx.strokeRect(this.x, this.y, blockSize, blockSize);
    },
    movePlayer:function(){
        this.x += (keys[3] - keys[1]) * this.speed;
        this.y += (keys[2] - keys[0]) * this.speed;

        var blockX = x/blockSize;
        var blockY = y/blockSize;
        //make collition
        if(Math.round(x/blockSize))
    }
}


function draw(){
    
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    ctx.fillStyle = blockColor;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.stroke();


    for(var y=0; y<levels[level].length; y++){
        for(var x=0; x<levels[level][y].length; x++){
            var currentBlock = levels[level][y][x];
            switch(currentBlock){
                case 0:
                case 3:
                    if((x % 2 == 0 && y % 2 != 0) || (x % 2 != 0 && y % 2 == 0)){
                        ctx.fillStyle = "#FFFFFF";
                    }else{
                        ctx.fillStyle = shadeColor;
                    }
                    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);

                    if(currentBlock == 3){
                        ctx.fillStyle = coinColor;
                        ctx.beginPath();
                        ctx.arc(x*blockSize + blockSize/2, y*blockSize + blockSize/2, blockSize/2.5, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                    break;

                case 1:
                    ctx.fillStyle = blockColor;
                    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);

                    walls.push([x,y]);
                    break;

                case 2:
                case 4:
                case 5:
                case 6:
                    ctx.fillStyle = checkpointColor;
                    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);

                    switch(currentBlock){
                        case 4:
                        case 5:
                        case 6:
                    }
                    if(currentBlock == 5){
                        Player.spawnX = x*blockSize;
                        Player.spawnY = y*blockSize;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    if(Player.dead){
        Player.x = Player.spawnX;
        Player.y = Player.spawnY;
        Player.dead=false;
    }
    

    Player.movePlayer();
    Player.drawPlayer();
}



window.setInterval(draw, 10);