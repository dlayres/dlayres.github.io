// Word dictionary from http://scrabutility.com/TWL06.txt
// Split in half between two github gists

let dictionaryHalf1;
let dictionaryHalf2;
let dictionary;
let submitWordButton;
let userPos;
let gridSpacing;
let scrollFactor;
let userTiles;
let tilePossibilities;
let canDrag = true;
let draggingTile = false;
let draggingTileIndex;
let dragOffsetX;
let dragOffsetY;
let tileRestingPositions;
let alertDebounce = 0;
let debounceAmount = 15;

function preload(){
  dictionaryHalf1 = loadStrings("https://gist.githubusercontent.com/dlayres/5919e00889614b854092b86d76d55815/raw/6025c962aaa62766140a9ea0bfadba9dd4d07e61/dictHalf1.txt");
  dictionaryHalf2 = loadStrings("https://gist.githubusercontent.com/dlayres/de5c600219a07c1dd3a1589293cdf3b4/raw/51af4ebfea0538b55f5f43cc8dd9a5863dcadf97/dictHalf2.txt");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  dictionary = dictionaryHalf1.concat(dictionaryHalf2);
  submitWordButton = createButton("Submit Word");
  submitWordButton.position(20, windowHeight - 30);
  submitWordButton.mousePressed(checkWord);
  userPos = createVector(0, 0);
  gridSpacing = 40;
  scrollFactor = 0.015;

  tileRestingPositions = [];

  // Tile letter distribution, blanks not yet implemented
  tilePossibilities = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
                       "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N",
                       "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U",
                       "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z"];

  userTiles = [];
  for(let i = 0; i < 7; i++){
    tileRestingPositions.push(createVector(100 * (i + 2), windowHeight - 45));
    let tileLetter = tilePossibilities[Math.floor(Math.random() * tilePossibilities.length)];
    userTiles.push(new Tile(tileLetter, tileRestingPositions[i].x, tileRestingPositions[i].y));
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

  for(let i = 0; i < userTiles.length; i++){
    userTiles[i].drawTile();
  }

  rect(0, windowHeight - 50, windowWidth, windowHeight - 50);
  circle(userPos.x, userPos.y, 10);

  for(let i = 0; i < userTiles.length; i++){
    if(!userTiles[i].onBoard){
      userTiles[i].drawTile();
    }
  }

  if(draggingTile){
    userTiles[draggingTileIndex].drawTile();
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  submitWordButton.position(20, windowHeight - 30);
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
    for(let i = 0; i < userTiles.length; i++){
      if(userTiles[i].onBoard){
        userTiles[i].x += event.movementX;
        userTiles[i].y += event.movementY;
      }
    }
  }
}

function mousePressed(){
  if(mouseY > windowHeight - 50){
    canDrag = false;
  }
  for(let i = 0; i < userTiles.length; i++){
    if(!userTiles[i].committedToBoard && mouseX > userTiles[i].x && mouseX < userTiles[i].x + userTiles[i].width && mouseY > userTiles[i].y && mouseY < userTiles[i].y + userTiles[i].width){
      draggingTile = true;
      draggingTileIndex = i;
      dragOffsetX = mouseX - userTiles[i].x;
      dragOffsetY = mouseY - userTiles[i].y;
      break;
    }
  }
  if(draggingTile){
    canDrag = false;
  }
  else{
    canDrag = true;
  }
}

