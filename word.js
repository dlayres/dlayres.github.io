// Word dictionary from http://scrabutility.com/TWL06.txt
// Split in half between two github gists

p5.Color.prototype.equals = function(c){
  return this.toString() == c.toString();
}

let dictionaryHalf1;
let dictionaryHalf2;
let dictionary;
let submitWordButton;
let recallTilesButton;
let shuffleTilesButton;
let submitBlankButton;
let userPos;
let gridSpacing = 60;
let scrollFactor = 0.015;
let userPoints = 0;
let userTiles = [];
let allTiles = [];
let tilePossibilities = [];
let letterPoints = new Map();
let tileWidth = gridSpacing;
let canDrag = true;
let draggingTile = false;
let draggingTileIndex;
let blankTileIndex = -1;
let dragOffsetX;
let dragOffsetY;
let tileRestingPositions = [];
let maxTiles = 7;
let occupiedPositions = [];
let committedPositions = [];
let tileOrigX;
let tileOrigY;
let restingY;
let bottomPanelHeight = 75;
let database;
let alertImg;
let alertOpacity = 0;
let displayAlert;
let defaultAlertHoldTimer = 250;
let alertHoldTimer = defaultAlertHoldTimer;
let alertMsg = "";
let selectBlank = false;
let blankOptions;
let blankOptionsCreated = false;
let firebaseAPIKey;
let firebaseConfig;
let tilePlaceSound;
let tilePlaceSoundLow;
let tripleWordColor;
let tripleLetterColor;
let doubleWordColor;
let doubleLetterColor;
let centerColor;
let emptyColor;

function preload(){
  soundFormats('mp3', 'ogg');
  tilePlaceSound = loadSound("https://gist.githubusercontent.com/dlayres/8efc85bae4664edff5152f2b17d93b92/raw/d95d200d99b6cb337341d6e6ad7692566fb0051a/tileClack.mp3");
  tilePlaceSoundLow = loadSound("https://gist.githubusercontent.com/dlayres/374cd164b593e915790abe7624bc0151/raw/7d54bd034c4b89279597307ebdf78ee40b9f711a/tileClackLow.mp3");
  dictionaryHalf1 = loadStrings("https://gist.githubusercontent.com/dlayres/5919e00889614b854092b86d76d55815/raw/6025c962aaa62766140a9ea0bfadba9dd4d07e61/dictHalf1.txt");
  dictionaryHalf2 = loadStrings("https://gist.githubusercontent.com/dlayres/de5c600219a07c1dd3a1589293cdf3b4/raw/51af4ebfea0538b55f5f43cc8dd9a5863dcadf97/dictHalf2.txt");
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
  alertImg = loadImage("https://gist.githubusercontent.com/dlayres/c71fafd0b454a46cccc2543fc6ee5163/raw/c701f7a490436b84f34166414eed2591cedae3c3/alert.png");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  dictionary = dictionaryHalf1.concat(dictionaryHalf2);
  submitWordButton = createButton("Submit Word");
  submitWordButton.position(20, windowHeight - 30);
  submitWordButton.mousePressed(checkWord);
  recallTilesButton = createButton("Recall Tiles");
  recallTilesButton.position(20, windowHeight - 60);
  recallTilesButton.mousePressed(recallTiles);
  shuffleTilesButton = createButton("Shuffle Tiles");
  shuffleTilesButton.position(windowWidth - shuffleTilesButton.width - 20, windowHeight - 45);
  shuffleTilesButton.mousePressed(shuffleTiles);
  submitBlankButton = createButton("Select");
  submitBlankButton.position((windowWidth * 0.3) + ((windowWidth * 0.4) - submitBlankButton.width) / 2, windowHeight * 0.3 + windowHeight * 0.4 * 0.75);
  submitBlankButton.mousePressed(submitBlank)
  tilePlaceSound.setVolume(1);
  tilePlaceSoundLow.setVolume(1);

  userPos = createVector(0, 0);

  tripleWordColor = color(255, 0, 0);
  tripleLetterColor = color(0, 0, 255);
  doubleWordColor = color(255, 170, 170);
  doubleLetterColor = color(170, 170, 255);
  centerColor = color(255, 255, 50);
  emptyColor = color(220, 220, 220);

  // Tile letter distribution, blanks not yet implemented
  tilePossibilities = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
                       "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N",
                       "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U",
                       "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z", "BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL"];

  letterPoints.set("A", 1);
  letterPoints.set("B", 3);
  letterPoints.set("C", 3);
  letterPoints.set("D", 2);
  letterPoints.set("E", 1);
  letterPoints.set("F", 4);
  letterPoints.set("G", 2);
  letterPoints.set("H", 4);
  letterPoints.set("I", 1);
  letterPoints.set("J", 8);
  letterPoints.set("K", 5);
  letterPoints.set("L", 1);
  letterPoints.set("M", 3);
  letterPoints.set("N", 1);
  letterPoints.set("O", 1);
  letterPoints.set("P", 3);
  letterPoints.set("Q", 10);
  letterPoints.set("R", 1);
  letterPoints.set("S", 1);
  letterPoints.set("T", 1);
  letterPoints.set("U", 1);
  letterPoints.set("V", 4);
  letterPoints.set("W", 4);
  letterPoints.set("X", 8);
  letterPoints.set("Y", 4);
  letterPoints.set("Z", 10);
  letterPoints.set("BL", 0);

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
  });

  restingY = windowHeight - bottomPanelHeight + ((bottomPanelHeight - tileWidth) / 2);
  for(let i = 0; i < maxTiles; i++){
    tileRestingPositions.push(createVector((tileWidth + 10) * (i + 4), restingY));
    let tileLetter = tilePossibilities[Math.floor(Math.random() * tilePossibilities.length)];
    userTiles.push(new Tile(tileLetter, letterPoints.get(tileLetter), tileRestingPositions[i].x, tileRestingPositions[i].y, tileWidth));
    allTiles.push(userTiles[i]);
  }
}

