class Tile{
  constructor(letter){
    this.width = 40;
    this.letter = letter;
  }

  drawTile(x, y){
    fill(255, 0, 0);
    square(x, y, this.width);
    fill(255, 255, 255);
    textSize(this.width / 1.25);
    text(this.letter, x + this.width / 4, y + this.width / 1.25);
  }
}
