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

//add walls to all the levels
for(var i=0; i<levels.length; i++){
    //the top and bottom of each level should all be walls
    var startOnes=[];
    var endOnes=[];

    var firstLine = levels[i][0];
    var lastLine = levels[i][levels[i].length-1];

    var startLength = firstLine.length;
    var endLength = lastLine.length;

    console.log(i);

    for(var j=0; j<startLength; j++){
        console.log("in here");
        startOnes.push(1);
    }

    for(var j=0; j<endLength; j++){
        console.log("in here too");
        endOnes.push(1);
    }

        //add them to the current level
    levels[i].unshift(startOnes);
    levels[i].push(endOnes);

        //now do the side walls
    for(var j=0; j<levels[i].length; j++){
        console.log("in here more");
        levels[i][j].unshift(1);
        levels[i][j].push(1);
    }
        
}



var Player={
    x:0,
    y:0,
    speed: 0.05 * blockSize,
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
        //move player
        this.x += (keys[3] - keys[1]) * this.speed;
        this.y += (keys[2] - keys[0]) * this.speed;

        var floorBlockX = Math.floor(this.x/blockSize);
        var floorBlockY = Math.floor(this.y/blockSize);
        var ceilBlockX = Math.ceil(this.x/blockSize);
        var ceilBlockY = Math.ceil(this.y/blockSize);

        //top left, top right, bottom right, bottom left
        var corners = [
            levels[level][floorBlockY][floorBlockX] == 1,
            levels[level][floorBlockY][ceilBlockX] == 1,
            levels[level][ceilBlockY][ceilBlockX] == 1,
            levels[level][ceilBlockY][floorBlockX] == 1
        ];

        //weather the top, right, bottom or left sides of player are in a wall
        var sides = [
            corners[0] || corners[1],
            corners[1] || corners[2],
            corners[2] || corners[3],
            corners[3] || corners[0]
        ];
        
        if(sides[0]){
            this.y += this.speed;
        }
        if(sides[1]){
            this.x -= this.speed;
        }
        if(sides[2]){
            this.y -= this.speed;
        }
        if(sides[3]){
            this.x += this.speed;
        }

        console.log(corners);
        //console.log(levels[level][blockY][blockX]);
        //make collision
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