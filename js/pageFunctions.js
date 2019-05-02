
function openNodeNav() {
	let settings = document.getElementById("nodeSettings");
	settings.style.right = "0px";
	closeEdgeNav();
}

/* Set the width of the side navigation to 0 */
function closeNodeNav() {
	let settings = document.getElementById("nodeSettings");
	settings.style.right = "-355px";
}
/* Set the width of the side navigation to 250px */
function openEdgeNav() {
	let settings = document.getElementById("edgeSettings");
	settings.style.right = "0px";
	closeNodeNav();
}

/* Set the width of the side navigation to 0 */
function closeEdgeNav() {
	let settings = document.getElementById("edgeSettings");
	settings.style.right = "-355px";
}
