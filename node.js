function Node(x, y, nodeText, label, size, shape, fillColor, fill, draw) {

	this.x = x;
	this.y = y;
	this.text = nodeText;
	this.label = label;
	this.size = size;
	this.shape = shape;
	this.fillColor = fillColor;
	this.fillBool = fill;
	this.drawBool = draw;

	this.draw = function() {
		drawNode(this.shape, this.size, this.x, this.y, this.fillColor, this.fillBool, this.drawBool);
		drawLabelAndText(this.x, this.y, this.size, this.label, this.text);
	};
	this.highlight = function() {
		var fillColor = color(250, 100, 100, 125);
		drawNode(this.shape, this.size*1.5, this.x, this.y, fillColor, true, false);
	};
}

function drawLabelAndText(x, y, size, label, nodeText) {
	stroke(0);
	strokeWeight(2);
	textSize(24);
	fill(255);
	textAlign('center', 'bottom');
	text(label, x, y-size/1.9);
	textAlign('center', 'center');
	text(nodeText, x, y);

}

function drawNode(shape, size, x, y, fillColor, fillBool, drawBool) {
	stroke(0);
	if (drawBool) {
		strokeWeight(2);
	} else {
		strokeWeight(0);
	}
	if (fillBool) {
		fill(color(fillColor));
	} else {
		fill(color(0, 0, 0, 125));
	}
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
