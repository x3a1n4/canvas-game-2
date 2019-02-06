function Enemy(movement){
    //movement starts with a position
    //every other element is a dictionary of form {type, x, y, speed, rotation}
    //if type is 0, then move in a straight line to (x, y) at speed speed
    //if type is 1, then rotate around point (x, y) at speed speed, and rotate rotation degrees
    for(i=0; i<movement.length; i++){
        movement[i].x = movement[i].x * blockSize + blockSize/2;
        movement[i].y = movement[i].y * blockSize + blockSize/2;
        movement[i].speed = movement[i].speed * Player.speed;
    }
    this.movement = movement;
    this.color = enemyColor;
    this.size = coinSize;
    this.id = 0;
    this.x = this.movement[this.id].x;
    this.y = this.movement[this.id].y;
    this.speed = this.movement[this.id].speed;
    this.rotation = this.movement[this.id].rot;

    this.change = [0, 0];
    this.drawEnemy = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    this.moveEnemy = function(){
        var nextId = (this.id + 1) % this.movement.length;
        var nextElement = this.movement[nextId];

        if(this.rotation == undefined){
            //move straight towards the next movement position, but don't overshoot
            if(distanceBetween(this.x, this.y, nextElement.x, nextElement.y) <= this.speed){
                this.x = nextElement.x;
                this.y = nextElement.y;
                this.speed = this.movement[this.id].speed;
                
            }else{
                //move to the rotate2d of this.speed, where the angle is the angle to the target
                var distanceX = nextElement.x - this.x;
                var distanceY = nextElement.y - this.y;

                var hypotenuse = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                this.speed = this.movement[this.id].speed;
                var divisor = hypotenuse/this.speed;

                this.change = [distanceX/divisor, distanceY/divisor];
                
                this.x += this.change[0];
                this.y += this.change[1];

                
            }
        }else{

        }

        if(this.x == nextElement.x && this.y == nextElement.y){
            if(movement.length>20){console.log(this.id);}
            
            this.id = nextId;
            this.speed = this.movement[this.id].speed;
            
        }
    }
}