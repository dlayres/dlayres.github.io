let database;
let firebaseAPIKey;
let emailInput;
let passwordInput;
let passwordConfirmInput;

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
  background(220);
  noLoop();

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);

}
