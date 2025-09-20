function generateTitle() {
	const titleTop = [
		// M
		[4,9,5,,3,,1,1],
		[3,4,-2,,,1,1,,,,,1],
		[4,3.5,-2.5,4.5,1,1,1,1],
		[4,9,-.5,,,3,1,1],
		[3,4,-7,,1,,,1,,1],
		// O
		[4,7,3,2,2.5,.5,,2.5],
		[2,3,-2,6,,.5,.5,,,,,.5],
		
		[4,7,-.5,2,,2.5,2.5,.5],
		[2,3,-6,2,.5,,,.5,,.5],
		// A
		[4,6,3,3,3,,,1],
		[4,6,-0.5,3,,3,1],
		[2.5,3,-6.5,4,,,,,1,1,,1],
		[5,5,-4.75,-0.5,1.5,1.5,1.5,1.5],
		// I
		[4,5.5,3.5,3.5,,1,1,1],
		[3,3,-7,3.5,1,,,1.5,,1],
		[4,3.5,-2.5,,1,1,1,1],

		// A
		[4.5,5,-44,9.5,2.5,,,1],
		[4.5,5,-1,9.5,,,1],
		[3,3,-7,9.5,,,,,,1,,1],
		// L
		[4.5,5,2.5,9.5,,,,1],
		[5.5,2.5,-2,12,,,1,,,,,1],
		[4,2.5,-5.5,9.5,.5,1,.5],
		// L
		[4.5,5,,9.5,,,,1],
		[5.5,2.5,-2,12,,,1,,,,,1],
		[4,2.5,-5.5,9.5,.5,1,.5],
		// E
		[4.5,5,,9.5,,,,1],
		[5.5,2,-2,12.5,,,1,,,,,1],
		[5.5,1.5,-6.5,9.5,,1,,,,,,1],
		[4,1.5,-5.5,11,,1,1],
		// Y - TODO: update
		[4.5,4,,9.5,,,,2],
		[4.5,4,-1,9.5,,1,2],
		[5,1.75,-8,12.75,,,1,1,1],
		[2,2.5,-4.5,11,,,,,,1,1,1],
	];

	drawTitle(titleTop, title, 10, height / (portrait ? 10 : 20), width / (portrait ? 50 : 150), "title");
}

function drawTitle(titleArr, title, baseLeft, baseTop, scale, className) {
	var part;
	var piece;
	var segment;
	var pieceWidth = 0;

	part = document.createElement("div");
	title.appendChild(part).className = className;

	for(var j = 0; j < titleArr.length; j++) {
		segment = titleArr[j];
		pieceWidth = (segment[0]||0)+(segment[2]||0);
		piece = document.createElement("div");
		title.appendChild(piece).className = portrait ? "widepiece" : "thinpiece";
		piece.style.width = ((segment[0]*scale)||0)+"px";
		piece.style.height = ((segment[1]*scale)||0)+"px";
		piece.style.left = (baseLeft+((segment[2]*scale)||0))+"px";
		piece.style.top = (baseTop+((segment[3]*scale)||0))+"px";
		piece.style.borderRadius = ((segment[4]*scale)||0)+"px "+((segment[5]*scale)||0)+"px "+((segment[6]*scale)||0)+"px "+((segment[7]*scale)||0)+"px";
		if(segment[8]) piece.style.borderTop = "none";
		if(segment[9]) piece.style.borderRight = "none";
		if(segment[10]) piece.style.borderBottom = "none";
		if(segment[11]) piece.style.borderLeft = "none";
		baseLeft += (pieceWidth*scale) + scale;
	}
}