function draw(){
  background(220);
  drawGrid(userPos);
  drawBonuses(userPos);

  if(draggingTile){
    userTiles[draggingTileIndex].x = mouseX - dragOffsetX;
    userTiles[draggingTileIndex].y = mouseY - dragOffsetY;

    if(userTiles[draggingTileIndex].y + (tileWidth / 2) < windowHeight && userTiles[draggingTileIndex].y + (tileWidth / 2) > (windowHeight - bottomPanelHeight)){
      // Get tile directly to left, if exists
      let minSpacing = Infinity;
      let leftTileIndex = -1;
      let rightTileIndex = -1;
      let tileCenterX = userTiles[draggingTileIndex].x + (tileWidth / 2);
      for(let i = 0; i < userTiles.length; i++){
        let testTileCenterX = userTiles[i].x + (tileWidth / 2);
        if(i != draggingTileIndex && !userTiles[i].onBoard && testTileCenterX < tileCenterX && tileCenterX - testTileCenterX < minSpacing){
          minSpacing = tileCenterX - testTileCenterX;
          leftTileIndex = i;
        }
      }

      // Get tile directly to right, if exists
      minSpacing = Infinity;
      rightTileIndex = -1;
      for(let i = 0; i < userTiles.length; i++){
        let testTileCenterX = userTiles[i].x + (tileWidth / 2);
        if(i != draggingTileIndex && !userTiles[i].onBoard && testTileCenterX > tileCenterX && testTileCenterX - tileCenterX < minSpacing){
          minSpacing = testTileCenterX - tileCenterX;
          rightTileIndex = i;
        }
      }

      if(leftTileIndex >= 0 && rightTileIndex >= 0 && rightTileIndex - leftTileIndex == 1){
        // In between two tiles
        if(rightTileIndex < draggingTileIndex){
          // Tile coming from left
          shiftTiles(rightTileIndex, draggingTileIndex);
        }
        else{
          // Tile coming from right
          shiftTiles(leftTileIndex, draggingTileIndex);
        }
      }
      else if(leftTileIndex == maxTiles - 1){
        // Tile on far right
        shiftTiles(leftTileIndex, draggingTileIndex);
      }
      else if(rightTileIndex == 0){
        // Tile on far left
        shiftTiles(rightTileIndex, draggingTileIndex);
      }
    }
  }

  for(let i = 0; i < allTiles.length; i++){
    allTiles[i].drawTile();
  }

  strokeWeight(2);
  stroke(0, 0, 0);
  fill(255, 255, 255);
  circle(userPos.x, userPos.y, 10);
  rect(0, windowHeight - bottomPanelHeight, windowWidth, windowHeight - bottomPanelHeight);

  for(let i = 0; i < tileRestingPositions.length; i++){
    rect(tileRestingPositions[i].x, tileRestingPositions[i].y, tileWidth, tileWidth);
  }

  fill(0, 0, 0);
  noStroke();
  textSize(tileWidth / 2.5);
  text("Points: " + userPoints, submitWordButton.width + 35, windowHeight - 30);

  let numBoardTiles = 0;
  for(let i = 0; i < userTiles.length; i++){
    if(!userTiles[i].onBoard && i != draggingTileIndex){
      userTiles[i].x = tileRestingPositions[i].x;
      userTiles[i].y = tileRestingPositions[i].y;
      userTiles[i].drawTile();
    }
    if(userTiles[i].onBoard){
      numBoardTiles++;
    }
  }

  if(draggingTile){
    userTiles[draggingTileIndex].drawTile();
  }

  if(displayAlert == "inc" || displayAlert == "dec" || displayAlert == "const"){
    tint(255, alertOpacity);
    let width = alertImg.width;
    let emptySideWidth = (windowWidth - width) / 2;
    image(alertImg, emptySideWidth, 10);
    textSize(alertImg.height * 0.55);
    let textEmptySideWidth = (width - textWidth(alertMsg)) / 2;
    text(alertMsg, emptySideWidth + textEmptySideWidth, 48);
    if(displayAlert == "inc"){
      alertOpacity+=5;
    }
    else if(displayAlert == "const"){
      alertOpacity = 200;
      alertHoldTimer-=1;
      if(alertHoldTimer <= 0){
        alertHoldTimer = defaultAlertHoldTimer;
        displayAlert = "dec";
      }
    }
    else{
      alertOpacity-=5;
    }
    if(alertOpacity == 210){
      displayAlert = "const";
      alertOpacity-=10;
    }
    else if(alertOpacity == 0){
      displayAlert = 0;
    }
  }

  if(selectBlank){
    fill("rgba(0, 0, 0, 0.6)");
    noStroke();
    rect(0, 0, windowWidth, windowHeight);
    submitWordButton.hide();
    recallTilesButton.hide();
    shuffleTilesButton.hide();
    submitBlankButton.show();

    stroke(0, 0, 0);
    fill(255, 255, 255);
    rect(windowWidth * 0.3, windowHeight * 0.3, windowWidth * 0.4, windowHeight * 0.4);
    noStroke();
    fill(0, 0, 0);
    textSize(windowWidth * 0.0135);
    let selectBlankText1 = "Select a letter for the blank tile.";
    let selectBlankText2 = "Bringing the tile back to your tile rack will return it to a blank tile.";
    let selectBlankTextWidth1 = textWidth(selectBlankText1);
    let selectBlankTextWidth2 = textWidth(selectBlankText2);
    let textBegin1 = (windowWidth * 0.3) + ((windowWidth * 0.4) - selectBlankTextWidth1) / 2;
    let textBegin2 = (windowWidth * 0.3) + ((windowWidth * 0.4) - selectBlankTextWidth2) / 2;
    text(selectBlankText1, textBegin1, windowHeight * 0.3 + 40);
    text(selectBlankText2, textBegin2, windowHeight * 0.3 + 65);
    if(!blankOptionsCreated){
      blankOptions = createSelect();
      blankOptions.size(200, 50);
      let optionsBegin = (windowWidth * 0.3) + ((windowWidth * 0.4) - blankOptions.width) / 2;
      blankOptions.position(optionsBegin, windowHeight * 0.3 + windowHeight * 0.2);
      for(let i = 0; i < 26; i++){
        blankOptions.option(String.fromCharCode(i + 65));
        blankOptions.elt[i].style.fontSize = "22px";
      }
      blankOptionsCreated = true;
    }
  }
  else{
    if(numBoardTiles == 0){
      submitWordButton.hide();
    }
    else{
      submitWordButton.show();
    }
    recallTilesButton.show();
    shuffleTilesButton.show();
    submitBlankButton.hide();
    if(blankOptionsCreated){
      blankOptions.hide();
      blankOptionsCreated = false;
    }
    blankOptions = null;
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  submitWordButton.position(20, windowHeight - 30);
  recallTilesButton.position(20, windowHeight - 60);
  shuffleTilesButton.position(windowWidth - shuffleTilesButton.width - 20, windowHeight - 45);
  submitBlankButton.position((windowWidth * 0.3) + ((windowWidth * 0.4) - submitBlankButton.width) / 2, windowHeight * 0.3 + windowHeight * 0.4 * 0.75);

  restingY = windowHeight - bottomPanelHeight + ((bottomPanelHeight - tileWidth) / 2);
  tileRestingPositions = [];
  for(let i = 0; i < maxTiles; i++){
    tileRestingPositions.push(createVector((tileWidth + 10) * (i + 4), restingY));
  }

  if(blankOptionsCreated){
    let optionsBegin = (windowWidth * 0.3) + ((windowWidth * 0.4) - blankOptions.width) / 2;
    blankOptions.position(optionsBegin, windowHeight * 0.3 + windowHeight * 0.2);
  }

  for(let i = 0; i < userTiles.length; i++){
    userTiles.x = tileRestingPositions[i].x;
    userTiles.y = tileRestingPositions[i].y;
  }
}

// Scrolling disabled until I figure out how to put tiles on a different-sized grid that looks good
/*
function mouseWheel(event){
  scrollChange = event.delta * scrollFactor * gridSpacing * scrollFactor;
  gridSpacing -= scrollChange;
  gridSpacing = constrain(gridSpacing, 20, 200);
}
*/

function mouseDragged(event){
  if(canDrag && !selectBlank){
    userPos.add(createVector(event.movementX, event.movementY));
    for(let i = 0; i < allTiles.length; i++){
      if(allTiles[i].onBoard){
        allTiles[i].x += event.movementX;
        allTiles[i].y += event.movementY;
      }
    }
  }
}

function mousePressed(){
  if(mouseY > windowHeight - bottomPanelHeight){
    canDrag = false;
  }
  if(!selectBlank){
    for(let i = 0; i < userTiles.length; i++){
      if(!userTiles[i].committedToBoard && mouseX > userTiles[i].x && mouseX < userTiles[i].x + tileWidth && mouseY > userTiles[i].y && mouseY < userTiles[i].y + tileWidth){
        draggingTile = true;
        tileOrigX = userTiles[i].boardX;
        tileOrigY = userTiles[i].boardY;
        draggingTileIndex = i;
        dragOffsetX = mouseX - userTiles[i].x;
        dragOffsetY = mouseY - userTiles[i].y;
        break;
      }
    }
  }
  if(draggingTile){
    canDrag = false;
  }
}

function mouseReleased(){
  canDrag = true;

  let tileBoardX;
  let tileBoardY;

  if(draggingTile){
    let tileScreenCenter = createVector(userTiles[draggingTileIndex].x + tileWidth / 2, userTiles[draggingTileIndex].y + tileWidth / 2);
    let tileOffsetCenter = p5.Vector.sub(tileScreenCenter, userPos);

    // Assume tile is dropped on a valid location on the board
    let ableToPlace = true;
    let tileMovedToNewSlot = false;

    // Tile is dropped on the bottom panel, not on board
    if(tileScreenCenter.y + (tileWidth / 2) > windowHeight - bottomPanelHeight){
      ableToPlace = false;
      tilePlaceSoundLow.play();

      for(let i = 0; i < userTiles.length; i++){
        if(i != draggingTileIndex){
          let tileRestCenterX = tileRestingPositions[i].x + (tileWidth / 2);
          let tileRestCenterY = tileRestingPositions[i].y + (tileWidth / 2);
          if(abs(tileScreenCenter.x - tileRestCenterX) < tileWidth && abs(tileScreenCenter.y - tileRestCenterY) < tileWidth){
            // Tile dropped on empty rack slot, swap indices
            let tempTile = userTiles[draggingTileIndex];
            userTiles[draggingTileIndex] = userTiles[i];
            userTiles[i] = tempTile;
            draggingTileIndex = i;

            userTiles[draggingTileIndex].x = tileRestingPositions[draggingTileIndex].x;
            userTiles[draggingTileIndex].y = tileRestingPositions[draggingTileIndex].y;

            tileMovedToNewSlot = true;
          }
        }
      }
    }
    else{
      // Calculates tile board position
      tileBoardX = tileOffsetCenter.x - tileOffsetCenter.x % 10;
      tileBoardY = tileOffsetCenter.y - tileOffsetCenter.y % 10;
      while(tileBoardX % gridSpacing != 0){
        tileBoardX -= 10;
      }
      while(tileBoardY % gridSpacing != 0){
        tileBoardY -= 10;
      }
      tileBoardX /= gridSpacing;
      tileBoardY /= gridSpacing;

      // If tile board position is already occupied, cannot place tile on board
      for(let i = 0; i < occupiedPositions.length; i++){
        if(occupiedPositions[i].x == tileBoardX && occupiedPositions[i].y == tileBoardY){
          ableToPlace = false;
          break;
        }
      }

      // Special case where tile is being placed on same spot
      if(tileBoardX == tileOrigX && tileBoardY == tileOrigY){
        ableToPlace = true;
      }
    }

    if(!ableToPlace){
      draggingTile = false;
      if(!tileMovedToNewSlot){
        userTiles[draggingTileIndex].x = tileRestingPositions[draggingTileIndex].x;
        userTiles[draggingTileIndex].y = tileRestingPositions[draggingTileIndex].y;
      }
      userTiles[draggingTileIndex].onBoard = false;

      if(userTiles[draggingTileIndex].points == 0){
        userTiles[draggingTileIndex].letter = "BL";
      }

      tileBoardX = userTiles[draggingTileIndex].boardX;
      tileBoardY = userTiles[draggingTileIndex].boardY;

      let posIndex = -1;
      for(let i = 0; i < occupiedPositions.length; i++){
        if(occupiedPositions[i].x == tileBoardX && occupiedPositions[i].y == tileBoardY){
          posIndex = i;
          break;
        }
      }
      if(posIndex != -1){
        occupiedPositions.splice(posIndex, 1);
      }

      userTiles[draggingTileIndex].boardX = -1;
      userTiles[draggingTileIndex].boardY = -1;
    }
    else{
      floorX = tileOffsetCenter.x - tileOffsetCenter.x % 10;
      floorY = tileOffsetCenter.y - tileOffsetCenter.y % 10;
      while(floorX % gridSpacing != 0){
        floorX -= 10;
      }
      while(floorY % gridSpacing != 0){
        floorY -= 10;
      }

      if(userTiles[draggingTileIndex].onBoard){
        let tileBoardX = userTiles[draggingTileIndex].boardX;
        let tileBoardY = userTiles[draggingTileIndex].boardY;

        let posIndex = -1;
        for(let i = 0; i < occupiedPositions.length; i++){
          if(occupiedPositions[i].x == tileBoardX && occupiedPositions[i].y == tileBoardY){
            posIndex = i;
            break;
          }
        }
        if(posIndex != -1){
          occupiedPositions.splice(posIndex, 1);
        }
      }

      userTiles[draggingTileIndex].x = floorX + userPos.x;
      userTiles[draggingTileIndex].y = floorY + userPos.y;
      userTiles[draggingTileIndex].onBoard = true;
      if(userTiles[draggingTileIndex].boardX != floorX / gridSpacing || userTiles[draggingTileIndex].boardY != floorY / gridSpacing){
        tilePlaceSound.play();
      }
      userTiles[draggingTileIndex].boardX = floorX / gridSpacing;
      userTiles[draggingTileIndex].boardY = floorY / gridSpacing;

      occupiedPositions.push(createVector(floorX / gridSpacing, floorY / gridSpacing));
      if(userTiles[draggingTileIndex].letter == "BL"){
        selectBlank = true;
        blankTileIndex = draggingTileIndex;
      }
    }
    draggingTile = false;
  }
  draggingTileIndex = -1;
}

function recallTiles(){
  for(let i = 0; i < userTiles.length; i++){
    if(userTiles[i].onBoard && !userTiles[i].committedToBoard){
      userTiles[i].x = tileRestingPositions[i].x;
      userTiles[i].y = tileRestingPositions[i].y;
      userTiles[i].onBoard = false;

      if(userTiles[i].points == 0){
        userTiles[i].letter = "BL";
      }

      tileBoardX = userTiles[i].boardX;
      tileBoardY = userTiles[i].boardY;

      let posIndex = -1;
      for(let j = 0; j < occupiedPositions.length; j++){
        if(occupiedPositions[j].x == tileBoardX && occupiedPositions[j].y == tileBoardY){
          posIndex = j;
          break;
        }
      }
      if(posIndex != -1){
        occupiedPositions.splice(posIndex, 1);
      }

      userTiles[i].boardX = -1;
      userTiles[i].boardY = -1;
    }
  }
}

function shuffleTiles(){
  // Sends empty spaces to the end
  let numBoardTiles = 0;
  let numBlankTiles = 0;
  let boardTileIndices = [];
  let boardTiles = [];
  let blankTileIndices = [];
  let blankTiles = [];

  for(let i = 0; i < userTiles.length; i++){
    if(userTiles[i].onBoard){
      numBoardTiles++;
      boardTileIndices.push(i);
      boardTiles.push(userTiles[i]);
    }
  }

  for(let i = 0; i < numBoardTiles; i++){
    for(let j = maxTiles - 1; j >= 0; j--){
      if(j == boardTileIndices[i]){
        break;
      }
      if(!userTiles[j].onBoard){
        let tempTile = userTiles[boardTileIndices[i]];
        userTiles[boardTileIndices[i]] = userTiles[j];
        userTiles[j] = tempTile;
        break;
      }
    }
  }

  for(let i = 0; i < userTiles.length; i++){
    if(userTiles[i].points == 0 && !userTiles[i].onBoard){
      numBlankTiles++;
      blankTileIndices.push(i);
      blankTiles.push(userTiles[i]);
    }
  }

  for(let i = 0; i < numBlankTiles; i++){
    for(let j = maxTiles - numBoardTiles - 1; j >= 0; j--){
      if(j == blankTileIndices[i]){
        break;
      }
      if(userTiles[j].points != 0){
        let tempTile = userTiles[blankTileIndices[i]];
        userTiles[blankTileIndices[i]] = userTiles[j];
        userTiles[j] = tempTile;
        break;
      }
    }
  }

  let tempTiles = [];
  for(let i = 0; i < userTiles.length - numBoardTiles - numBlankTiles; i++){
    tempTiles.push(userTiles[i]);
  }

  for(let i = tempTiles.length - 1; i > 0; i-=1) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [tempTiles[i], tempTiles[randomIndex]] = [tempTiles[randomIndex], tempTiles[i]];
  }
  userTiles = [];
  for(let i = 0; i < tempTiles.length; i++){
    userTiles.push(tempTiles[i]);
    userTiles[i].x = tileRestingPositions[i].x;
    userTiles[i].y = tileRestingPositions[i].y;
  }
  for(let i = 0; i < blankTiles.length; i++){
    userTiles.push(blankTiles[i]);
  }
  for(let i = 0; i < boardTiles.length; i++){
    userTiles.push(boardTiles[i]);
  }
}

