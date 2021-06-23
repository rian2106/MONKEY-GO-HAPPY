//variable for background
var backGroundImage,backGround;  
//variable for monkey
var MonkeyImage,monkey,monkey_running;
//variable for banana
var banana,bananaImage,bananaGroup;
//variable for obstacle
var obstacle,obstacleImage,obstacleGroup;
//variable for ground
var ground, invisibleGround, groundImage;
//variable for scoring
var survivalTime = 0; 
var score = 0;
//variable for game states
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//sounds
var chewSound;
var hitSound;
var jumpSound;
var beepSound

//function to load images
function preload(){
  
  backGroundImage = loadImage("jungle.jpg");
  
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png",   "sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png",
  "sprite_8.png")
  
  bananaImage = loadImage("banana.png");
  
  obstacleImage = loadImage("obstacle.png");
  
  MonkeyImage = loadAnimation("sprite_2.png");
  
  gameOverImg = loadImage("gameover.png");

  restartImg = loadImage("restart.png");
  
  chewSound = loadSound("Chew.wav");
  
  hitSound = loadSound("Hit.wav");
  
  jumpSound = loadSound("Jump.wav");
  
  beepSound = loadSound("Beep.wav");
  
}

//function 
function setup() {
  
  //to create canvas
  createCanvas(400, 400);
  
  //to create background
  backGround = createSprite(10,1,1,1);
  backGround.addImage("backGround",backGroundImage);
  backGround.scale = 2;
  
  //to create monkey
  monkey = createSprite(50,350,20,50);
  monkey.debug = false;
  monkey.setCollider("rectangle",0,0,500,550)
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("Monkey",MonkeyImage);
  monkey.scale = 0.13;
  
  //to create ground
  ground = createSprite(400,385,900,5);
  ground.visible = false;
  ground.x = ground.width /2;
  
  //to create gameover
  gameOver = createSprite(200,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  gameOver.visible =false;
  
  //to create restart button
  restart = createSprite(200,230);
  restart.addImage(restartImg);
  restart.scale = 0.3;
  restart.debug = false;  
  restart.setCollider("rectangle",0,10,250,90)
  restart.visible = false;
  
  //to create groups
  bananaGroup = new Group();
  obstacleGroup = new Group(); 
  
}

//function 
function draw() {
  //background color
  background("white")
  //gamestate play
  if (gameState === PLAY){
    if(keyDown("space") && monkey.y >= 159) {
      jumpSound.play();
      monkey.velocityY = -12;
    } 
    
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    if (monkey.isTouching(bananaGroup)){
        score = score + 2;
        chewSound.play();
        bananaGroup.destroyEach();
    }
    
    if(backGround.x < 0){
       backGround.x = backGround.width/2
    }
    
    if (ground.x < 0){
        ground.x = ground.width/2;
    } 
    
    backGround.setVelocity(-5,0); 
    ground.velocityX = -(6+score/5 );
    monkey.velocityY = monkey.velocityY + 0.8;
    
    food();
    
    obstacles();  
    
    if (monkey.isTouching(obstacleGroup)){
        hitSound.play();
        gameState = END;
    }  
  }
   //gamestate end  
  else if (gameState === END){
    obstacleGroup.setVelocityEach(0,0);
    obstacleGroup.destroyEach();
    
    bananaGroup.destroyEach();
    backGround.setVelocity(0,0);
  
    monkey.setVelocity(0,0);
    monkey.changeAnimation("Monkey",MonkeyImage);
  
    gameOver.visible  = true;
    restart.visible = true;
  }
 
   monkey.collide(ground);
 
  if(mousePressedOver(restart)) {
    beepSound.play();
    reset();
  }
    
  drawSprites();
  //text score
  stroke("white")
  textSize(20)
  fill("white")
  text("Score : "+score ,10,30)
  //text survival time
  stroke("black")
  textSize(20)
  fill("black")
  text("Survival Time : "+survivalTime ,230,30)
  
}

//function for food
function food(){

  if (frameCount % 80 === 0){
    banana = createSprite(380,200,10,10);
    banana.debug = false;
    banana.setCollider("circle",0,0,200)
    banana.addImage("banana",bananaImage);
    banana.scale = 0.10;
    banana.y = Math.round(random(50,250));
    banana.velocityX = -(7+score/5)
    banana.lifetime = 50;
    bananaGroup.add(banana);
  }
  
}

//function for obstacles
function obstacles(){
  
  if(frameCount % 200 === 0) {
    obstacle = createSprite(200,350,10,10);
    obstacle.addImage("obstacle",obstacleImage)
    obstacle.debug = false;
    obstacle.setCollider("rectangle",0,0,450,350)
    obstacle.scale = 0.25;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacleGroup.add(obstacle);
  }
  
}

//function to reset
function reset(){
  
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false
  score = 0;
  survivalTime = 0;
  monkey.changeAnimation("running",monkey_running);
 
}