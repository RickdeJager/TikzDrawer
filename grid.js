let gridSize = 80;
let stickToGrid = true;

function moveStuffToGridLines() {
	if(mouseIsPressed) {
		return; //Let's not move stuff while the user is interacting.
	}

	for (node of nodeArray) {
		if (node == null) {continue;}
		destinationX = (width%gridSize)/2 + Math.round((node.x-(width%gridSize)/2)/gridSize)*gridSize; //Offset+rounded(only full grid) to the next gridPoint.
		destinationY = (height%gridSize)/2 + Math.round((node.y-(height%gridSize)/2)/gridSize)*gridSize;
		if (dist(node.x, node.y, destinationX, destinationY) <= moveAmount) { //If we're close to the destination, just place it there
			node.x = destinationX;
			node.y = destinationY;
		}else {
			ratioX = map(Math.abs(node.x-destinationX), 0, Math.abs(node.x-destinationX)+Math.abs(node.y-destinationY), 0, 1);
			ratioY = map(Math.abs(node.y-destinationY), 0, Math.abs(node.x-destinationX)+Math.abs(node.y-destinationY), 0, 1);
			node.x -= Math.sign(node.x-destinationX)*moveAmount*ratioX;
			node.y -= Math.sign(node.y-destinationY)*moveAmount*ratioY;
		}
	}

}

function drawGrid() {
	gridSize = gridSizeSlider.value();
	stroke(125);
	strokeWeight(1);
	for (var i=(width%gridSize)/2; i < width + (width%gridSize)/2; i+=gridSize) {
		line(i, 0, i, height);	
	}
	for (var i=(height%gridSize)/2; i < height + (height%gridSize)/2; i+=gridSize) {
		line(0, i, width, i);	
	}
}

function setGridSetting() {
	stickToGrid = this.checked();
}