function submitBlank(){
  selectBlank = false;
  userTiles[blankTileIndex].letter = blankOptions.value();
  blankTileIndex = -1;
}

function checkWord(){
  // tiles on board
  let tilesOnBoard = [];
  let tempBoardTiles = [];
  let tileIndices = [];
  let wordTiles = [];
  // all x positions
  // all y positions
  let allX = [];
  let allY = [];
  for(let i = 0; i < userTiles.length; i++){
    if(userTiles[i].onBoard && !userTiles[i].committedToBoard){
      tilesOnBoard.push(userTiles[i]);
      tileIndices.push(i);
      wordTiles.push(userTiles[i]);
      allX.push(userTiles[i].boardX);
      allY.push(userTiles[i].boardY);
    }
  }
  for(let i = 0; i < tilesOnBoard.length; i++){
    tempBoardTiles.push(tilesOnBoard[i]);
  }

  if(tilesOnBoard.length == 0){
    sendAlert("You haven't placed any tiles on the board.");
    return;
  }

  // First check if tiles are all in a row or column
  let sameRow = true;
  let sameColumn = true;
  // Check if tiles are in same row
  let tileY = tilesOnBoard[0].y;
  for(let i = 0; i < tilesOnBoard.length; i++){
    if(tilesOnBoard[i].y != tileY){
      sameRow = false;
    }
  }
  if(!sameRow){
    // Check if tiles are in same column
    let tileX = tilesOnBoard[0].x;
    for(let i = 0; i < tilesOnBoard.length; i++){
      if(tilesOnBoard[i].x != tileX){
        sameColumn = false;
      }
    }
  }
  if(!sameRow && !sameColumn){
    sendAlert("Your tiles are not in a valid configuration.");
    return;
  }

  if(sameRow){
    let validHorizontal = getHorizontalAdjacencies(tilesOnBoard, allX, allY);
    if(validHorizontal[0]){
      let wordTiles = validHorizontal[1];
      if(wordTiles.length > 1){
        // definitely horizontal, construct word, and list of words connected vertically, if any
        let wordList = [];
        wordTiles.sort((a, b) => (a.x > b.x) ? 1 : -1);
        let word = "";
        let possiblePoints = 0;
        let pointMultiplier = 1;
        for(let i = 0; i < wordTiles.length; i++){
          word += wordTiles[i].letter;
          let boardX = wordTiles[i].boardX;
          let boardY = wordTiles[i].boardY;
          if(!wordTiles[i].committedToBoard){
            let color = getColor(boardX, boardY);
            if(color.equals(tripleLetterColor)){
              possiblePoints += wordTiles[i].points * 3;
            }
            else if(color.equals(doubleLetterColor)){
              possiblePoints += wordTiles[i].points * 2;
            }
            else{
              possiblePoints += wordTiles[i].points;
            }

            if(color.equals(tripleWordColor)){
              pointMultiplier *= 3;
            }
            else if(color.equals(doubleWordColor)){
              pointMultiplier *= 2;
            }
          }
          else{
            possiblePoints += wordTiles[i].points;
          }
        }
        possiblePoints *= pointMultiplier;
        wordList.push([word, possiblePoints]);
        pointMultiplier = 1;
        possiblePoints = 0;

        for(let i = 0; i < tempBoardTiles.length; i++){
          let tile = tempBoardTiles[i];
          let tileX = tile.boardX;
          let tileY = tile.boardY;
          let tileAdjacencies = getVerticalAdjacencies([tile], [tileX], [tileY])[1];
          if(tileAdjacencies.length > 1){
            tileAdjacencies.sort((a, b) => (a.y > b.y) ? 1 : -1);
            let verticalWord = "";
            let possiblePoints = 0;
            let pointMultiplier = 1;
            for(let j = 0; j < tileAdjacencies.length; j++){
              verticalWord += tileAdjacencies[j].letter;
              if(!tileAdjacencies[j].committedToBoard){
                let boardX = tileAdjacencies[j].boardX;
                let boardY = tileAdjacencies[j].boardY;
                let color = getColor(boardX, boardY);
                if(color.equals(tripleLetterColor)){
                  possiblePoints += tileAdjacencies[j].points * 3;
                }
                else if(color.equals(doubleLetterColor)){
                  possiblePoints += tileAdjacencies[j].points * 2;
                }
                else{
                  possiblePoints += tileAdjacencies[j].points;
                }

                if(color.equals(tripleWordColor)){
                  pointMultiplier *= 3;
                }
                else if(color.equals(doubleWordColor)){
                  pointMultiplier *= 2;
                }
              }
              else{
                possiblePoints += tileAdjacencies[j].points;
              }
            }
            possiblePoints *= pointMultiplier;
            wordList.push([verticalWord, possiblePoints]);
            pointMultiplier = 1;
            possiblePoints = 0;
          }
        }

        for(let i = 0; i < wordList.length; i++){
          if(!checkDictionary(wordList[i][0])){
            sendAlert(wordList[i][0].toUpperCase() + " is not a valid word.");
            return;
          }
        }

        let successAlert = "";
        let totalPoints = 0;
        for(let i = 0; i < wordList.length - 1; i++){
          successAlert += (wordList[i][0].toUpperCase() + " played successfully.\n");
          totalPoints += wordList[i][1];
        }
        successAlert += (wordList[wordList.length - 1][0].toUpperCase() + " played successfully.");
        totalPoints += wordList[wordList.length - 1][1];
        userPoints += totalPoints;
        commitWord(tileIndices);
        //sendAlert(successAlert);
        return;
      }
    }
    else{
      sendAlert("Your tiles are not in a valid configuration.");
      return;
    }
  }

  // tiles on board
  tilesOnBoard = [];
  tileIndices = [];
  wordTiles = [];
  // all x positions
  // all y positions
  allX = [];
  allY = [];
  for(let i = 0; i < userTiles.length; i++){
    if(userTiles[i].onBoard && !userTiles[i].committedToBoard){
      tilesOnBoard.push(userTiles[i]);
      tileIndices.push(i);
      wordTiles.push(userTiles[i]);
      allX.push(userTiles[i].boardX);
      allY.push(userTiles[i].boardY);
    }
  }
  tempBoardTiles = [];
  for(let i = 0; i < tilesOnBoard.length; i++){
    tempBoardTiles.push(tilesOnBoard[i]);
  }

  if(sameColumn){
    let validVertical = getVerticalAdjacencies(tilesOnBoard, allX, allY);
    if(validVertical[0]){
      let wordTiles = validVertical[1];
      if(wordTiles.length > 1){
        // definitely vertical, construct word
        let wordList = [];
        wordTiles.sort((a, b) => (a.y > b.y) ? 1 : -1);
        let word = "";
        let possiblePoints = 0;
        let pointMultiplier = 1;
        for(let i = 0; i < wordTiles.length; i++){
          word += wordTiles[i].letter;
          let boardX = wordTiles[i].boardX;
          let boardY = wordTiles[i].boardY;
          if(!wordTiles[i].committedToBoard){
            let color = getColor(boardX, boardY);
            if(color.equals(tripleLetterColor)){
              possiblePoints += wordTiles[i].points * 3;
            }
            else if(color.equals(doubleLetterColor)){
              possiblePoints += wordTiles[i].points * 2;
            }
            else{
              possiblePoints += wordTiles[i].points;
            }

            if(color.equals(tripleWordColor)){
              pointMultiplier *= 3;
            }
            else if(color.equals(doubleWordColor)){
              pointMultiplier *= 2;
            }
          }
          else{
            possiblePoints += wordTiles[i].points;
          }
        }
        possiblePoints *= pointMultiplier;
        wordList.push([word, possiblePoints]);
        possiblePoints = 0;
        pointMultiplier = 1;

        for(let i = 0; i < tempBoardTiles.length; i++){
          let tile = tempBoardTiles[i];
          let tileX = tile.boardX;
          let tileY = tile.boardY;
          let tileAdjacencies = getHorizontalAdjacencies([tile], [tileX], [tileY])[1];
          if(tileAdjacencies.length > 1){
            tileAdjacencies.sort((a, b) => (a.x > b.x) ? 1 : -1);
            let horizontalWord = "";
            let possiblePoints = 0;
            let pointMultiplier = 1;
            for(let j = 0; j < tileAdjacencies.length; j++){
              horizontalWord += tileAdjacencies[j].letter;
              if(!tileAdjacencies[j].committedToBoard){
                let boardX = tileAdjacencies[j].boardX;
                let boardY = tileAdjacencies[j].boardY;
                let color = getColor(boardX, boardY);
                if(color.equals(tripleLetterColor)){
                  possiblePoints += tileAdjacencies[j].points * 3;
                }
                else if(color.equals(doubleLetterColor)){
                  possiblePoints += tileAdjacencies[j].points * 2;
                }
                else{
                  possiblePoints += tileAdjacencies[j].points;
                }

                if(color.equals(tripleWordColor)){
                  pointMultiplier *= 3;
                }
                else if(color.equals(doubleWordColor)){
                  pointMultiplier *= 2;
                }
              }
              else{
                possiblePoints += tileAdjacencies[j].points;
              }
            }
            possiblePoints *= pointMultiplier;
            wordList.push([horizontalWord, possiblePoints]);
            possiblePoints = 0;
            pointMultiplier = 1;
          }
        }

        for(let i = 0; i < wordList.length; i++){
          if(!checkDictionary(wordList[i][0])){
            sendAlert(wordList[i][0].toUpperCase() + " is not a valid word.");
            return;
          }
        }

        let successAlert = "";
        let totalPoints = 0;
        for(let i = 0; i < wordList.length - 1; i++){
          successAlert += (wordList[i][0].toUpperCase() + " played successfully.\n");
          totalPoints += wordList[i][1];
        }
        successAlert += (wordList[wordList.length - 1][0].toUpperCase() + " played successfully.");
        totalPoints += wordList[wordList.length - 1][1];
        userPoints += totalPoints;
        commitWord(tileIndices);
        //sendAlert(successAlert);
        return;
      }
    }
    else{
      sendAlert("Your tiles are not in a valid configuration.");
      return;
    }
  }

  // Code should not reach here, but if it does, send an error
  sendAlert("Your tiles are not in a valid configuration.");
  return;
}


