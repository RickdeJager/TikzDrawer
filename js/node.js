let tikzShapeTranslateTable = {
	'circle': 'circle, ',
	'square': '',
	'triangle':	'regular polygon, regular polygon sides=3, ',
	'rectangle': 'shape=rectangle, anchor=center, ',
}

function Node(x, y, nodeText, label, size, shape, fillColor, _fill, draw) {

	this.x = x;
	this.y = y;
	this.text = nodeText;
	this.label = label;
	this.size = size;
	this.shape = shape;
	this.fillColor = fillColor;
	this.fillBool = _fill;
	this.drawBool = draw;

	this.width = 2 * size;
	this.height = size;

	this.draw = _ => {
		this._draw();
		drawLabelAndText(this.x, this.y, this.size, this.label, this.text);
	};

	this.highlight = _ => {
		// backup old things
		const colour = this.fillColor;
		const wasDraw = this.drawBool;
		const wasFill = this.fillBool;
		const oldHeight = this.height;

		this.fillColor = color(250, 100, 100, 125);
		this.size *= 1.5;
		this.width *= 1.25;
		this.height += this.width - (this.width / 1.25);
		this.fillBool = true;
		this.drawBool = false;

		this._draw();

		// restore
		this.height = oldHeight;
		this.width /= 1.25;
		this.size /= 1.5;
		this.fillBool = wasFill;
		this.drawBool = wasDraw;
		this.fillColor = colour;
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
		return `minimum width = ${(this.width * scl).toFixed(2)}cm, minimum height = ${(this.height * scl).toFixed(2)}cm`;
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

	this._draw = _ => {
		stroke(0);

		if (this.drawBool) {
			strokeWeight(2);
		} else {
			strokeWeight(0);
		}

		if (this.fillBool) {
			fill(color(this.fillColor));
		} else {
			fill(color(0, 0, 0, 125));
		}


		switch(this.shape) {
			case 'square':
				rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
				break;
			case 'triangle':
				triangle(
					this.x - this.size / 2, this.y + this.size / 2,
					this.x + this.size / 2, this.y + this.size / 2,
					this.x, this.y - this.size / 2
				);
				break;
			case 'rectangle':
				rect(
					this.x - this.width / 2, this.y - this.height / 2,
					this.width, this.height
				);
				break;
			case 'circle':
			default:
				ellipse(this.x, this.y, this.size);
				break;
		}
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
