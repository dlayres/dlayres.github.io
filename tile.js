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

  drawTile(img){
    let unplayedColor = color(214, 195, 152);
    let unplayedBlankColor = color(232, 216, 179);
    let playedColor = color(158, 128, 57);
    let playedBlankColor = color(184, 155, 86);

    if(this.committedToBoard){
      if(this.points == 0){
        fill(playedBlankColor);
      }
      else{
        fill(playedColor);
      }
    }
    else{
      if(this.points == 0){
        fill(unplayedBlankColor);
      }
      else{
        fill(unplayedColor);
      }
    }
    stroke(0, 0, 0);
    strokeWeight(2)
  //  square(this.x, this.y, this.width);

    fill(0, 0, 0);
    noStroke();
    if(this.letter != "BL"){
      textSize(this.width / 1.25);
      let letterWidth = textWidth(this.letter);
      let textBeginHorizontal = ((this.width - letterWidth) / 2);
    //  text(this.letter, this.x + textBeginHorizontal, this.y + this.width / 1.25);
    }
    if(this.points != 0){
      textSize(this.width / 4.5);
  //    text(this.points, this.x + this.width - 2 - textWidth(this.points.toString()), this.y + this.width - 4);
    }

    image(img, this.x + 1, this.y + 1, this.width - 2, this.width - 2);
  }
}
