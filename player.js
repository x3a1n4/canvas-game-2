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

        //collect coins
        for(var i = 0; i<coins[level].length; i++){
            var coin = coins[level][i];
            if(distanceBetween(this.x + this.size/2, this.y + this.size/2, coin[1], coin[0]) < this.size/2 + coinSize + blockSize / 10){
                this.collectedCoins.push(coins[level].splice(i, 1));
            }
        }
    }
}