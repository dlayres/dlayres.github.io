let database;
let firebaseAPIKey;
let emailInput;
let passwordInput;
let passwordConfirmInput;
let createAccountButton;

function preload(){
  firebaseAPIKey = loadStrings("https://gist.githubusercontent.com/dlayres/0bcadfe02a2eaf279679aedbb99014fa/raw/15860d00a8d05558aa00507fff1db850a1ba6490/fbapi.txt",
    () => {
      firebaseConfig = {
        apiKey: firebaseAPIKey[0],
        authDomain: "word-a8b6a.firebaseapp.com",
        databaseURL: "https://word-a8b6a.firebaseio.com",
        projectId: "word-a8b6a",
        storageBucket: "word-a8b6a.appspot.com",
        messagingSenderId: "1056186017327",
        appId: "1:1056186017327:web:ebfa927c3f923a35"
      };
      firebase.initializeApp(firebaseConfig);
      database = firebase.firestore();
    }
  );
}

function setup(){
  createCanvas(windowWidth, windowHeight);

  emailInput = createInput("E-mail Address");
  emailInput.position(20, 20);
  passwordInput = createInput("Password");
  passwordInput.position(20, 60);
  passwordConfirmInput = createInput("Confirm Password");
  passwordConfirmInput.position(20, 100);

  let captchaContainer = select("#captcha");
  captchaContainer.position(20, 150);

  createAccountButton = createButton("Create Account");
  createAccountButton.position(20, 280);
  createAccountButton.mousePressed(createAccount);

  /*
  // Get preexisting tiles from database
  database.collection("tiles").get().then((query) => {
    query.forEach((doc) => {
      let tileLetter = doc.data().tileLetter;
      let xPosition = doc.data().xPosition;
      let yPosition = doc.data().yPosition;
      let points = doc.data().points;
      allTiles.push(new Tile(tileLetter, points, xPosition * gridSpacing + userPos.x, yPosition * gridSpacing + userPos.y, tileWidth));
      let lastIndex = allTiles.length - 1;
      allTiles[lastIndex].onBoard = true;
      allTiles[lastIndex].committedToBoard = true;
      allTiles[lastIndex].boardX = xPosition;
      allTiles[lastIndex].boardY = yPosition;
      occupiedPositions.push(createVector(xPosition, yPosition));
      committedPositions.push(createVector(xPosition, yPosition));
    });
  });*/
}

function draw(){
  background(255);
  noLoop();

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);

}

function createAccount(){
  console.log(grecaptcha.getResponse());
}
