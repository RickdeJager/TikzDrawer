/*
 * Big ol' List 'a bugs and TODO's 
 * 	-Hitboxes always assume circle, needs a switch case
 */

const width = 595; //A4 format
const height = 842;
const nodeSize = 45;
const moveAmount = 4;
const deletionAreaWidth = 20;
const scl = 13.7085/width; //Useable space in cm devided by width [cm/px]
let nodeArray = [];
let linkArray = [];
let selectedNode = null;
let movingNode = null;
let movingOffset = null;

function setup() {
	var can = createCanvas(width, height);
	can.parent('sketch');
	nodeSettingsDiv = select('#nodeSettings');
	nodeSettingsDiv.hide();
	frameRate(60);
	setupUI();
}

function draw() {
	mouseStuff();
	render();
	tikzExport();

}

function keyPressed() {
	if(!lastMouseClickOnCanvas) {
		return;
	}

	if(key == 'x' || keyCode == 46) { //x or delete
		if(isANodeSelected()) {
			deleteNode(selectedNode);
		}
	}else if (key == 'H' || keyCode === LEFT_ARROW) {
		if(isANodeSelected()) {
			nodeArray[selectedNode].x -=gridSize;
		}
	}else if (key == 'L' || keyCode === RIGHT_ARROW) {
		if(isANodeSelected()) {
			nodeArray[selectedNode].x +=gridSize;
		}
	}else if (key == 'K' || keyCode === UP_ARROW) {
		if(isANodeSelected()) {
			nodeArray[selectedNode].y -=gridSize;
		}
	}else if (key == 'J' || keyCode === DOWN_ARROW) {
		if(isANodeSelected()) {
			nodeArray[selectedNode].y +=gridSize;
		}
	}
}


function setNodeInfo() {
	if(!isANodeSelected()){return;}
	let node = nodeArray[selectedNode];
	nodeSizeBox.value(node.size);
	nodeLabelBox.value(node.label);
	nodeTextBox.value(node.text);
	nodeShapeSelect.value(node.shape);
	nodeSettingsDiv.show();
}


function isANodeSelected(){
	if (!selectedNode) {
		return false;
	}
	if (!nodeArray[selectedNode]) {
		return false;
	}
	return true;
}

function addNode(xPos, yPos, text, label, size, shape) {
	nodeArray.push(new Node(xPos, yPos, text, label, size, shape));

}

function toggleLink(from, to) {
	if(linkArray[from] && linkArray[to]) {
		if(linkArray[from].includes(to) || linkArray[to].includes(from)){
			deleteLink(from, to);
			return;
		}
	}
	addLink(from, to);
}

function deleteLink(from, to) {
	linkArray[to].splice(linkArray[to].indexOf(from), 1);
	linkArray[from].splice(linkArray[from].indexOf(to), 1);
}

//Doesn't actually delete, but rather erases all links and set's the nodes coords to null
function deleteNode(nodeIndex) {
	if(nodeIndex == selectedNode) {
		selectedNode = null;
	}
	nodeArray[nodeIndex] = null;
	if(linkArray[nodeIndex]) {
		for (index of linkArray[nodeIndex]) {
			for (linkList of linkArray) {
				if(!linkList || linkList.length <= 0) {continue;}
				let maybeIndex = linkList.indexOf(nodeIndex);
				if(maybeIndex != -1) {
					linkList.splice(maybeIndex, 1);
				}
			}
		}
		linkArray[nodeIndex] = [];
	}
}

function addLink(from, to) {
	if(linkArray[from]) {
		linkArray[from].push(to);
	}else {
		linkArray[from] = [to];
	}

	if(linkArray[to]) {
		linkArray[to].push(from);
	}else {
		linkArray[to] = [from];
	}
}

function searchNodes(x, y) {
	for (index in nodeArray) {
		let node = nodeArray[index];
		if (node == null) {continue;}
		if( dist(node.x, node.y, x, y) <= node.size/2) {
			return [index, node.x-x, node.y-y]; //Found and exact match!
		}
		if( dist(node.x, node.y, x, y) <= node.size/2 + nodeSize/2) { //nodeSize is the size of the new node
			return [-1]; //No exact match, but still too close to place a node here.
		}
	}
	return [-2]; //No node found!
}
