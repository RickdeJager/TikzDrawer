function render() {
	background(238,238,238);
	fill(250, 100, 100);
	rect(width-deletionAreaWidth, 0, width, height); //background
	if(stickToGrid) {
		drawGrid();
		moveStuffToGridLines();
	}
	renderEdges();
	renderNodes();
}


function renderNodes() {
	for (index in nodeArray) {
		let node = nodeArray[index];
		if(node == null) {continue;}
		if (index == selectedNode) {fill(255,0,0);} else {fill(0,0,255);}
		node.draw();		
	}
}

function renderEdges() {
	stroke(0);
	strokeWeight(3);
	for (index in linkArray) {
		let linkList = linkArray[index];
		let from = nodeArray[index];
		for (nodeIndex of linkList) {
			let to = nodeArray[nodeIndex];
			line(from.x, from.y, to.x, to.y);
		}
	}
}
