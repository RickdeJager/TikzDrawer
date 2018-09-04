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
let stickToGrid = true;
let gridSize = 80;

var gridSizeSlider;
var tikzCodeOutput;
var nodeLabelBox;
var nodeTextBox;
var nodeSettingsDiv;
var nodeSizeBox;
var nodeShapeSelect;

let shapeList = ['circle', 'triangle', 'square'];
let nodeShape = shapeList[0];

let pmouseIsPressed = false;
let lastMouseClickOnCanvas = false;
let ptikzCode = '';

let tikzShapeTranslateTable = {
	'circle':	'circle, ',
	'square':	' ',
	'triangle':	'regular polygon, regular polygon sides=3, '
}


function setup() {
	var can = createCanvas(width, height);
	can.parent('sketch');
	nodeSettingsDiv = select('#nodeSettings');
	nodeSettingsDiv.hide();
	frameRate(60);
	setupUI();
}

function draw() {
	background(238,238,238);
	fill(250, 100, 100);
	rect(width-deletionAreaWidth, 0, width, height); //background
	handleMoving();
	handleLinking();
	if(stickToGrid) {
		drawGrid();
		moveStuffToGridLines();
	}
	renderNodes();
	tikzExport();
	pmouseIsPressed = mouseIsPressed;

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

function drawNode(shape, size, x, y) {
	switch(shape) {
		case 'circle':
			ellipse(x, y, size);
			break;
		case 'square':
			rect(x-size/2, y-size/2, size, size);
			break;
		case 'triangle':
			//Too simple, but don't feel like doing math rn
			triangle(x-size/2, y+size/2, x+size/2, y+size/2, x, y-size/2);
			break;
		default:
			ellipse(x, y, size);
	}
}

function setupUI() {
	//Plot settings
	gridSetting = createCheckbox('Stick to grid', stickToGrid);
	gridSetting.id('checkboxDiv');
	gridSetting.changed(setGridSetting);

	gridSizeText = createSpan('Grid size:');
	gridSizeSlider = createSlider(10, 200, gridSize);
	gridSizeSlider.id('slider');

	gridSetting.parent('plotSettings')
	gridSizeText.parent('plotSettings')
	gridSizeSlider.parent('plotSettings')

	//Node Settings
	nodeLabelBox = createInput('Node Label');
	nodeLabelBox.id('nodeLabelBox');
	nodeLabelBox.attribute('placeholder', 'Node Label Text');
	nodeLabelBox.class('nodeSetting');
	nodeLabelBox.input(nodeLabelChanged);
	nodeTextBox = createInput('Node Text');
	nodeTextBox.id('nodeTextBox');
	nodeTextBox.attribute('placeholder', 'Node Text');
	nodeTextBox.class('nodeSetting');
	nodeTextBox.input(nodeTextChanged);
	nodeSizeBox = createInput('Node size', 'number');
	nodeSizeBox.id('nodeSizeBox');
	nodeSizeBox.class('nodeSetting');
	nodeSizeBox.changed(setSelectedNodeSize);
	nodeShapeSelect = createSelect();
	nodeShapeSelect.class('nodeSetting');
	for (shape of shapeList) {
		nodeShapeSelect.option(shape);
	}
	nodeShapeSelect.changed(setSelectedNodeShape);
	nodeLabelBox.parent('nodeSettings');
	nodeTextBox.parent('nodeSettings');
	nodeSizeBox.parent('nodeSettings');
	nodeShapeSelect.parent('nodeSettings');

	//Tikz Exporting
	tikzCodeOutput = createElement('p', 'Tikz will export to here!');
	tikzCodeOutput.id('tikzCode');
	tikzCodeOutput.parent('tikzDiv')
	}

function mouseClicked() {
	lastMouseClickOnCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
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

function nodeTextChanged() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].text = this.value();
	}
}

function nodeLabelChanged() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].label = this.value();
	}
}

function setSelectedNodeShape() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].shape = this.value();
	}
}

function setSelectedNodeSize() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].size = int(this.value());
	}
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

function genNode(xPos, yPos, text, label, size, shape) {
	var node = {
		x:xPos,
		y:yPos,
		text:text,
		label:label,
		size:size,
		shape, shape
	};
	return node;
}

function setGridSetting() {
	stickToGrid = this.checked();
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

function handleMoving() {
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
		}else {
			nodeFound = searchNodes(mouseX, mouseY);
			if(nodeFound[0] === -2) {
				if(mouseX >= width-deletionAreaWidth) {return;} //Nodes in this area get deleted, no use in making new ones here.
				addNode(mouseX, mouseY, '', '', nodeSize, nodeShape);
			}else if (nodeFound[0] != -1) {
				movingNode = nodeFound[0];
				movingOffset = nodeFound.slice(1,3);
			}
		}
	}else {
		movingNode = null;
	}
}

function addNode(xPos, yPos, text, label, size, shape) {
	nodeArray.push(genNode(xPos, yPos, text, label, size, shape));

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
				toggleLink(selectedNode, nodeFound[0]);
				selectedNode = null;
			}
		}
	
	}

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

function renderNodes() {
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

	for (index in nodeArray) {
		let node = nodeArray[index];
		if(node == null) {continue;}
		if (index == selectedNode) {fill(255,0,0);} else {fill(0,0,255);}
		strokeWeight(1);
		drawNode(node.shape, node.size, node.x, node.y);
		strokeWeight(2);
		textSize(24);
		fill(255);
		textAlign('center', 'bottom');
		text(node.label, node.x, node.y-node.size/1.9);
		textAlign('center', 'center');
		text(node.text, node.x, node.y);
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

function tikzExport() {
	/*
	 *Basic Tikz syntax:

	\begin{tikzfigure}
		\node[style options] (var-name){display-name};
		...
		\node[style options] (var-name){display-name};
		\draw[style options]
		(from-var) (to-var)
		...
		(from-var) (to-var)
		;
	\end{tikzfigure}
	 */
	//Cook up a list of nodes
	let tikzNodes = '';
	for (nodeIndex in nodeArray) {
		let node = nodeArray[nodeIndex];
		if (node == null) {continue;}
		let newEntry = '\\node[draw, '+tikzShapeTranslateTable[node.shape]+'minimum size='+String((node.size*scl).toFixed(2))+'cm, label='+node.label+'] at ('+String((node.x*scl).toFixed(2))+', '+String(((height-node.y)*scl).toFixed(2))+') ('+String(nodeIndex)+')'+' {'+node.text+'};<br>';
		tikzNodes+=newEntry;
	}
	//Cook up a list of edges
	let tikzEdges = '';
	for (linkListIndex in linkArray) {
		let linkList = linkArray[linkListIndex];
		for (to of linkList) {
			//Remove this check for directed edges
			if (to > linkListIndex) {
				let newEntry = '('+String(linkListIndex)+')'+'--('+String(to)+')<br>';
				tikzEdges +=newEntry;
			}
		}
	}
	let tikzCode = '';
	if (tikzEdges != '') {
		tikzEdges = '\\draw[-]<br>'+tikzEdges+';';
		tikzCode = tikzNodes+'<br><br>'+tikzEdges
	}else {
		tikzCode = tikzNodes;
	}
	if(tikzCode !==ptikzCode) { //Only update if changed, otherwise selection breaks
		tikzCodeOutput.html(tikzCode);
	}
	ptikzCode = tikzCode;
}
