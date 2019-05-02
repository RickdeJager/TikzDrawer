let tikzShapeTranslateTable = {
	'circle': 'circle, ',
	'square': '',
	'triangle':	'regular polygon, regular polygon sides=3, ',
	'rectangle': 'shape=rectangle, anchor=center, ',
}

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

	this.draw = _ => {
		drawNode(this.shape, this.size, this.x, this.y, this.fillColor, this.fillBool, this.drawBool);
		drawLabelAndText(this.x, this.y, this.size, this.label, this.text);
	};

	this.highlight = _ => {
		var fillColor = color(250, 100, 100, 125);
		drawNode(this.shape, this.size*1.5, this.x, this.y, fillColor, true, false);
	};

	this.getDraw = _ => {
		if (this.drawBool) {
			return 'draw, ';
		}

		return '';
	};

	this.getLabel = _ => {
		if (this.label != '') {
			return ', label=' + this.label;
		}

		return '';
	};

	this.getFill = _ => {
		if (this.fillBool) {
			return ', fill=' + this.fillColor.replace('#', '');
		}

		return '';
	};

	this.getSize = _ => {
		if (this.shape != 'rectangle') {
			return `minimum size = ${(this.size * scl).toFixed(2)}cm`;
		}

		// TODO make these configurable
		let width = 2 * this.size;
		let height = this.size;
		return `minimum width = ${(width * scl).toFixed(2)}cm, minimum height = ${(height * scl).toFixed(2)}cm`;
	}

	this.generateTikz = id => {
		let draw = this.getDraw();
		let label = this.getLabel();
		let fill = this.getFill();
		let size = this.getSize();
		let shape = tikzShapeTranslateTable[this.shape];

		let options = draw + shape + size + label + fill;
		let x = (this.x * scl).toFixed(2);
		let y = ((height - this.y) * scl).toFixed(2);

		return `\\node[${options}] at (${x}, ${y}) (${id}) {${this.text}};<br>`;
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
		case 'square':
			rect(x-size/2, y-size/2, size, size);
			break;
		case 'triangle':
			// Too simple, but don't feel like doing math rn
			triangle(x-size/2, y+size/2, x+size/2, y+size/2, x, y-size/2);
			break;
		case 'rectangle':
			// TODO make these configurable
			let width = 2 * size;
			let height = size;
			rect(x - width / 2, y - height / 2, width, height);
			break;
		case 'circle':
		default:
			ellipse(x, y, size);
			break;
	}
}
