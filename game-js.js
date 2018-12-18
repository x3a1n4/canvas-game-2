var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var score=0;
var time=0;
var timePassed=0;
var loops=1;
var startTime = new Date().getTime();
var newEnemyTime = 50;
var difficulty = 0;
var keys=[0,0,0,0];
var highscore = 0;
var highTime = 0;
var speedTime = 0;

var enemies=[];

document.onkeydown = keyDown;
document.onkeyup = keyUp;

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
//stolen code hehehe
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var player = {
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    startx: window.innerWidth/2,
    starty: window.innerHeight/2,
    colour: "#FF0000",
    lineColour: "#000000",
    lineWidth: 2,
    size: 20,
    speed: 2,
    drawPlayer: function(){
        ctx.fillStyle=this.colour;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.lineColour;
        ctx.strokeRect(
            this.x - this.size/2 + this.lineWidth/2, 
            this.y - this.size/2 + this.lineWidth/2, 
            this.size - this.lineWidth/2, 
            this.size - this.lineWidth/2
        );
    }
};

var coin = {
    x: window.innerWidth/2 + 100,
    y: window.innerHeight/2,
    startx: window.innerWidth/2 + 100,
    starty: window.innerHeight/2,
    colour: "#FFFF00",
    lineColour: "#000000",
    lineWidth: 2,
    radius: 20,
    drawcoin: function(){
        
        ctx.fillStyle=this.colour;
        //draw circle
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fill();
        
        //draw outline
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.lineColour;
        
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius-this.lineWidth/2,0,2*Math.PI);
        ctx.stroke();
    },
    randomisePosition(){
        this.x = getRandomArbitrary(200, c.width-200);
        this.y = getRandomArbitrary(200, c.height-200);
    }
}


function Enemy() {
    this.x = 0;
    this.y = 0;
    this.speed = 2;
    this.colour = "#0000FF";
    this.lineColour = "#000000";
    this.lineWidth = 2;
    this.radius = 10;
    //for homing enemies
    this.directionx = 0;
    this.directiony = 0;
    this.time = 0;

    this.drawEnemy= function(){
        
        ctx.fillStyle=this.colour;
        //draw circle
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fill();
        
        //draw outline
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.lineColour;
        
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius-this.lineWidth/2,0,2*Math.PI);
        ctx.stroke();
    };
}

var scrollTotal = 0;

var rotate2d = function(x, y , centerx, centery, ang)
{
    ang = ang * (Math.PI/180);
    x-=centerx;
    y-=centery;
    return(
        [x * Math.cos(ang) - y * Math.sin(ang),
        x * Math.sin(ang) + y * Math.cos(ang)]
    );
};

function line(x1,y1,x2,y2){
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function distanceBetween(x1,y1,x2,y2){
    return(Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2)));
}


