//actionButton 🔨: &#x1f528, 🪓:&#x1FA93,  ⛏️⛏: &#x26cf (&#9935)
//✔️☑️⭐🌟🥔🏅🥇🥈🥉🎖️🏆
//🕪 🕩 &#x1F50A settings: &#9881 🔈 🔊

function updateInGameUI(special) {
	if (!state) return;
	actionButton.style.opacity = 1;
	actionButton.style.pointerEvents = "all";

	let html = '';
	let scale = getScale(width, height);
	let currentPath = board.pathData[player.y][player.x];

	if (special) {
		html = `<div style="width:100%;font-size:${(special>1?80:75)*scale}px;margin-top:${120*scale}px">${special>1?'Next':'Retry'}</div>`;
		html += `<div style="width:100%;font-size:${40*scale}px;margin-top:${200*scale}px">Stage ${special>1?stage+1:stage}</div>`;
		actionButton.innerHTML = html + `<div class="button" style="top:2vh">${special>1?'➳':'↶'}</div>`;
	} else if (mana <= 0 && !complete) {
		// Level failed
		complete = 0;
		predictRock = 0;
		action = 8;
		switchState();
	} else
	if (action == 6) {
		// Stop Moai moving
		html = `<div style="width:100%;font-size:${99*scale}px;margin-top:${125*scale}px">Stop</div>`;
		html += `<div style="width:100%;font-size:${45*scale}px;margin-top:${200*scale}px">moving</div>`;
		html += `<div style="width:100%;font-size:${40*scale}px;margin-top:${245*scale}px">Moai</div>`;
		actionButton.innerHTML = html + `<div class="button">&#x2716</div>`;
	} else 
	if (action == 5) {
		// Move the selected Moai
		html = `<div style="width:100%;font-size:${99*scale}px;margin-top:${195*scale}px">Move</div>`;
		actionButton.innerHTML = html + `<div class="button shake">&#x1f5ff</div>`;
	} else 
	if (action == 3) {
		// Carve a Moai statue
		html = `<div style="width:100%;font-size:${99*scale}px;margin-top:${110*scale}px">Carve</div>`;
		html += `<div style="width:100%;font-size:${45*scale}px;margin-top:${195*scale}px">+8 Stone</div>`;
		html += `<div style="width:100%;font-size:${40*scale}px;margin-top:${245*scale}px">-1 Mana</div>`;
		actionButton.innerHTML = html + `<div class="button">&#x1f528</div>`;
	} else 

	if (!board.mapData[player.y][player.x] && !board.unitsData[player.y][player.x] && currentPath == -1) {
		// Pave
		action = 1;
		board.placeRoad(player.x, player.y, 0, 1);// Not placing a road here - just getting prediction to update predictRock
		html = `<div style="width:100%;font-size:${99*scale}px;margin-top:${110*scale}px">Pave</div>`;
		html += `<div style="width:100%;font-size:${45*scale}px;margin-top:${195*scale}px">-${predictRock*4} Stone</div>`;
		html += `<div style="width:100%;font-size:${40*scale}px;margin-top:${245*scale}px">-1 Wood</div>`;
		actionButton.innerHTML = html + `<div class="button">&#9935</div>`;
		// Hilight in case mana is low and disable the action button
		if (rock < predictRock || wood < 1) {
			disableActionButton();
			actionButton.children[1].style.color = "#faa";
		}
	} else if (!board.mapData[player.y][player.x] && (board.unitsData[player.y][player.x] == 1 || board.unitsData[player.y][player.x] == 2)) {
		// Chop
		action = 2;
		const treeType = board.units[board.getUnit(player.x, player.y)].type;
		html = `<div style="width:100%;font-size:${99*scale}px;margin-top:${110*scale}px">Chop</div>`;
		html += `<div style="width:100%;font-size:${45*scale}px;margin-top:${195*scale}px">+${4-treeType} Wood</div>`;
		if (board.unitsData[player.y][player.x] == 1) html += `<div style="width:100%;font-size:${40*scale}px;margin-top:${245*scale}px">-1 Mana</div>`;
		actionButton.innerHTML = html + `<div class="button">&#x1fa93</div>`;
		// Hilight in case mana is low and disable the action button
		/*if (mana < 2) {
			disableActionButton();
			actionButton.children[2].style.color = "#faa";
		}*/
	} else if (currentPath > -1) {
		predictRock = 0;
		html = `<div style="width:100%;font-size:${80*scale}px;margin-top:${120*scale}px">Road</div>`;
		html += `<div style="width:100%;font-size:${55*scale}px;margin-top:${195*scale}px">Stone</div>`;
		html += `<div style="width:100%;font-size:${40*scale}px;margin-top:${245*scale}px">spent: ${
			!currentPath ? 2 : currentPath>0&&currentPath<5 ? 3 : currentPath>6&&currentPath<11 ? 5 : currentPath==15 ? 6 : 4
		}</div>`;
		actionButton.innerHTML = html + `<div class="button" style="top:-2vh">${
			["▢", "◡", "⊆", "◠", "⊇", "║", "═", "╠", "╦", "╣", "╩", "╔", "╗", "╝", "╚", "╬"][currentPath]
		}</div>`;
		disableActionButton();
	} else {
		//action = 0;
		actionButton.innerHTML = "";
	}

	if (board.path[player.y][player.x].type > -1) {
		predictRock = 0;
	} else {
		board.placeRoad(player.x, player.y, 0, 1);// Not placing a road here - just getting prediction to update predictRock
	}

	uiInfo.innerHTML = `<div>Stage: ${stage}</div><br><br><div>Stone: ${
		rock * 4 + (predictRock && attach ? "<span style='color:#fcc'> -"+predictRock*4+"</span>" : "")
	}</div><br><div>Wood: ${
		wood + (predictRock && attach ? "<span style='color:#fcc'> -1</span>" : "")
	}</div><br><div>Mana: ${
		mana + (attach ? "<span style='color:#fcc'> -1</span>" : "")
	}</div>M`;
	uiInfo.children[0].style.fontSize = 70 * scale + "px";
	uiInfo.children[7].style.color = mana < 2 ? "#fbb" : "#fff";
}

function disableActionButton() {
	actionButton.style.opacity = 0.5;
	actionButton.style.pointerEvents = "none";
}
