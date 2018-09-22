/* Set the width of the side navigation to 250px */
function openNodeNav() {
	document.getElementById("nodeSettings").style.width = "350px";
	closeEdgeNav();
}

/* Set the width of the side navigation to 0 */
function closeNodeNav() {
	document.getElementById("nodeSettings").style.width = "0";
} 
/* Set the width of the side navigation to 250px */
function openEdgeNav() {
	document.getElementById("edgeSettings").style.width = "350px";
	closeNodeNav();
}

/* Set the width of the side navigation to 0 */
function closeEdgeNav() {
	document.getElementById("edgeSettings").style.width = "0";
} 