function draw(){
    
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    speedTime++;
    timePassed = new Date().getTime()-startTime;

    player.x += (keys[3]-keys[1]) * player.speed;
    player.y += (keys[2]-keys[0]) * player.speed;

    //set boundaries
    if(player.x > c.width){
        player.x=c.width;
    }
    if(player.x < 0){
        player.x=0;
    }
    if(player.y > c.height){
        player.y=c.height;
    }
    if(player.y < 0){
        player.y=0;
    }

    player.drawPlayer();
    coin.drawcoin();


    if(distanceBetween(player.x, player.y, coin.x, coin.y) < player.size/2 + coin.radius+10){
        coin.randomisePosition();
        score++;
    }
    var closest = 1000;

    
    for(var i = 0; i<enemies.length; i++){

        //move enemies
        switch(enemies[i].direction){
            case 0:
                enemies[i].x += enemies[i].speed;
                break;
            case 1:
                enemies[i].x -= enemies[i].speed;
                break;
            case 2:
                enemies[i].y += enemies[i].speed;
                break;
            case 3:
                enemies[i].y -= enemies[i].speed;
                break;
            case 4:
                if(enemies[i].time > 1000){
                    enemies[i].x -= enemies[i].directionx;
                    enemies[i].y -= enemies[i].directiony;
                }else{
                    var xToPlayer = enemies[i].x - player.x;
                    var yToPlayer = enemies[i].y - player.y;
                    var divisor = 1 / distanceBetween(enemies[i].x, enemies[i].y, player.x, player.y);

                    enemies[i].directionx = xToPlayer * divisor;
                    enemies[i].directiony = yToPlayer * divisor;
                    enemies[i].x -= enemies[i].directionx;
                    enemies[i].y -= enemies[i].directiony;

                    enemies[i].time ++;
                }
                
                
                break;
            default:
                break;
        }

        enemies[i].drawEnemy();
        
        if(distanceBetween(player.x, player.y, enemies[i].x, enemies[i].y)<closest){
            closest=distanceBetween(player.x, player.y, enemies[i].x, enemies[i].y);
        }
        if(distanceBetween(player.x, player.y, enemies[i].x, enemies[i].y) < player.size/2 + enemies[i].radius){
            if(timePassed > highTime){
                highTime = timePassed;
            }
            if(score > highscore){
                highscore = score;
            }
            startTime = new Date().getTime();
            player.x = player.startx;
            player.y = player.starty;
            coin.x = coin.startx;
            coin.y = coin.starty;
            enemies = [];
            score = 0;
            difficulty = 0;
            speedTime = 0;
            newEnemyTime=50;
            keys=[0,0,0,0];
            break;
        }

        //checks if enemies are beyond the boundries
        if(enemies[i].x>c.width+100||enemies[i].x<-100||enemies[i].y>c.height+100||enemies[i.y<-100]){
            enemies.splice(i, 1);
        }
    }

    //create enemies
    if(loops % newEnemyTime == 0){
        var newEnemy = new Enemy();
        var newDirection = getRandomInt(0, difficulty);
        switch(newDirection){
            case 0:
                newEnemy.y = getRandomArbitrary(0, c.height);
                newEnemy.x = 0;
                break;
            case 1:
                newEnemy.y = getRandomArbitrary(0, c.height);
                newEnemy.x = c.width;
                break;
            case 2:
                newEnemy.x = getRandomArbitrary(0, c.width);
                newEnemy.y = 0;
                break;
            case 3:
                newEnemy.x = getRandomArbitrary(0, c.width);
                newEnemy.y = c.height;
                break;
            case 4:
                switch(getRandomInt(0,3)){
                    case 0:
                        newEnemy.x = 0;
                        newEnemy.y = 0;
                        break;
                    case 1:
                        newEnemy.x = c.width;
                        newEnemy.y = 0;
                        break;
                    case 2:
                        newEnemy.x = 0;
                        newEnemy.y = c.height;
                        break;
                    case 3:
                        newEnemy.x = c.width;
                        newEnemy.y = c.height;
                        break;
                }
                newEnemy.colour="#a341f4";
            default:
                break;
        }
        newEnemy.direction = newDirection;
        newEnemy.speed = getRandomArbitrary(speedTime/5000+1, speedTime/5000 + 1.5);
        enemies.push(newEnemy);
    }

    if(loops % 600 == 0){
        if(newEnemyTime>5){
            newEnemyTime--;
        }
    }

    if(loops % 4000 == 0){
        if(difficulty<4){
            difficulty++;
            speedTime = 0;
        }
    }

    ctx.font = "bold 50px Courier";
    ctx.fillStyle = "#000000";
    ctx.fillText(score, 50, 100);
    ctx.fillText(((timePassed)/1000).toFixed(3), 50, c.height-50);
    ctx.fillText(highscore, c.width/2, 100);
    ctx.fillText(((highTime)/1000).toFixed(3), c.width/2, c.height-50);

    loops++;
}



window.setInterval(draw, 10);