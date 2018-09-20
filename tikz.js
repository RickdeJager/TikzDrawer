let ptikzCode = '';
let tikzShapeTranslateTable = {
	'circle':	'circle, ',
	'square':	' ',
	'triangle':	'regular polygon, regular polygon sides=3, '
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
	let tikzCode = '';
	//Define all colors we'll need.
	let colorList = buildColorList();
	tikzCode += colorList;
	//Cook up a list of nodes
	let tikzNodes = '';
	for (nodeIndex in nodeArray) {
		let node = nodeArray[nodeIndex];
		let draw = drawOrNot(node);
		if (node == null) {continue;}
		let label = genLabel(node);
		let size = genSize(node);
		let fill = genFill(node);
		let newEntry = '\\node['+draw+tikzShapeTranslateTable[node.shape]+
				size+label+fill+'] at ('+
				String((node.x*scl).toFixed(2))+', '+
				String(((height-node.y)*scl).toFixed(2))+') ('+
				String(nodeIndex)+')'+' {'+node.text+'};<br>';
		tikzNodes+=newEntry;
	}
	//Cook up a list of edges
	let tikzEdges = '';
	for (edge of linkArray) {
		var control = calculateControl(edge);
		let newEntry = '('+String(nodeArray.indexOf(edge.from))+')'+control+' ('+String(nodeArray.indexOf(edge.to))+')<br>';
		tikzEdges +=newEntry;
	}
	if (tikzEdges != '') {
		tikzEdges = '\\draw[-]<br>'+tikzEdges+';';
		tikzCode += tikzNodes+'<br><br>'+tikzEdges
	}else {
		tikzCode += tikzNodes;
	}
	if(tikzCode !==ptikzCode) { //Only update if changed, otherwise selection breaks
		tikzCodeOutput.html(tikzCode);
	}
	ptikzCode = tikzCode;
}

function drawOrNot(node) {
	if (node.drawBool) {
		return 'draw, ';
	}
	return '';
}

function genFill(node) {
	if (node.fillBool) {
		return ', fill='+node.fillColor.replace('#','')
	}
	return '';
}

function genLabel(node) {
	if (node.label != '') {
		return ', label='+node.label;
	}
	return '';
}

function calculateControl(edge) {
	if (edge.centerOffsetX == 0 && edge.centerOffsetY == 0) {
		return ' to ';
	}
	var x = (((edge.from.x + edge.to.x)/2 + edge.centerOffsetX) *scl).toFixed(4);
	var y = ((height - ((edge.from.y + edge.to.y)/2 + edge.centerOffsetY)) * scl).toFixed(4);
	return '.. controls ('+x+', '+y+') ..';

}

function buildColorList() {
	var htmlColorList = [];
	for (node of nodeArray) {
		if (!node) {continue;}
		if (!node.fillBool) {continue;}
		let nodeColor = node.fillColor;	
		if (htmlColorList.indexOf(nodeColor) != -1) {continue;}
		htmlColorList.push(nodeColor);
	}

	let tikzCodeString = '';
	for (entry of htmlColorList) {
		let htmlColor = entry.replace('#', '');
		tikzCodeString += '\\definecolor{'+htmlColor+'}{HTML}{'+htmlColor+'}<br>';
	}

	return tikzCodeString;
}

function genSize(node) {
	return "minimum size = " + String((node.size*scl).toFixed(2)) + "cm";
}