function checkDictionary(word){
  return dictionary.includes(word.toUpperCase());
}

function sendAlert(msg){
  // Alert should start by increasing in opacity
  displayAlert = "inc";
  alertMsg = msg;
  alertOpacity = 0;
}

function drawGrid(pos){
  stroke(0, 0, 0);
  strokeWeight(gridSpacing * scrollFactor);
  for(let i = pos.x; i < windowWidth; i+=gridSpacing){
    line(i, 0, i, windowHeight);
  }
  for(let i = pos.x - gridSpacing; i > -windowWidth; i-=gridSpacing){
    line(i, 0, i, windowHeight);
  }
  for(let j = pos.y; j < windowHeight; j+=gridSpacing){
    line(0, j, windowWidth, j);
  }
  for(let j = pos.y - gridSpacing; j > -windowHeight; j-=gridSpacing){
    line(0, j, windowWidth, j);
  }

  //drawCoordText(pos);
}

function drawCoordText(pos){
  strokeWeight(2.5);
  fill(255, 255, 255);
  for(let i = pos.x; i < windowWidth; i+=gridSpacing){
    for(let j = pos.y; j < windowHeight; j+=gridSpacing){
      let tileX = (i - pos.x) / gridSpacing;
      let tileY = (j - pos.y) / gridSpacing;
      text(tileX, i + 10, j + 30);
      text(tileY, i + 30, j + 30);
    }
    for(let j = pos.y - gridSpacing; j > -windowHeight; j-=gridSpacing){
      let tileX = (i - pos.x) / gridSpacing;
      let tileY = (j - pos.y) / gridSpacing;
      text(tileX, i + 10, j + 30);
      text(tileY, i + 30, j + 30);
    }
  }
  for(let i = pos.x - gridSpacing; i > -windowWidth; i-=gridSpacing){
    for(let j = pos.y; j < windowHeight; j+=gridSpacing){
      let tileX = (i - pos.x) / gridSpacing;
      let tileY = (j - pos.y) / gridSpacing;
      text(tileX, i + 10, j + 30);
      text(tileY, i + 30, j + 30);
    }
    for(let j = pos.y - gridSpacing; j > -windowHeight; j-=gridSpacing){
      let tileX = (i - pos.x) / gridSpacing;
      let tileY = (j - pos.y) / gridSpacing;
      text(tileX, i + 10, j + 30);
      text(tileY, i + 30, j + 30);
    }
  }
  strokeWeight(gridSpacing * scrollFactor);
}


