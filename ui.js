var gridSizeSlider;
var tikzCodeOutput;
var nodeLabelBox;
var nodeTextBox;
var nodeSettingsDiv;
var nodeSizeBox;
var nodeShapeSelect;

let shapeList = ['circle', 'triangle', 'square'];
let nodeShape = shapeList[0];

function setupUI() {
	//Plot settings
	gridSetting = createCheckbox('Snap to grid', snapToGrid);
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
