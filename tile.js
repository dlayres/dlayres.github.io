class Tile{
  constructor(letter, x, y){
    this.width = 40;
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.onBoard = false;
    this.committedToBoard = false;
    this.boardX = 0;
    this.boardY = 0;
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
    text(this.letter, this.x + this.width / 4, this.y + this.width / 1.25);
  }
}
