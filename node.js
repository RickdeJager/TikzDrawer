function Node(x, y, nodeText, label, size, shape) {

	this.x = x;
	this.y = y;
	this.text = nodeText;
	this.label = label;
	this.size = size;
	this.shape = shape;

	this.draw = function() {
		strokeWeight(1);
		drawNode(this.shape, this.size, this.x, this.y);
		strokeWeight(2);
		textSize(24);
		fill(255);
		textAlign('center', 'bottom');
		text(this.label, this.x, this.y-this.size/1.9);
		textAlign('center', 'center');
		text(this.text, this.x, this.y);
	};
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
