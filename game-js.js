var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var score=0;
var time=0;
var timePassed=0;
var loops=0;
var startTime = new Date().getTime();

var keys=[0,0,0,0];

var enemies=[];
document.onkeypress = keyPressed;
document.onkeyup = keyUp;
function keyPressed(e){
    switch(e.keyCode) {
        case 119:
            keys[0]=1;
            break;
        case 97:
            keys[1]=1;
            break;
        case 115:
            keys[2]=1;
            break;
        case 100:
            keys[3]=1;
            break;
    }
}
function keyUp(e){
    switch(e.keyCode) {
        case 87:
            keys[0]=0;
            break;
        case 65:
            keys[1]=0;
            break;
        case 83:
            keys[2]=0;
            break;
        case 68:
            keys[3]=0;
            break;
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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
    speed: 5,
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
        this.x = getRandomArbitrary(0, c.width);
        this.y = getRandomArbitrary(0, c.height);
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

    for(var i = 0; i<enemies.length; i++){
        enemies[i].x += enemies[i].speed;
        enemies[i].drawEnemy();
        if(distanceBetween(player.x, player.y, enemies[i].x, enemies[i].y) < player.size/2 + Enemy.radius+10){
            startTime = new Date().getTime();
            player.x = player.startx;
            player.y = player.starty;
            coin.x = coin.startx;
            coin.y = coin.starty;
            enemies = [];
            break;
        }
    }
    
    if(loops % 50 == 0){
        var newEnemy = new Enemy();
        newEnemy.y = getRandomArbitrary(0, c.height);
        newEnemy.speed = getRandomArbitrary(timePassed/100000+1, timePassed/100000 + 1.5);
        enemies.push(newEnemy);
    }

    ctx.font = "50px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(score, 50, 100);
    ctx.fillText((timePassed)/1000, 50, c.height-50);

    loops++;
}



window.setInterval(draw, 10);