function drawBonuses(pos){
  let x = pos.x % gridSpacing;
  let y = pos.y % gridSpacing;

  if(x > 0){
    x -= gridSpacing;
  }
  if(y > 0){
    y -= gridSpacing;
  }

  x -= gridSpacing;
  y -= gridSpacing;

  let tileX = (x - pos.x) / gridSpacing;
  let tileY = (y - pos.y) / gridSpacing;

  while(tileX % 14 != 0){
    tileX -= 1;
    x -= gridSpacing;
  }
  while(tileY % 14 != 0){
    tileY -= 1;
    y -= gridSpacing;
  }

  let spacing1 = gridSpacing;
  let spacing2 = gridSpacing * 2;
  let spacing3 = gridSpacing * 3;
  let spacing4 = gridSpacing * 4;
  let spacing5 = gridSpacing * 5;
  let spacing6 = gridSpacing * 6;
  let spacing7 = gridSpacing * 7;
  let spacing8 = gridSpacing * 8;
  let spacing9 = gridSpacing * 9;
  let spacing10 = gridSpacing * 10;
  let spacing11 = gridSpacing * 11;
  let spacing12 = gridSpacing * 12;
  let spacing13 = gridSpacing * 13;
  let spacing14 = gridSpacing * 14;

  for(let i = x; i < windowWidth * 2; i += spacing14){
    for(let j = y; j < windowWidth * 2; j += spacing14){
      fill(centerColor);
      square(i, j, gridSpacing);

      fill(tripleWordColor);
      square(i + spacing7, j, gridSpacing);
      square(i, j + spacing7, gridSpacing);
      square(i + spacing7, j + spacing7, gridSpacing);

      fill(tripleLetterColor);
      square(i + spacing2, j + spacing2, gridSpacing);
      square(i + spacing6, j + spacing2, gridSpacing);
      square(i + spacing8, j + spacing2, gridSpacing);
      square(i + spacing12, j + spacing2, gridSpacing);
      square(i + spacing2, j + spacing6, gridSpacing);
      square(i + spacing12, j + spacing6, gridSpacing);
      square(i + spacing2, j + spacing8, gridSpacing);
      square(i + spacing12, j + spacing8, gridSpacing);
      square(i + spacing2, j + spacing12, gridSpacing);
      square(i + spacing6, j + spacing12, gridSpacing);
      square(i + spacing8, j + spacing12, gridSpacing);
      square(i + spacing12, j + spacing12, gridSpacing);

      fill(doubleWordColor);
      square(i + spacing3, j + spacing3, gridSpacing);
      square(i + spacing4, j + spacing4, gridSpacing);
      square(i + spacing5, j + spacing5, gridSpacing);
      square(i + spacing6, j + spacing6, gridSpacing);
      square(i + spacing8, j + spacing8, gridSpacing);
      square(i + spacing9, j + spacing9, gridSpacing);
      square(i + spacing10, j + spacing10, gridSpacing);
      square(i + spacing11, j + spacing11, gridSpacing);
      square(i + spacing11, j + spacing3, gridSpacing);
      square(i + spacing10, j + spacing4, gridSpacing);
      square(i + spacing9, j + spacing5, gridSpacing);
      square(i + spacing8, j + spacing6, gridSpacing);
      square(i + spacing6, j + spacing8, gridSpacing);
      square(i + spacing5, j + spacing9, gridSpacing);
      square(i + spacing4, j + spacing10, gridSpacing);
      square(i + spacing3, j + spacing11, gridSpacing);

      fill(doubleLetterColor);
      square(i + spacing4, j, gridSpacing);
      square(i + spacing10, j, gridSpacing);
      square(i + spacing1, j + spacing1, gridSpacing);
      square(i + spacing5, j + spacing1, gridSpacing);
      square(i + spacing9, j + spacing1, gridSpacing);
      square(i + spacing13, j + spacing1, gridSpacing);
      square(i, j + spacing4, gridSpacing);
      square(i + spacing7, j + spacing4, gridSpacing);
      square(i + spacing1, j + spacing5, gridSpacing);
      square(i + spacing13, j + spacing5, gridSpacing);
      square(i + spacing4, j + spacing7, gridSpacing);
      square(i + spacing10, j + spacing7, gridSpacing);
      square(i + spacing1, j + spacing9, gridSpacing);
      square(i + spacing13, j + spacing9, gridSpacing);
      square(i, j + spacing10, gridSpacing);
      square(i + spacing7, j + spacing10, gridSpacing);
      square(i + spacing1, j + spacing13, gridSpacing);
      square(i + spacing5, j + spacing13, gridSpacing);
      square(i + spacing9, j + spacing13, gridSpacing);
      square(i + spacing13, j + spacing13, gridSpacing);
    }
  }
}

