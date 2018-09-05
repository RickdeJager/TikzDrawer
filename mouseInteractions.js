let pmouseIsPressed = false;
let holdingRightClick = false;
let pMarked = false;
let movingEdge = null;
let lastMouseClickOnCanvas = false;

function mouseStuff() {
	handleLinking();
	handleMoving();
	pmouseIsPressed = mouseIsPressed;
}

function mouseReleased() {
	pMarked = false;
	holdingRightClick = false;
}

function mouseClicked() {
	lastMouseClickOnCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function handleLinking() {
	if(mouseIsPressed && mouseButton == 'right') {
		nodeFound = searchNodes(mouseX, mouseY);
		if (nodeFound[0] < 0) {
			if (!pmouseIsPressed) { //If the user clicks on empty space, unselect
				selectedNode = null;
				nodeSettingsDiv.hide();
			}
		}else if(nodeFound[0] != selectedNode) { //Second check makes sure the next frame doesn't link the node to itself.
			if(!selectedNode) {
				selectedNode = nodeFound[0];
				setNodeInfo();
			}else {
				if(!holdingRightClick) { //If the node was clicked, highlight without linking
					selectedNode = nodeFound[0];
					setNodeInfo();
					return;
				}
				toggleLink(nodeArray[selectedNode], nodeArray[nodeFound[0]]);
				selectedNode = null;
			}
		}
		//RightClick has been held for at least this frame, set it to true
		holdingRightClick = true;
	}
}

function handleMoving() {
	nodeFound = searchNodes(mouseX, mouseY);
	if(mouseIsPressed && mouseButton == 'left') {
		if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
			return;	
		}
		if(movingNode) {
			nodeArray[movingNode].x = mouseX + movingOffset[0];
			nodeArray[movingNode].y = mouseY + movingOffset[1];
			if (mouseX >= width-deletionAreaWidth) {
				deleteNode(movingNode);
				movingNode = null;
			}
		}else if((marked || pMarked) && nodeFound < 0) {
			var edge = findMarkedEdge();
			if (edge == null || (pMarked && movingEdge)) {
				edge = movingEdge;
			}else {
				movingEdge = edge;
			}
			pMarked = true;
			edge.centerOffsetX += mouseX-pmouseX;
			edge.centerOffsetY += mouseY-pmouseY;
		}else {
			if(nodeFound[0] === -2) {
				if(mouseX >= width-deletionAreaWidth) {return;} //Nodes in this area get deleted, no use in making new ones here.
				addNode(mouseX, mouseY, '', '', nodeSize, nodeShape, '#0000ff');
			}else if (nodeFound[0] != -1) {
				movingNode = nodeFound[0];
				movingOffset = nodeFound.slice(1,3);
			}
		}
	}else {
		movingNode = null;
	}
} 
