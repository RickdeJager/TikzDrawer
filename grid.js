let gridSize = 80;
let snapToGrid = true;

function snapToGrid() {
	// Let's not move stuff while the user is interacting
	if (mouseIsPressed) {
		return;
	}

	for (node of nodeArray) {
		if (node == null) {
			continue;
		}

		// Move to the closest grid intersection
		destinationX = roundToGridSize((width % gridSize)/2, node.x);
		destinationY = roundToGridSize((height % gridSize)/2, node.y);

		// Are we close enough to the destination?
		if (dist(node.x, node.y, destinationX, destinationY) <= moveAmount) {
			// Just place it there
			node.x = destinationX;
			node.y = destinationY;
		} else {
			// Move it a little bit in the right direction
			dx = Math.abs(node.x - destinationX)
			dy = Math.abs(node.y - destinationY)
			ratioX = map(dx, 0, dx + dy, 0, 1);
			ratioY = map(dy, 0, dx + dy, 0, 1);
			node.x -= Math.sign(node.x - destinationX) * moveAmount * ratioX;
			node.y -= Math.sign(node.y - destinationY) * moveAmount * ratioY;
		}
	}

}

function roundToGridSize(offset, value) {
	let rounded = Math.round((value - offset) / gridSize) * gridSize;
	return rounded + offset;
}

function drawGrid() {
	gridSize = gridSizeSlider.value();
	stroke(125);
	strokeWeight(1);

	// vertical lines
	offset = (width % gridSize) / 2
	for (let i = 0; i < width; i += gridSize) {
		line(i + offset, 0, i + offset, height);
	}

	// horizontal lines - offset is the distance between the top border and the
	// first line
	offset = (height % gridSize) / 2
	for (let i = 0; i < height; i += gridSize) {
		line(0, i + offset, width, i + offset);
	}
}

function setGridSetting() {
	snapToGrid = this.checked();
}