function getColor(x, y){
  let color = emptyColor;

  // Center spaces
  if(x % 14 == 0 && y % 14 == 0){
    color = centerColor;
    return color;
  }

  // Triple word scores
  if(x % 7 == 0 && y % 7 == 0){
    color = tripleWordColor;
    return color;
  }

  // Triple letter scores
  // (vertical)
  if((x + 2) % 14 == 0 || (x - 2) % 14 == 0){
    if((y + 2) % 14 == 0 || (y + 6) % 14 == 0 || (y - 2) % 14 == 0 || (y - 6) % 14 == 0){
      color = tripleLetterColor;
      return color;
    }
  }

  // (horizontal)
  if((x + 6) % 14 == 0 || (x - 6) % 14 == 0){
    if((y + 2) % 14 == 0 || (y - 2) % 14 == 0){
      color = tripleLetterColor;
      return color;
    }
  }

  // Double word scores
  for(let i = 3; i <= 6; i++){
    if((x + i) % 14 == 0 || (x - i) % 14 == 0){
      if((y + i) % 14 == 0 || (y - i) % 14 == 0){
        color = doubleWordColor;
        return color;
      }
    }
  }

  // Double letter scores
  if((x + 1) % 14 == 0 || (x - 1) % 14 == 0 || (x + 5) % 14 == 0 || (x - 5) % 14 == 0){
    if((y + 1) % 14 == 0 || (y - 1) % 14 == 0){
      color = doubleLetterColor;
      return color;
    }
  }

  if((x + 1) % 14 == 0 || (x - 1) % 14 == 0){
    if((y + 5) % 14 == 0 || (y - 5) % 14 == 0){
      color = doubleLetterColor;
      return color;
    }
  }

  if((x + 4) % 14 == 0 || (x - 4) % 14 == 0){
    if((y + 7) % 14 == 0 || (y - 7) % 14 == 0){
      color = doubleLetterColor;
      return color;
    }
  }

  if((x + 7) % 14 == 0 || (x - 7) % 14 == 0){
    if((y + 4) % 14 == 0 || (y - 4) % 14 == 0){
      color = doubleLetterColor;
      return color;
    }
  }

  if((x + 4) % 14 == 0 || (x - 4) % 14 == 0){
    if(y % 14 == 0){
      color = doubleLetterColor;
      return color;
    }
  }

  if(x % 14 == 0){
    if((y + 4) % 14 == 0 || (y - 4) % 14 == 0){
      color = doubleLetterColor;
      return color;
    }
  }

  // Non-bonus spaces
  return color;
}