function mouseReleased(){
  canDrag = true;

  if(draggingTile){
    let tileWidth = userTiles[draggingTileIndex].width;
    let tileScreenCenter = createVector(userTiles[draggingTileIndex].x + tileWidth / 2, userTiles[draggingTileIndex].y + tileWidth  / 2);
    let tileOffsetCenter = p5.Vector.sub(tileScreenCenter, userPos);

    if(tileScreenCenter.y > windowHeight - 50){
      draggingTile = false;
      userTiles[draggingTileIndex].x = tileRestingPositions[draggingTileIndex].x;
      userTiles[draggingTileIndex].y = tileRestingPositions[draggingTileIndex].y;
      userTiles[draggingTileIndex].onBoard = false;
    }
    else{
      checkTileX = tileOffsetCenter.x;
      checkTileY = tileOffsetCenter.y;
      floorX = checkTileX - checkTileX % 10;
      floorY = checkTileY - checkTileY % 10;
      while(floorX % gridSpacing != 0){
        floorX -= 10;
      }
      while(floorY % gridSpacing != 0){
        floorY -= 10;
      }

      userTiles[draggingTileIndex].x = floorX + userPos.x;
      userTiles[draggingTileIndex].y = floorY + userPos.y;
      userTiles[draggingTileIndex].onBoard = true;
    }
    draggingTile = false;
  }
}


function checkWord(){
  // tiles on board
  let tilesOnBoard = [];
  let tileIndices = [];
  for(let i = 0; i < userTiles.length; i++){
    if(userTiles[i].onBoard && !userTiles[i].committedToBoard){
      tilesOnBoard.push(userTiles[i]);
      tileIndices.push(i);
    }
  }

  if(tilesOnBoard.length == 0){
    sendAlert("You haven't placed any tiles on the board.");
    return;
  }

  tilesOnBoard.sort((a, b) => (a.x > b.x) ? 1 : -1);

  // check horizontal plausibility
  let validHorizontal = true;
  // first check if all on same y position
  let tileY = tilesOnBoard[0].y;
  for(let i = 0; i < tilesOnBoard.length; i++){
    if(tilesOnBoard[i].y != tileY){
      validHorizontal = false;
    }
  }
  if(validHorizontal){
    // still plausible, check adjacency
    for(let i = 0; i < tilesOnBoard.length - 1; i++){
      if(tilesOnBoard[i + 1].x - tilesOnBoard[i].x != gridSpacing){
        validHorizontal = false;
      }
    }
  }
  if(validHorizontal){
    // definitely horizontal, construct word
    word = "";
    for(let i = 0; i < tilesOnBoard.length; i++){
      word += tilesOnBoard[i].letter;
    }
    // submit word
    if(checkDictionary(word)){
      for(let i = 0; i < tileIndices.length; i++){
        userTiles[tileIndices[i]].committedToBoard = true;
      }
      sendAlert(word.toUpperCase() + " played successfully.")
    }
    else{
      sendAlert(word.toUpperCase() + " is not a valid word.");
    }
    return;
  }

  tilesOnBoard.sort((a, b) => (a.y > b.y) ? 1 : -1);
  // check vertical plausibility
  let validVertical = true;
  // first check if all on same x position
  let tileX = tilesOnBoard[0].x;
  for(let i = 0; i < tilesOnBoard.length; i++){
    if(tilesOnBoard[i].x != tileX){
      validVertical = false;
    }
  }
  if(validVertical){
    // still plausible, check adjacency
    for(let i = 0; i < tilesOnBoard.length - 1; i++){
      if(tilesOnBoard[i + 1].y - tilesOnBoard[i].y != gridSpacing){
        validVertical = false;
      }
    }
  }
  if(validVertical){
    // definitely vertical, construct word
    word = "";
    for(let i = 0; i < tilesOnBoard.length; i++){
      word += tilesOnBoard[i].letter;
    }
    // submit word
    if(checkDictionary(word)){
      for(let i = 0; i < tileIndices.length; i++){
        userTiles[tileIndices[i]].committedToBoard = true;
      }
      sendAlert(word.toUpperCase() + " played successfully.")
    }
    else{
      sendAlert(word.toUpperCase() + " is not a valid word.");
    }
    return;
  }

  sendAlert("Your tiles are not in a valid configuration.");
}


function checkDictionary(word){
  return dictionary.includes(word.toUpperCase());
}

function sendAlert(msg){
  alert(msg);
  alertDebounce = debounceAmount;
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
