function Enemy(movement){
    //movement starts with a position
    //every other element is a dictionary of form {type, x, y, speed, rotation}
    //if type is 0, then move in a straight line to (x, y) at speed speed
    //if type is 1, then rotate around point (x, y) at speed speed, and rotate rotation degrees
    this.movement = movement;
    this.color = enemyColor;
    this.element = 0;
    this.x = movement[this.element].x;
    this.y = movement[this.element].y;
    this.speed = movement[this.element].speed * Player.speed;
    this.type = movement[this.element].type;
    this.move = function(){
    };
}