function getHorizontalAdjacencies(boardTiles, xPositions, yPositions){
  let adjacencies = [];

  for(let i = 0; i < boardTiles.length; i++){
    adjacencies.push(boardTiles[i]);
  }

  // sort tiles by x position
  boardTiles.sort((a, b) => (a.x > b.x) ? 1 : -1);
  let yPos = yPositions[0];

  // find rightmost user tile (... spreads array into list)
  let rightmostX = Math.max(...xPositions);
  let storedX = rightmostX;

  // find index of tile and remove it
  for(let i = 0; i < boardTiles.length; i++){
    if(boardTiles[i].boardX == rightmostX){
      boardTiles.splice(i, 1);
      break;
    }
  }

  // assume a preexisting tile is directly to its right, keep going until one isn't
  while(true){
    let foundTile = false;
    for(let i = 0; i < committedPositions.length; i++){
      if(committedPositions[i].y == yPos && committedPositions[i].x == rightmostX + 1){
        // preexisting tile does exist there, find it in list of tiles
        for(let j = 0; j < allTiles.length; j++){
          if(allTiles[j].boardX == rightmostX + 1 && allTiles[j].boardY == yPos){
            adjacencies.push(allTiles[j]);
          }
        }
        rightmostX += 1;
        foundTile = true;
        break;
      }
    }
    if(!foundTile){
      break;
    }
  }

  // keep going left from storedX (original rightmostX) until encounter empty space
  let foundTile = true;
  while(foundTile){
    storedX -= 1;
    // look in user tiles
    let foundUserTile = false;
    for(let i = 0; i < boardTiles.length; i++){
      if(boardTiles[i].boardX == storedX){
        boardTiles.splice(i, 1);
        foundUserTile = true;
        break;
      }
    }

    // look in preexisting tiles
    if(!foundUserTile){
      for(let i = 0; i < committedPositions.length; i++){
        if(committedPositions[i].y == yPos && committedPositions[i].x == storedX){
          foundUserTile = true;
          // find tile in list of tiles
          for(let j = 0; j < allTiles.length; j++){
            if(allTiles[j].boardX == storedX && allTiles[j].boardY == yPos){
              adjacencies.push(allTiles[j]);
              break;
            }
          }
          break;
        }
      }
    }

    if(!foundUserTile){
      foundTile = false;
    }
  }

  let validHorizontal = (boardTiles.length == 0);
  return [validHorizontal, adjacencies];
}

