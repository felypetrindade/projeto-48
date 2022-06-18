var bg,bgImg;
var heart1Img, heart2Img, heart3Img;
var player, shooterImg, shooter_shooting;
var zombieGroup;
var zombie, zombieImg;
var life = 3;
var score = 0;
var bullets = 70;
var gameState = "play";
var lose, winning, explosionSound;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");
  zombieImg = loadImage("assets/zombie.png");

  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  bgImg = loadImage("assets/bg.jpeg");

  lose = loadSound("assets/lose.mp3");
  winning = loadSound("assets/win.mp3");
  explosionSound = loadSound("assets/explosion.mp3");

}

function setup() {
  
  createCanvas(windowWidth,windowHeight);

  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20);
  bg.addImage(bgImg);
  bg.scale = 1.1;

  player = createSprite(displayWidth-1150, displayHeight-230, 50, 50);
  player.addImage(shooterImg);
  player.scale = 0.3;
  player.setCollider("rectangle",0,0,300,300);

  heart1 = createSprite(displayWidth-150,40,20,20);
  heart1.visible = false;
  heart1.addImage("heart1",heart1Img);
  heart1.scale = 0.4;

  heart2 = createSprite(displayWidth-100,40,20,20);
  heart2.visible = false;
  heart2.addImage("heart2",heart2Img);
  heart2.scale = 0.4;

  heart3 = createSprite(displayWidth-150,40,20,20);
  heart3.addImage("heart3",heart3Img);
  heart3.scale = 0.4;
   
  bulletGroup = new Group();
  zombieGroup = new Group();
}

function draw() {
  background("white"); 

  if(gameState === "won"){


    if(life===3){
      heart3.visible = true;
      heart1.visible = false;
      heart2.visible = false;
    }
    if(life===2){
      heart2.visible = true;
      heart1.visible = false;
      heart3.visible = false;
    }
    if(life===1){
      heart1.visible = true;
      heart3.visible = false;
      heart2.visible = false;
    }
 
    if(life===0){
      gameState = "lost";
    
    }

    if(score==100){
      gameState = "won";
      winning.play();
    }
  }


  spawnZombie();
  
  if(keyDown("UP_ARROW")||touches.length>0){
    player.y = player.y-10;
  }
  if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+10;
  }

  if(keyWentDown("space")){  
    bullet = createSprite(displayWidth-1150,player.y-30,20,10);
    bullet.velocityX = 20;
    
    bulletGroup.add(bullet);
    player.depth = bullet.depth;
    player.depth = player.depth+2;
    player.addImage(shooter_shooting);
    bullets = bullets-1;
    explosionSound.play();
  }
  
  else if(keyWentUp("space")){
    player.addImage(shooterImg);
  }

  if(bullets==0){
    gameState = "bullet";
    
  }

  if(zombieGroup.isTouching(bulletGroup)){
    for(var i=0;i<zombieGroup.length;i++){     
    
      if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy();
        bulletGroup.destroyEach();
        explosionSound.play();

        score = score+2;
      } 

    }
  }

  if(zombieGroup.isTouching(player)){
    lose.play();
    for(var i=0;i<zombieGroup.length;i++){     
      if(zombieGroup[i].isTouching(player)){
        zombieGroup[i].destroy();      
        life=life-1;
      } 
    }
  }
  
  drawSprites();
  textSize(20);
  fill("white");
  text("Balas = " + bullets,displayWidth-200,displayHeight/2-250);
  text("Pontuação = " + score,displayWidth-200,displayHeight/2-220);
  text("Vidas = " + life,displayWidth-200,displayHeight/2-280);

  if(gameState == "lost"){
  
    textSize(100);
    fill("red");
    text("Você Perdeu ",400,400);
    zombieGroup.destroyEach();
    player.destroy();

  }


  else if(gameState == "won"){
 
    textSize(100);
    fill("green");
    text("Você Venceu",400,400);
    zombieGroup.destroyEach();
    player.destroy();

  }


  else if(gameState == "bullet"){
 
    textSize(50);
    fill("yellow");
    text("Você não tem mais balas!",470,410);
    zombieGroup.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();

  }


}

function spawnZombie(){
  if(frameCount%50===0){
    zombie = createSprite(random(500,1100),random(100,500),40,40);
    zombie.addImage(zombieImg);
    zombie.scale = 0.15;
    zombie.velocityX = -3;
    zombie.setCollider("rectangle",0,0,400,400);
    zombie.lifetime = 400;
    zombieGroup.add(zombie);
  }

}