class ItemType extends Element {
  #itemTypeName; // Use icon later
  #number;
  constructor(x, y, itemTypeName, number) {
    super(x, y);
    this.#itemTypeName = itemTypeName;
    this.#number = number;
  }

  render() {
    push();
    this._applyStyle();
    translate(this._x, this._y);
    this.#renderName();
    pop();
  }

  #renderName() {
    push();
    rectMode(CENTER);
    textSize(14);
    noStroke();
    fill(255);
    textFont("Helvetica");
    text(`${this.#itemTypeName}(${this.#number})`, 0, textAscent());
    pop();
  }

  contains(x, y) {
    return false;
  }
}