function getVerticalAdjacencies(boardTiles, xPositions, yPositions){
  let adjacencies = [];

  for(let i = 0; i < boardTiles.length; i++){
    adjacencies.push(boardTiles[i]);
  }

  // sort tiles by y position
  boardTiles.sort((a, b) => (a.y > b.y) ? 1 : -1);
  let xPos = xPositions[0];

  // find bottommost user tile (... spreads array into list)
  let bottommostY = Math.max(...yPositions);
  let storedY = bottommostY;

  // find index of tile and remove it
  for(let i = 0; i < boardTiles.length; i++){
    if(boardTiles[i].boardY == bottommostY){
      boardTiles.splice(i, 1);
      break;
    }
  }

  // assume a preexisting tile is directly underneath it, keep going until one isn't
  while(true){
    let foundTile = false;
    for(let i = 0; i < committedPositions.length; i++){
      if(committedPositions[i].x == xPos && committedPositions[i].y == bottommostY + 1){
        // preexisting tile does exist there, find it in list of tiles
        for(let j = 0; j < allTiles.length; j++){
          if(allTiles[j].boardY == bottommostY + 1 && allTiles[j].boardX == xPos){
            adjacencies.push(allTiles[j]);
          }
        }
        bottommostY += 1;
        foundTile = true;
        break;
      }
    }
    if(!foundTile){
      break;
    }
  }

  // keep going up from storedY (original bottommostY) until encounter empty space
  let foundTile = true;
  while(foundTile){
    storedY -= 1;
    // look in user tiles
    let foundUserTile = false;
    for(let i = 0; i < boardTiles.length; i++){
      if(boardTiles[i].boardY == storedY){
        boardTiles.splice(i, 1);
        foundUserTile = true;
        break;
      }
    }

    // look in preexisting tiles
    if(!foundUserTile){
      for(let i = 0; i < committedPositions.length; i++){
        if(committedPositions[i].x == xPos && committedPositions[i].y == storedY){
          foundUserTile = true;
          // find tile in list of tiles
          for(let j = 0; j < allTiles.length; j++){
            if(allTiles[j].boardY == storedY && allTiles[j].boardX == xPos){
              adjacencies.push(allTiles[j]);
              break;
            }
          }
          break;
        }
      }
    }

    if(!foundUserTile){
      foundTile = false;
    }
  }

  let validVertical = (boardTiles.length == 0);
  return [validVertical, adjacencies];
}

function commitWord(indices){
  let numTilesLeft = 0;
  for(let i = 0; i < userTiles.length; i++){
    if(!userTiles[i].onBoard){
      numTilesLeft++;
    }
  }
  if(numTilesLeft == 0){
    userPoints += 50;
  }

  for(let i = 0; i < indices.length; i++){
    userTiles[indices[i]].committedToBoard = true;
    database.collection("tiles").add({
      tileLetter: userTiles[indices[i]].letter,
      xPosition: userTiles[indices[i]].boardX,
      yPosition: userTiles[indices[i]].boardY,
      points: userTiles[indices[i]].points
    })
    .catch(function(error){
      console.error("Error adding document: " + error);
    })

    let tileLetter = tilePossibilities[Math.floor(Math.random() * tilePossibilities.length)];
    userTiles[indices[i]] = new Tile(tileLetter, letterPoints.get(tileLetter), tileRestingPositions[i].x, tileRestingPositions[i].y, tileWidth);
    allTiles.push(userTiles[indices[i]]);
  }
  for(let i = 0; i < occupiedPositions.length; i++){
    committedPositions.push(occupiedPositions[i]);
  }
}

function shiftTiles(startingIndex, endingIndex){
  if(startingIndex > endingIndex){
    // Shifting tiles left
    // Keep track of current endingIndex
    let oldEndingIndex = endingIndex;
    // Search for rightmost empty slot after startingIndex and before endingIndex
    for(let i = startingIndex - 1; i > endingIndex; i--){
      if(userTiles[i].onBoard){
        endingIndex = i;
      }
    }

    let tempTile;
    if(oldEndingIndex != endingIndex){
      tempTile = userTiles[oldEndingIndex];
      userTiles[oldEndingIndex] = userTiles[endingIndex];
    }
    else{
      tempTile = userTiles[endingIndex];
    }

    while(endingIndex != startingIndex){
      userTiles[endingIndex] = userTiles[endingIndex + 1]
      endingIndex += 1;
    }
    userTiles[startingIndex] = tempTile;
    draggingTileIndex = startingIndex;
  }
  else{
    // Shifting tiles right
    // Keep track of current endingIndex
    let oldEndingIndex = endingIndex;
    // Search for left empty slot before endingIndex and after startingIndex
    for(let i = startingIndex + 1; i < endingIndex; i++){
      if(userTiles[i].onBoard){
        endingIndex = i;
      }
    }

    let tempTile;
    if(oldEndingIndex != endingIndex){
      tempTile = userTiles[oldEndingIndex];
      userTiles[oldEndingIndex] = userTiles[endingIndex];
    }
    else{
      tempTile = userTiles[endingIndex];
    }

    while(endingIndex != startingIndex){
      userTiles[endingIndex] = userTiles[endingIndex - 1]
      endingIndex -= 1;
    }
    userTiles[startingIndex] = tempTile;
    draggingTileIndex = startingIndex;
  }
}


// "Developer Functions" (remove if game ever public)//
function deleteDatabase(){
  let response = prompt("Type 'DELETE' to remove all tiles from database.");
  if(response == "DELETE"){
    database.collection("tiles").get().then((query) => {
      query.forEach((doc) => {
        doc.ref.delete();
      });
    });
  }
}
