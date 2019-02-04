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

                    //todo: change this to be called when level changes
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
                    if((x % 2 == 0 && y % 2 != 0) || (x % 2 != 0 && y % 2 == 0)){
                        ctx.fillStyle = "#FFFFFF";
                    }else{
                        ctx.fillStyle = shadeColor;
                    }
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

    coins[level].forEach(function (coin){
        ctx.fillStyle = coinColor;
        ctx.beginPath();
        ctx.arc(coin[1], coin[0], coinSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    });

    enemies[level].forEach(function (enemy){
        enemy.moveEnemy();
        enemy.drawEnemy();
    });

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