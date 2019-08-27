// Word dictionary from http://scrabutility.com/TWL06.txt
// Split in half between two github gists

let dictionaryHalf1;
let dictionaryHalf2;
let dictionary;
let submitWordButton;
let recallTilesButton;
let userPos;
let gridSpacing = 60;
let scrollFactor = 0.015;
let userTiles = [];
let allTiles = [];
let tilePossibilities;
let tileWidth = gridSpacing;
let canDrag = true;
let draggingTile = false;
let draggingTileIndex;
let dragOffsetX;
let dragOffsetY;
let tileRestingPositions = [];
let alertDebounce = 0;
<<<<<<< HEAD
let debounceAmount = 15;
=======
let debounceAmount = 1;
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
let maxTiles = 7;
let occupiedPositions = [];
let committedPositions = [];
let tileOrigX;
let tileOrigY;
let restingY;
let bottomPanelHeight = 75;
<<<<<<< HEAD
=======
let database;
let alertImg;
let alertOpacity = 0;
let displayAlert;
let defaultAlertHoldTimer = 250;
let alertHoldTimer = defaultAlertHoldTimer;
let alertMsg = "";
let firebaseAPIKey = databaseConfig.firebaseKey;

// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: firebaseAPIKey,
  authDomain: "word-a8b6a.firebaseapp.com",
  databaseURL: "https://word-a8b6a.firebaseio.com",
  projectId: "word-a8b6a",
  storageBucket: "word-a8b6a.appspot.com",
  messagingSenderId: "1056186017327",
  appId: "1:1056186017327:web:ebfa927c3f923a35"
};
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013

function preload(){
  dictionaryHalf1 = loadStrings("https://gist.githubusercontent.com/dlayres/5919e00889614b854092b86d76d55815/raw/6025c962aaa62766140a9ea0bfadba9dd4d07e61/dictHalf1.txt");
  dictionaryHalf2 = loadStrings("https://gist.githubusercontent.com/dlayres/de5c600219a07c1dd3a1589293cdf3b4/raw/51af4ebfea0538b55f5f43cc8dd9a5863dcadf97/dictHalf2.txt");
<<<<<<< HEAD
=======
  firebase.initializeApp(firebaseConfig);
  database = firebase.firestore();
  alertImg = loadImage("https://gist.githubusercontent.com/dlayres/c71fafd0b454a46cccc2543fc6ee5163/raw/c701f7a490436b84f34166414eed2591cedae3c3/alert.png");
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
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

  userPos = createVector(0, 0);

  // Tile letter distribution, blanks not yet implemented
  tilePossibilities = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
                       "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N",
                       "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U",
                       "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z"];

<<<<<<< HEAD
=======
  // Get preexisting tiles from database
  database.collection("tiles").get().then((query) => {
    query.forEach((doc) => {
      let tileLetter = doc.data().tileLetter;
      let xPosition = doc.data().xPosition;
      let yPosition = doc.data().yPosition;
      allTiles.push(new Tile(tileLetter, xPosition * gridSpacing + userPos.x, yPosition * gridSpacing + userPos.y, tileWidth));
      let lastIndex = allTiles.length - 1;
      allTiles[lastIndex].onBoard = true;
      allTiles[lastIndex].committedToBoard = true;
      allTiles[lastIndex].boardX = xPosition;
      allTiles[lastIndex].boardY = yPosition;
      occupiedPositions.push(createVector(xPosition, yPosition));
      committedPositions.push(createVector(xPosition, yPosition));
    });
  });

>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
  restingY = windowHeight - bottomPanelHeight + ((bottomPanelHeight - tileWidth) / 2);
  for(let i = 0; i < maxTiles; i++){
    tileRestingPositions.push(createVector((tileWidth + 10) * (i + 4), restingY));
    let tileLetter = tilePossibilities[Math.floor(Math.random() * tilePossibilities.length)];
    userTiles.push(new Tile(tileLetter, tileRestingPositions[i].x, tileRestingPositions[i].y, tileWidth));
    allTiles.push(userTiles[i]);
  }
}

