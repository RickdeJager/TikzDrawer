let pmouseIsPressed = false;
let holdingRightClick = false;
let pMarked = false;
let movingEdge = null;
let lastMouseClickOnCanvas = false;

function mouseStuff() {
	if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}
	handleLinking();
	handleNodeSelection();
	var movedNode = false;
	//Only move nodes if we aren't bending an edge already
	if (!pMarked) {
		movedNode = handleNodeMovement();
	}
	var movedEdge = false;
	if (!movedNode) {
		movedEdge = handleEdgeBending()
		if (! handleNodeSelection()) {
			//If there is no node to select, try the edges
			handleEdgeSelection();
		}
	}
	if (!movedEdge) {
		handleNodeCreation();
	}
	pmouseIsPressed = mouseIsPressed;
}

function mouseReleased() {
	pMarked = false;
	holdingRightClick = false;
	movingNode = null;
}

function mouseClicked() {
	lastMouseClickOnCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function handleLinking() {
	previewEdge = null;
	if(mouseIsPressed && mouseButton == 'right') {
		nodeFound = searchNodes(mouseX, mouseY);
		if (nodeFound[0] < 0) {
			if (!pmouseIsPressed) { //If the user clicks on empty space, unselect
				selectedNode = null;
				closeNodeNav()
				closeEdgeNav()
			}
			if (holdingRightClick && selectedNode) {
				previewEdge = [mouseX, mouseY, nodeArray[selectedNode].x, nodeArray[selectedNode].y]
			}
		}else if(nodeFound[0] != selectedNode && selectedNode) { //check makes sure the next frame doesn't link the node to itself.
			if(!holdingRightClick) { //If the node was clicked, highlight without linking
				selectedNode = nodeFound[0];
				setNodeInfo();
				return;
			}
			toggleLink(nodeArray[selectedNode], nodeArray[nodeFound[0]]);
			selectedNode = null;
		}
		//RightClick has been held for at least this frame, set it to true
		holdingRightClick = true;
	}
}

function handleEdgeBending() {
	nodeFound = searchNodes(mouseX, mouseY);
	if(mouseIsPressed && mouseButton == 'left') {
		if(marked || pMarked) {
			var edge = findMarkedEdge();
			if (edge == null || (pMarked && movingEdge)) {
				edge = movingEdge;
			}else {
				movingEdge = edge;
			}
			pMarked = true;
			edge.centerOffsetX += mouseX-pmouseX;
			edge.centerOffsetY += mouseY-pmouseY;
			return true;
		}
	}
	return false;
}

function handleNodeCreation() {
	if(mouseIsPressed && mouseButton == 'left' && !movingNode) {
		nodeFound = searchNodes(mouseX, mouseY);
		if(nodeFound[0] === -2) {
			// Nodes in this area get deleted, no use in making new
			// ones here.
			if (mouseX >= width-deletionAreaWidth) {
				return;
			}
			addNode(mouseX, mouseY, '', '', nodeSize, nodeShape, '#0000ff');
			movingNode = nodeArray.length-1;
			return true;
		}
	}
}

function handleNodeMovement() {
	if (!mouseIsPressed || mouseButton != 'left') {
		return false;
	}

	if (movingNode) {
		nodeArray[movingNode].x = mouseX + movingOffset[0];
		nodeArray[movingNode].y = mouseY + movingOffset[1];
		if (mouseX >= width-deletionAreaWidth) {
			deleteNode(movingNode);
			movingNode = null;
		}
		return true;
	}

	nodeFound = searchNodes(mouseX, mouseY);
	if (nodeFound[0] < 0) {
		return false;
	}

	movingNode = nodeFound[0];
	movingOffset = nodeFound.slice(1,3);
	return true;
}

function handleEdgeSelection() {
	if (!mouseIsPressed || mouseButton != 'right') {
		return true;
	}

	markedEdge = findMarkedEdge();
	if (markedEdge) {
		openEdgeNav();
		return true;
	}

	closeEdgeNav();
	return true;
}

function handleNodeSelection() {
	if(mouseIsPressed && mouseButton == 'right') {
		nodeFound = searchNodes(mouseX, mouseY);

		if (nodeFound[0] < 0 && !pmouseIsPressed) {//If the user clicks on empty space, unselect
			selectedNode = null;
			closeNodeNav()
		} else if (nodeFound[0] >= 0) {
			selectedNode = nodeFound[0];
			setNodeInfo();
			return true;
		}
	}
	return false;
}
