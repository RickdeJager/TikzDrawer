var marked = false;
function render() {
	stroke(0);
	strokeWeight(0);
	background(238, 238, 238);
	fill(250, 100, 100);
	rect(width - deletionAreaWidth, 0, width, height); //background
	if (snapToGrid) {
		drawGrid();
		snapNodesToGrid();
	}
	renderEdges();
	renderNodes();
}


function renderNodes() {
	for (index in nodeArray) {
		let node = nodeArray[index];
		if (node == null) {
			continue;
		}

		if (index == selectedNode) {
			node.highlight();
		}
		node.draw();
	}
}

function renderEdges() {
	marked = false;
	for (link of linkArray) {
		link.draw();
	}
}
