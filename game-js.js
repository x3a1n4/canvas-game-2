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
var blockColor = "#00bfff";
var checkpointColor = "#66ff66";
var shadeColor = "#cccccc";
var coinColor = "#FFFF00";
var onLoad = true;
var blockLineWidth = 3;

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



var Player={
    x:0,
    y:0,
    speed: 0.05 * blockSize,
    size: 0.7 * blockSize,
    offset: 1,
    ajustedSize: 0,
    spawnX: 0,
    spawnY: 0,
    dead: true,
    color:"#FF0000",
    lineWidth: 3,
    collectedCoins:[],
    drawPlayer:function(){
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.offset, this.y - this.offset, this.ajustedSize, this.ajustedSize);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(this.x - this.offset, this.y - this.offset, this.ajustedSize, this.ajustedSize);
    },
    movePlayer:function(){
        //move player
        this.x += (keys[3] - keys[1]) * this.speed;
        this.y += (keys[2] - keys[0]) * this.speed;

        var corners = [
            [this.y, this.x],
            [this.y, this.x + this.size],
            [this.y + this.size, this.x + this.size],
            [this.y + this.size, this.x]
        ]

        //turns a list to blockspace
        function toBlockSpace(list){
            var output=[];
            list.forEach(function(corner) {
                var blockCorner = [];
                corner.forEach(function(value) {
                    blockCorner.push(Math.floor(value/blockSize));
                });
                output.push(blockCorner);
            });
            return(output);
        }

        function isInWalls(list){
            var l=levels[level];
            var output=[];
            list.forEach(function(point){
                output.push(levels[level][point[0]][point[1]] == 1);
            });
            return output;
        }

        //now for spots along the edge a pixel away from each corner
        var tangentPoints=[
            [corners[0][0] + this.speed, corners[0][1]], //top left
            [corners[0][0], corners[0][1] + this.speed],

            [corners[1][0] + this.speed, corners[1][1]], //top right
            [corners[1][0], corners[1][1] - this.speed],

            [corners[2][0] - this.speed, corners[2][1]], //bottom right
            [corners[2][0], corners[2][1] - this.speed],

            [corners[3][0] - this.speed, corners[3][1]], //bottom left
            [corners[3][0], corners[3][1] + this.speed]
        ]

        var tangentPointsInWalls=isInWalls(toBlockSpace(tangentPoints));
        var cornersInWalls=isInWalls(toBlockSpace(corners));

        //weather each side is in a wall, in order top, right, bottom, left
        var sidesInWalls=[
            tangentPointsInWalls[1] || tangentPointsInWalls[3],
            tangentPointsInWalls[2] || tangentPointsInWalls[4],
            tangentPointsInWalls[5] || tangentPointsInWalls[7],
            tangentPointsInWalls[0] || tangentPointsInWalls[6]
        ]

        for(var i=0; i<sidesInWalls.length; i++){
            if(sidesInWalls[i]){
                switch(i){
                    case 0:
                        this.y += this.speed;
                        break;
                    case 1:
                        this.x -= this.speed;
                        break;
                    case 2:
                        this.y -= this.speed;
                        break;
                    case 3:
                        this.x += this.speed;
                        break;
                    default:
                        break;
                }
            }
        }


        //now check if it's touching a coin
        toBlockSpace(corners).forEach(function(corner){
            if(levels[level][corner[0]][corner[1]] == 3){
                levels[level][corner[0]][corner[1]] = 33;
            }
        });
        
    }
}


function draw(){
    
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    ctx.fillStyle = blockColor;
    ctx.fillRect(0, 0, c.width, c.height);

    //change the player ajusted size for spawning in checkpoints
    Player.ajustedSize = Player.size + Player.offset;

    for(var y=0; y<levels[level].length; y++){
        for(var x=0; x<levels[level][y].length; x++){
            var currentBlock = levels[level][y][x];
            switch(currentBlock){
                

                case 1:
                    ctx.fillStyle = blockColor;
                    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);

                    if(onLoad){
                        walls.push([x, y].toString());
                    }

                    if(!onLoad){
                        ctx.fillStyle = "#000000";

                        //draw the inside walls
                        if(walls.indexOf([x, y - 1].toString()) == -1){
                            ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockLineWidth);
                            //top line
                        }

                        if(walls.indexOf([x + 1, y].toString()) == -1){
                            ctx.fillRect((x+1)*blockSize - blockLineWidth, y*blockSize, blockLineWidth, blockSize);
                            //right line
                        }

                        if(walls.indexOf([x, y + 1].toString()) == -1){
                            ctx.fillRect(x*blockSize, (y+1)*blockSize - blockLineWidth, blockSize, blockLineWidth);
                            //bottom line
                        }

                        if(walls.indexOf([x - 1, y].toString()) == -1){
                            ctx.fillRect(x*blockSize, y*blockSize, blockLineWidth, blockSize);
                            //left line
                        }


                        //now draw the inside corners
                        if(walls.indexOf([x - 1, y - 1].toString()) == -1){
                            ctx.fillRect(x*blockSize, y*blockSize, blockLineWidth, blockLineWidth);
                            //top left corner
                        }

                        if(walls.indexOf([x + 1, y - 1].toString()) == -1){
                            ctx.fillRect((x + 1)*blockSize - blockLineWidth, y*blockSize, blockLineWidth, blockLineWidth);
                            //top right corner
                        }

                        if(walls.indexOf([x + 1, y + 1].toString()) == -1){
                            ctx.fillRect((x + 1)*blockSize - blockLineWidth, (y + 1)*blockSize - blockLineWidth, blockLineWidth, blockLineWidth);
                            //bottom right corner
                        }

                        if(walls.indexOf([x - 1, y + 1].toString()) == -1){
                            ctx.fillRect(x*blockSize, (y + 1)*blockSize  - blockLineWidth, blockLineWidth, blockLineWidth);
                            //bottom left corner
                        }
                    }

                    break;
                case 0:
                case 3:
                case 33:
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
                        var offset = (blockSize - Player.ajustedSize) / 2
                        Player.spawnX = x*blockSize + offset;
                        Player.spawnY = y*blockSize + offset;
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
    

    onLoad=false;
}



window.setInterval(draw, 10);