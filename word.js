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

function preload(){
  dictionaryHalf1 = loadStrings("https://gist.githubusercontent.com/dlayres/5919e00889614b854092b86d76d55815/raw/6025c962aaa62766140a9ea0bfadba9dd4d07e61/dictHalf1.txt");
  dictionaryHalf2 = loadStrings("https://gist.githubusercontent.com/dlayres/de5c600219a07c1dd3a1589293cdf3b4/raw/51af4ebfea0538b55f5f43cc8dd9a5863dcadf97/dictHalf2.txt");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  dictionary = dictionaryHalf1.concat(dictionaryHalf2);
  submitWordButton = createButton("Submit Word");
  submitWordButton.position(20, windowHeight - 30);
  userPos = createVector(0, 0);
  gridSpacing = 100;
  scrollFactor = 0.015;

  // Tile letter distribution, blanks not yet implemented
  tilePossibilities = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
                       "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N",
                       "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U",
                       "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z"];

  userTiles = [];
  for(let i = 0; i < 7; i++){
    userTiles.push(new Tile(tilePossibilities[Math.floor(Math.random() * tilePossibilities.length)]));
  }
}

function draw(){
  background(220);
  drawGrid(userPos);
  strokeWeight(2);
  rect(0, windowHeight - 50, windowWidth, windowHeight - 50);
  for(let i = 0; i < userTiles.length; i++){
    userTiles[i].drawTile(100 * (i + 2), windowHeight - 45);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  submitWordButton.position(20, windowHeight - 30);
}

function mouseWheel(event){
  scrollChange = event.delta * scrollFactor * gridSpacing * scrollFactor;
  gridSpacing -= scrollChange;
  gridSpacing = constrain(gridSpacing, 20, 200);
}

function mouseDragged(event){
  if(canDrag){
    userPos.add(createVector(event.movementX, event.movementY));
  }
}

function mousePressed(){
  if(mouseY > windowHeight - 50){
    canDrag = false;
  }
}

function mouseReleased(){
  canDrag = true;
}

function checkDictionary(word){
  return dictionary.includes(word.toUpperCase());
}

function drawGrid(pos){
  strokeWeight(gridSpacing * scrollFactor);
  for(let i = userPos.x + floor(windowWidth / 2) + gridSpacing; i < windowWidth; i+=gridSpacing){
    line(i, 0, i, windowHeight - 50);
  }
  for(let i = userPos.x + floor(windowWidth / 2); i > -windowWidth; i-=gridSpacing){
    line(i, 0, i, windowHeight - 50);
  }
  for(let j = userPos.y + floor(windowHeight / 2) + gridSpacing; j < windowHeight - 50; j+=gridSpacing){
    line(0, j, windowWidth, j);
  }
  for(let j = userPos.y + floor(windowHeight / 2); j > -windowHeight; j-=gridSpacing){
    line(0, j, windowWidth, j);
  }
}
