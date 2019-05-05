let ptikzCode = '';

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
	// Define all colors we'll need.
	let colorList = buildColorList();
	tikzCode += colorList;

	// Cook up a list of nodes
	let tikzNodes = '';
	for (index in nodeArray) {
		let node = nodeArray[index];
		if (node == null) {
			continue;
		}

		tikzNodes += node.generateTikz(index);
	}

	// Cook up a list of edges
	let tikzEdges = '';
	for (edge of linkArray) {
		var control = calculateControl(edge);
		let newEntry = '('+String(nodeArray.indexOf(edge.from))+')'+control+' ('+String(nodeArray.indexOf(edge.to))+')<br>';
		tikzEdges +=newEntry;
	}
	if (tikzEdges != '') {
		tikzEdges = '\\draw[-]<br>'+tikzEdges+';';
		tikzCode += tikzNodes+'<br><br>'+tikzEdges
	} else {
		tikzCode += tikzNodes;
	}

	// Only update if changed, otherwise selection breaks
	if (tikzCode !== ptikzCode) {
		tikzCodeOutput.html(tikzCode);
		ptikzCode = tikzCode;
	}
}

function calculateControl(edge) {
	if (edge.centerOffsetX == 0 && edge.centerOffsetY == 0) {
		return ' to ';
	}

	let x = (((edge.from.x + edge.to.x)/2 + edge.centerOffsetX) *scl).toFixed(4);
	let y = ((height - ((edge.from.y + edge.to.y)/2 + edge.centerOffsetY)) * scl).toFixed(4);

	return `.. controls (${x}, ${y}) ..`;
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
