// Colors
const HOVER_COLOR = [202, 255, 253];
const COLOR_1 = [66, 116, 187];
const COLOR_2 = [132, 207, 226];

// Layers
const layer1 = new Layer(4, 6, [
  new Element(2, 0, 2, 3),
  new Element(0, 2, 1, 1),
]);
const layer2 = new Layer(4, 6, [
  new Element(2, 0, 1, 2, (style = { fill: COLOR_2 }), (level = 1)),
  new Element(0, 2, 1, 1, (style = { fill: COLOR_2 }), (level = 1)),
]);

const map = new Map(null, null, null, [layer1, layer2]);

let prevHoveredElement = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30, 61, 116);
  map.render();
  // frameRate(5);
}

function draw() {
  handleHover();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(30, 61, 116);
  map.render();
}