function draw(){
  background(220);
  drawGrid(userPos);

  if(alertDebounce != 0){
    alertDebounce -= 1;
  }

  if(draggingTile){
    userTiles[draggingTileIndex].x = mouseX - dragOffsetX;
    userTiles[draggingTileIndex].y = mouseY - dragOffsetY;
  }

  strokeWeight(2);

  for(let i = 0; i < allTiles.length; i++){
    allTiles[i].drawTile();
  }

  circle(userPos.x, userPos.y, 10);
  rect(0, windowHeight - bottomPanelHeight, windowWidth, windowHeight - bottomPanelHeight);

  for(let i = 0; i < userTiles.length; i++){
    if(!userTiles[i].onBoard && i != draggingTileIndex){
      userTiles[i].x = tileRestingPositions[i].x;
      userTiles[i].y = tileRestingPositions[i].y;
      userTiles[i].drawTile();
    }
  }

  if(draggingTile){
    userTiles[draggingTileIndex].drawTile();
  }
<<<<<<< HEAD
=======

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
      tint(255, 255);
    }
  }
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  submitWordButton.position(20, windowHeight - 30);
  recallTilesButton.position(20, windowHeight - 60);
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
  if(alertDebounce != 0){
    canDrag = false;
  }
  else if(canDrag){
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

    let ableToPlace = true;
    if(tileScreenCenter.y > windowHeight - bottomPanelHeight){
      ableToPlace = false;
    }
    else{
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

      for(let i = 0; i < occupiedPositions.length; i++){
        if(occupiedPositions[i].x == tileBoardX && occupiedPositions[i].y == tileBoardY){
          ableToPlace = false;
          break;
        }
      }

      if(tileBoardX == tileOrigX && tileBoardY == tileOrigY){
        ableToPlace = true;
      }
    }


    if(!ableToPlace){
      draggingTile = false;
      userTiles[draggingTileIndex].x = tileRestingPositions[draggingTileIndex].x;
      userTiles[draggingTileIndex].y = tileRestingPositions[draggingTileIndex].y;
      userTiles[draggingTileIndex].onBoard = false;

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
      userTiles[draggingTileIndex].boardX = floorX / gridSpacing;
      userTiles[draggingTileIndex].boardY = floorY / gridSpacing;

      occupiedPositions.push(createVector(floorX / gridSpacing, floorY / gridSpacing));
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
        word = "";
        for(let i = 0; i < wordTiles.length; i++){
          word += wordTiles[i].letter;
        }
        wordList.push(word);

        for(let i = 0; i < tempBoardTiles.length; i++){
          let tile = tempBoardTiles[i];
          let tileX = tile.boardX;
          let tileY = tile.boardY;
          let tileAdjacencies = getVerticalAdjacencies([tile], [tileX], [tileY])[1];
          if(tileAdjacencies.length > 1){
            tileAdjacencies.sort((a, b) => (a.y > b.y) ? 1 : -1);
            let verticalWord = "";
            for(let j = 0; j < tileAdjacencies.length; j++){
              verticalWord += tileAdjacencies[j].letter;
            }
            wordList.push(verticalWord);
          }
        }

        for(let i = 0; i < wordList.length; i++){
          if(!checkDictionary(wordList[i])){
            sendAlert(wordList[i].toUpperCase() + " is not a valid word.");
            return;
          }
        }

        let successAlert = "";
        for(let i = 0; i < wordList.length - 1; i++){
          successAlert += (wordList[i].toUpperCase() + " played successfully.\n");
        }
        successAlert += (wordList[wordList.length - 1].toUpperCase() + " played successfully.");
        commitWord(tileIndices);
<<<<<<< HEAD
        sendAlert(successAlert);
=======
        //sendAlert(successAlert);
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
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
        word = "";
        for(let i = 0; i < wordTiles.length; i++){
          word += wordTiles[i].letter;
        }
        wordList.push(word);

        for(let i = 0; i < tempBoardTiles.length; i++){
          let tile = tempBoardTiles[i];
          let tileX = tile.boardX;
          let tileY = tile.boardY;
          let tileAdjacencies = getHorizontalAdjacencies([tile], [tileX], [tileY])[1];
          if(tileAdjacencies.length > 1){
            tileAdjacencies.sort((a, b) => (a.x > b.x) ? 1 : -1);
            let horizontalWord = "";
            for(let j = 0; j < tileAdjacencies.length; j++){
              horizontalWord += tileAdjacencies[j].letter;
            }
            wordList.push(horizontalWord);
          }
        }

        for(let i = 0; i < wordList.length; i++){
          if(!checkDictionary(wordList[i])){
            sendAlert(wordList[i].toUpperCase() + " is not a valid word.");
            return;
          }
        }

        let successAlert = "";
        for(let i = 0; i < wordList.length - 1; i++){
          successAlert += (wordList[i].toUpperCase() + " played successfully.\n");
        }
        successAlert += (wordList[wordList.length - 1].toUpperCase() + " played successfully.");
        commitWord(tileIndices);
<<<<<<< HEAD
        sendAlert(successAlert);
=======
        //sendAlert(successAlert);
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
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
<<<<<<< HEAD
  alert(msg);
  alertDebounce = debounceAmount;
=======
  // Alert should start by increasing in opacity
  displayAlert = "inc";
  alertMsg = msg;
  alertOpacity = 0;
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
}

function drawGrid(pos){
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
  for(let i = 0; i < indices.length; i++){
    userTiles[indices[i]].committedToBoard = true;
<<<<<<< HEAD
=======
    database.collection("tiles").add({
      tileLetter: userTiles[indices[i]].letter,
      xPosition: userTiles[indices[i]].boardX,
      yPosition: userTiles[indices[i]].boardY
    })
    .catch(function(error){
      console.error("Error adding document: " + error);
    })

>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
    let tileLetter = tilePossibilities[Math.floor(Math.random() * tilePossibilities.length)];
    userTiles[indices[i]] = new Tile(tileLetter, tileRestingPositions[i].x, tileRestingPositions[i].y, tileWidth);
    allTiles.push(userTiles[indices[i]]);
  }
  for(let i = 0; i < occupiedPositions.length; i++){
    committedPositions.push(occupiedPositions[i]);
  }
}
<<<<<<< HEAD
=======


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
>>>>>>> 41753561785b5b92a10e9a6dc1ed815ed83fe013
