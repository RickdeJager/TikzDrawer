var gridSizeSlider;
var tikzCodeOutput;
var nodeLabelBox;
var nodeTextBox;
var nodeSettingsDiv;
var nodeSizeBox;
var nodeShapeSelect;
var nodeFillToggle;
var nodeDrawToggle;

let shapeList = ['circle', 'triangle', 'square', 'rectangle'];
let nodeShape = shapeList[0];

function setupUI() {
	//Plot settings
	gridSetting = createCheckbox('Snap to grid', snapToGrid);
	gridSetting.id('checkboxDiv');
	gridSetting.changed(setGridSetting);

	gridSizeText = createSpan('Grid size:');
	gridSizeSlider = createSlider(10, 200, gridSize);
	gridSizeSlider.id('slider');

	gridSetting.parent('plotSettings');
	gridSizeText.parent('plotSettings');
	gridSizeSlider.parent('plotSettings');

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

	nodeColorSelect = createColorPicker('#0000ff');
	nodeColorSelect.class('nodeSetting');
	nodeColorSelect.changed(setSelectedNodeColor);

	nodeFillToggle = createCheckbox('Fill', true);
	nodeFillToggle.class('nodeSetting');
	nodeFillToggle.changed(setSelectedNodeFill);

	nodeDrawToggle = createCheckbox('Border', true);
	nodeDrawToggle.class('nodeSetting');
	nodeDrawToggle.changed(setSelectedNodeDraw);

	nodeLabelBox.parent('nodeSettings');
	nodeTextBox.parent('nodeSettings');
	nodeSizeBox.parent('nodeSettings');
	nodeShapeSelect.parent('nodeSettings');
	nodeColorSelect.parent('nodeSettings');
	nodeFillToggle.parent('nodeSettings');
	nodeDrawToggle.parent('nodeSettings');

	// Tikz Exporting
	tikzCodeOutput = createElement('p', 'Tikz will export to here!');
	tikzCodeOutput.id('tikzCode');

	let copyButton = createButton("Copy to clipboard");
	copyButton.mousePressed(_ => {
		// Adapted from: https://gist.githubusercontent.com/Chalarangelo/4ff1e8c0ec03d9294628efbae49216db/raw/cbd2d8877d4c5f2678ae1e6bb7cb903205e5eacc/copyToClipboard.js
		// Create a textarea containing the tikz code
		const el = document.createElement("textarea");
		el.value = document.getElementById("tikzCode").innerText;

		// Hide the textarea from the user
		el.setAttribute("readonly", "");
		el.style.position = "absolute";
		el.style.left = "-9999px";

		// Add it to the document
		document.body.appendChild(el);

		// Save user selection so we can restore it later
		const selected = document.getSelection().rangeCount > 0 && document.getSelection().getRangeAt(0);

		// Select the textarea and copy the content
		el.select();
		document.execCommand("copy");

		// Clean up - remove the textarea and restore selection
		document.body.removeChild(el);
		if (selected) {
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(selected);
		}
	});

	copyButton.parent("tikzDiv");
	tikzCodeOutput.parent("tikzDiv");
}

function setNodeInfo() {
	if(!isANodeSelected()){
		return;
	}

	let node = nodeArray[selectedNode];
	nodeSizeBox.value(node.size);
	nodeLabelBox.value(node.label);
	nodeTextBox.value(node.text);
	nodeShapeSelect.value(node.shape);
	nodeColorSelect.value(node.fillColor)
	nodeFillToggle.checked(node.fillBool);
	nodeDrawToggle.checked(node.drawBool);
	openNodeNav();
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

function setSelectedNodeColor() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].fillColor = this.value();
	}
}

function setSelectedNodeSize() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].size = int(this.value());
	}
}

function setSelectedNodeFill() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].fillBool = nodeFillToggle.checked();
	}
}

function setSelectedNodeDraw() {
	if (isANodeSelected()) {
		nodeArray[selectedNode].drawBool = nodeDrawToggle.checked();
	}
}
