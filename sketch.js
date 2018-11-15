let canvas;
let video;
let poseNet;
let poses = [];
let sucess;
let songOne, songTwo, songThree, songFour;
let soundNames = ['CLAP', 'KICK', 'SNARE', 'TOM' ]

function preload(){
	songOne = loadSound('clap.mp3');
  songTwo = loadSound('kick.mp3');
  songThree = loadSound('snare.mp3');
  songFour = loadSound('tom.mp3');
}

function setup() {
  canvas = createCanvas(800, 560);
  canvas.position((windowWidth - width)/2, 100);

  //Capture the video and hide it.
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
 });
 // Hide the video element, and just show the canvas

}

function modelReady() {
  success = createP('Raise your right wrist to begin playing :)');
  success.class('success');
}

function draw() {

      //Push the hidden video onto the canvas
      image(video, 0, 0, width, height);

      // Function to draw multiple rectangles onto the screen
      drawRect();

      // Function to draw the nose ellipse and logics for music playing
      nosePlayer();

      //Function to draw text onto the rectangles
      writeText();

}

function emptyState(){
  background(245,245,245)
  fill(25);
  textAlign(CENTER);
  textSize(20);
  text('Robot slaves working hard' , width/2, height/2);
}


function drawRect() {
	for(let k = 0; k < width; k = k + width/4){
    let colR = map(k, 0, width, 0, 255);
    let colG = map(k, 0, width, 240, 100);
    let colB = map(k, 0, width, 100, 240);
    noStroke();
  	fill(colR, colG, colB, 150);
    rect(k, 0, width/4, height);
  }
}

function writeText(){
  fill(255, 150);
  textAlign(CENTER);
  textSize(20);
  text(soundNames[0] , width/8, height/2);
  text(soundNames[1] , 3*width/8, height/2);
  text(soundNames[2] , 5*width/8, height/2);
  text(soundNames[3] , 7*width/8, height/2);
}



function nosePlayer()  {

  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[10];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        //Draw an ellipse at the nose
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 30, 30);

        //The conditions for the different sounds to load.
        if (keypoint.position.x < width/4  &&  !songOne.isPlaying()) {
          songTwo.pause();
          songThree.pause();
          songFour.pause();
          songOne.play();
        } else if(keypoint.position.x >= width/4  &&  keypoint.position.x < width/2 && !songTwo.isPlaying()) {
          songOne.pause();
          songTwo.pause();
          songThree.pause();
          songTwo.play();
        } else if(keypoint.position.x >= width/2  &&  keypoint.position.x < 3*width/4 && !songThree.isPlaying() ){
          songOne.pause();
          songTwo.pause();
          songFour.pause();
          songThree.play();
        } else if(keypoint.position.x >= 3*width/4  &&  keypoint.position.x < width && !songFour.isPlaying() ){
          songOne.pause();
          songTwo.pause();
          songThree.pause();
          songFour.play();
        }
      }
  }

}
