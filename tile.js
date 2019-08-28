class Tile{
  constructor(letter, points, x, y, width){
    this.width = width;
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.onBoard = false;
    this.committedToBoard = false;
    this.boardX = -1;
    this.boardY = -1;
    this.points = points;
  }

  drawTile(){
    if(this.committedToBoard){
      fill(0, 0, 255);
    }
    else{
      fill(255, 0, 0);
    }
    square(this.x, this.y, this.width);
    fill(255, 255, 255);
    textSize(this.width / 1.25);
    let letterWidth = textWidth(this.letter);
    let textBeginHorizontal = ((this.width - letterWidth) / 2);
    text(this.letter, this.x + textBeginHorizontal, this.y + this.width / 1.25);
    textSize(this.width / 4.5);
    text(this.points, this.x + this.width - 2 - textWidth(this.points.toString()), this.y + this.width - 4);
  }
}
