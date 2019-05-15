var gridSizeSlider;
var tikzCodeOutput;
var nodeLabelBox;
var nodeTextBox;
var nodeSettingsDiv;
var nodeSizeBox;
var nodeHeightBox;
var nodeWidthBox;
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

	// Node Settings
	let label_node = createSpan("Node Label");
	let label_text = createSpan("Node Text");
	let label_size = createSpan("Node Size");
	let label_width = createSpan("Node Width");
	let label_height = createSpan("Node Height");

	nodeLabelBox = createInput();
	nodeLabelBox.id('nodeLabelBox');
	nodeLabelBox.class('nodeSetting');
	nodeLabelBox.input(nodeLabelChanged);

	nodeTextBox = createInput();
	nodeTextBox.id('nodeTextBox');
	nodeTextBox.class('nodeSetting');
	nodeTextBox.input(nodeTextChanged);

	nodeSizeBox = createInput('Node size', 'number');
	nodeSizeBox.id('nodeSizeBox');
	nodeSizeBox.class('nodeSetting');
	nodeSizeBox.changed(setSelectedNodeSize);

	nodeWidthBox = createInput('Node width', 'number');
	nodeWidthBox.class('nodeSetting width');
	nodeWidthBox.changed(setSelectedNodeWidth);

	nodeHeightBox = createInput('Node height', 'number');
	nodeHeightBox.class('nodeSetting height');
	nodeHeightBox.changed(setSelectedNodeHeight);

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

	label_node.parent('nodeSettings');
	nodeLabelBox.parent('nodeSettings');
	label_text.parent('nodeSettings');
	nodeTextBox.parent('nodeSettings');
	label_size.parent('nodeSettings');
	nodeSizeBox.parent('nodeSettings');
	label_width.parent('nodeSettings');
	nodeWidthBox.parent('nodeSettings');
	label_height.parent('nodeSettings');
	nodeHeightBox.parent('nodeSettings');
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
	if (! isANodeSelected()) {
		return;
	}

	let node = nodeArray[selectedNode];
	nodeSizeBox.value(node.size);
	nodeWidthBox.value(node.width);
	nodeHeightBox.value(node.height);
	nodeLabelBox.value(node.label);
	nodeTextBox.value(node.text);
	nodeShapeSelect.value(node.shape);
	nodeColorSelect.value(node.fillColor)
	nodeFillToggle.checked(node.fillBool);
	nodeDrawToggle.checked(node.drawBool);

	const container = document.getElementById("nodeSettings");
	if (node.shape == "rectangle") {
		// hide size - show width and height
		container.classList.add("rectangle");
	} else {
		// show size - hide width and height
		container.classList.remove("rectangle");
	}

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
	if (! isANodeSelected()) {
		return;
	}

	nodeArray[selectedNode].shape = this.value();

	const container = document.getElementById("nodeSettings");
	if (this.value() == "rectangle") {
		// hide size - show width and height
		container.classList.add("rectangle");
	} else {
		// show size - hide width and height
		container.classList.remove("rectangle");
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

function setSelectedNodeWidth() {
	if (! isANodeSelected()) {
		return;
	}

	nodeArray[selectedNode].width = int(this.value());
}

function setSelectedNodeHeight() {
	if (! isANodeSelected()) {
		return;
	}

	nodeArray[selectedNode].height = int(this.value());
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
