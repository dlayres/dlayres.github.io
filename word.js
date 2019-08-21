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

  userTiles = [];
  userTiles.push(new Tile("A"));
  userTiles.push(new Tile("B"));
}

function draw(){
  background(220);
  line(0, windowHeight - 50, windowWidth, windowHeight - 50);
  drawGrid(userPos);
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
  userPos.add(createVector(event.movementX, event.movementY));
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
  for(let j = userPos.y + floor(windowHeight / 2); j > -windowHeight && j < windowHeight - 50; j-=gridSpacing){
    if(j > windowHeight - 50){
      continue;
    }
    line(0, j, windowWidth, j);
  }
}
