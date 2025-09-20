class PixelArt {

	static init() {
		// Colors
		PixelArt.paletteObjects = [
			// Palm
			"2dcb0053ff000083007e321a622411b04321d3702e",
			// Tree
			"067c000ebb0046e40059ff00d041147e321a622411",
			// Rock
			"f7e064b4897c715b543ca61c1751068f4832622411",
			// Lake
			"71a4ff427eeb1e61db1448a60b37852dbd14077707"
		];
		PixelArt.paletteMoai = [
			"f1d2b2d8af8cb58e6a936548603e283a241a",
			"f1d2b2d8af8cb58e6a936548603e283a241affffff",
			"f1d2b2d8af8cb58e6a936548603e283a241a00ff00"
		];
		PixelArt.paletteCharacter = "fffdc1ff3100ff9262dc663c864016642600401800";
		PixelArt.paletteRoad = "e3c7b1e1bca0c8a284ad8d70937b6772573e4c3417";

		PixelArt.paletteTiles = [
			"97de595cc149ffcc7d97de59ffcc7dffcc7dffcc7d",//norm
			"97de595cc149ffcc7d97de59ffcc7dffcc7dffcc7d",//norm
			"97de595cc149ffcc7d97de5997de5997de595cc149",//green
			"97de595cc149ffcc7d7cc9ff1e8edcfe751ae4ff00",//flowers blue + red
			"97de595cc149ffcc7dffcc7dffcc7dfe751ae4ff00",//flowers red
			"97de595cc149ffcc7d7cc9ff1e8edcffcc7d97de59" //flowers blue
		];
		PixelArt.paletteWater = [
			"fee5be97de59bdddf890c7f657a7eb2354d3f1f192",
			"fee5be97de59bdddf890c7f657a7eb2354d3f1f192",
			"fee5be97de59bdddf890c7f657a7eb2354d3f1f192",
			"fee5be97de59bdddf890c7f657a7eb2354d3f1f192"
		];

		// Sprites
		// 16x16 transparent sprites
		PixelArt.dataObjects = PixelArt.extract(
			// Palm
			"HIRY@@@@@[IJC@A@@@[QaHJ@@@X[eQQAPI@hn[IJJ[ItDX[QYQJcM@@KKJ[lLJ@HQYxf]QAXHCpl\\KB@X@xfE[A@@@plDXA@@@xfEX@@@@plD@@@@@\`eE@@@@@@m@@@@" +
			// Tree
			"@@@QA@@@@@PdJ@R@@RP\\SP\\BPdBZAPdSP\\BHAa[J@ZAppMSA@Hnb~@@@Q@P\\BPB@bTP\\zbT@b[OJqb[BaSEyFbSAHRAwGQSA@I@nFHI@@@@uG@@@@@@~F@@@@@puw@@@" +
			// Rock
			"@@@@blD@@@@PIg\`@@@@JQ{ED@@pIZ^oC@@NQrqCE@@ORNV~C@xQRQrCE@tYJRJjC\`Or_RQ{DhKRCNZFGxNrxSRwc}QZwR{PoSRCWZ\\JzS{c{}S|\\po_G_}x}Gx{G" +
			// Lake
			"@@@wGp@@pGeewGFxlT[JjlGfQ[SIRR}W[SJZ[Kj\\SJ[[KQ[cb[[SZ[ST\\\\\\\\[SZecccccbcl\\\\\\\\llleeeeeeemollllll}pmeeemmFpmmmmwGx@vwGw@@@Gxx@x@",
			256
		);

		PixelArt.spritesObjects = PixelArt.drawSprites(PixelArt.dataObjects, PixelArt.paletteObjects);

		// 16x16
		PixelArt.dataTiles = PixelArt.extract(
			// Grass (uses 6 palettes)
			"@@c_qCH@@hS[~^SAXeMSsY[BSkC@@P[[NC@@h@XKwHHKeEBqFP@PhYB@HP@@@ZCHP@P[A@@P@XN[[@A@YswKKEB@ZJ^SklYZ[SH@[]sY[C@@@Z~^S@@BAAqKP@A[B@@C" +
			// Road [o]
			"@@@@@@@@@@@@@@@@@@@@@@@@@@\`ekD@@@@TSS\\@@@hcY\\jF@@pUSS\\E@@h\\\\ZbC@@hTKckE@@xfZZtG@@@oS\\~@@@@xfnG@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" +
			// Road [U]
			"@xVSSlF@@p]Z\\rG@@xVSKlF@@p]\\ZbE@@@TSS\\D@@hcY\\j@@@pUSS\\E@@h\\\\ZbC@@@UKck@@@@cZZb@@@@hcKC@@@@@ZZ@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" +
			// Water [~~]
			"hm@mmmm@@hm@@@@m@@@@@@@@vF@pvvF@vvvvvvvv@vvF@@pv@@@@@@@@m@@hmmE@mmmmmmmmlmmmddmmdmdddddddddd[[ddcd\\[[[[[[[[[KY[[[[[IIIY[OIIQIJII" +
			// Water [. ]
			"hm@m@@@@@hm@m@@@@@@@@m@@vF@@@@E@vvvv@@h@@vvvv@h@@@@pvF@Em@@@vF@EmmE@pv@hmmm@pv@hdmmE@v@hddmm@v@Ecdlm@vFE[cdmEpFh[cdmEpFh[[dmEpFh" +
			// Water ['-]
			"I[dmEpFhI[dmEpF@J[lm@pv@Iclm@@vvYclm@@pvY[dmE@@@I[dmE@@@I[dlm@@mI[clmmmmJYcdmmmmIY[ddmedII[cddddQIY[c\\[[IQI[[[[[IIIIYKIYJIJIIIJI",
			256
		);

		// 16x16, 6 grass tiles using the same data
		PixelArt.spritesTiles = PixelArt.drawSprites([PixelArt.dataTiles.shift()], PixelArt.paletteTiles);

		// 16x16, roads
		let road1 = PixelArt.dataTiles.shift();
		let road2 = PixelArt.dataTiles.shift();
		PixelArt.spritesRoad = [
			PixelArt.drawSprite(road1, 16, 16, PixelArt.paletteRoad),
			PixelArt.drawSprite(road2, 16, 16, PixelArt.paletteRoad),
			PixelArt.drawSprite(road2, 16, 16, PixelArt.paletteRoad, 0, 0, 1),
			PixelArt.drawSprite(road2, 16, 16, PixelArt.paletteRoad, 0, 0, 2),
			PixelArt.drawSprite(road2, 16, 16, PixelArt.paletteRoad, 0, 0, 3),
		];

		// 16x16, 4 arrays with 0,90,180,270 degrees rotated water sprites => 12 sprites total - inside: 3 sprites * 4 animated frames each.
		PixelArt.spritesWater = [
			PixelArt.drawSprites(PixelArt.dataTiles, PixelArt.paletteWater),
			PixelArt.drawSprites(PixelArt.dataTiles, PixelArt.paletteWater, 16, 16, false, 1),
			PixelArt.drawSprites(PixelArt.dataTiles, PixelArt.paletteWater, 16, 16, false, 2),
			PixelArt.drawSprites(PixelArt.dataTiles, PixelArt.paletteWater, 16, 16, false, 3)
		];

		// 14x20 transparent sprites
		PixelArt.dataMoai = PixelArt.extract(
			// Front
			"@xTQcG@@g[Z\\|@x_u@n{GxkFZpeGupQFn^lQ]tUkQUkXTIlDVlpes\\bn\\cTSQScx\\jm]cGx\`SS\\DG@G\\bcx@@nF@pu@puulnhFnnlvuEuuecenlhh\\llteE@eeeen@" +
			// Left
			"@@@TQk@@@eJJZE@hnS\\lC@p@nceE@@Qp\\lD@LbFcu@\`Qtm\\^j@beaccs@@LZ\\mD@eVccX@ph\\\\nF@n\\bue@@\`SDn\\@@@@pecE@@@nZ\\l@@\`UleeE@lcmlnn@e\\luuuh\\dmnnF@nmuuu@",
			280
		);

		PixelArt.spritesMoai = PixelArt.drawSprites(PixelArt.dataMoai, PixelArt.paletteMoai, 20, 14);
		PixelArt.spritesMoai = PixelArt.spritesMoai.concat(PixelArt.drawSprites(PixelArt.dataMoai, PixelArt.paletteMoai, 20, 14, true));

		// 16x18 transparent sprites
		PixelArt.dataCharacter = PixelArt.extract(
			// Character frames
			"@@@@xJWA@@@@@WyJx@@@@ppG\`UG\`@@onnFJ@\\Dxd[c}A@JBX~exnlGfF\`A[At]@p@@dGdkD@xE@Xd[E@@g{Fg~fp~@X_|ze|n\\G@\`CbxhCc{pGxJjOtX|hF@RQXE\`CpE@VZf@@@xF@pRwk@@@@pCEh\\F@@@oQGxJ}@" +
			"@@@@xJWA@@@@@WyJx@@@@ppG\`UG\`@@onnFJ@\\Dxd[c}A@JBXGeGnlGfF\`H[Ht]@p@@dGdkD@xE@Xd[E@@g{Fg~fp~@X_|ze|n\\G@\`CbxhCc{pGxJjOtX|hF@RQXE\`CpE@VZf@@@xF@pRwk@@@@pCEh\\F@@@oQGxJ}@" +
			"@@@@@WyJG@@@@JWy@@D@wuwX@@\`cxe\\lFWGPQhFeGwJ@hD\`H\\HlA@@F@d[\\sE@xE@^x\\l{@g{G]\\cED@X_|\`Iipx@E\`kzl~~cGn@sixhC\\|u@@JjOl\`{F@pRc^EXDE@@VR\`@@@@@@pRwk@@@@pCFh\\F@@@oQGxJ}@"+
			// Ahu
			"@cuvvwv@pldfefeFnvnvvnvue\\ldcl\\llmemmemeekcc]dkln]mmkm]uLcccbcSQwJJIJIJ}{]wwokoDlvcfvvgU]lnl\\vp]emnumbwfqww~l}~ikfY|vFOKlolul}YUIIIIIIjh\\ZdScSE",
			324
		);

		PixelArt.spritesAhu = PixelArt.drawSprites([PixelArt.dataCharacter.pop()], PixelArt.paletteRoad, 18);
		PixelArt.spritesCharacter = PixelArt.drawSprites(PixelArt.dataCharacter, PixelArt.paletteCharacter, 18, 18);
	}

	static drawSprites(data, palette, height = 16, width = 16, flipped = false, rotated = 0) {
		const sprites = [];
		data.forEach((spriteData, id) => {
			if (Array.isArray(palette)) {
				if (data.length < palette.length) {
					// Draw tiles that have same data but multiple palettes (grass, water)
					palette.forEach((colors) => {
						sprites.push(PixelArt.drawSprite(spriteData, width, height, colors, width == 14 ? 1 : 0, flipped, rotated));
					});
				} else {
					// Draw objects (trees, mauntain)
					sprites.push(PixelArt.drawSprite(spriteData, width, height, palette[id], id == 3 ? 0 : id > 1 ? 1 : 0.8, flipped, rotated));
				}
			} else {
				// Draw elements that have the same palette (character, ahu, moai)
				sprites.push(PixelArt.drawSprite(spriteData, width, height, palette, 1, flipped, rotated));
			}
		});

		return sprites;
	}

	static drawSprite(spriteData, width, height, palette, addShadow = 0, flipped = false, rotated = 0) {
		const spriteCanvas = document.createElement("canvas");
		spriteCanvas.width = width;
		spriteCanvas.height = height + (addShadow ? 1 : 0);// additional pixel in height to add contour via drop-shadow
		const ctx = spriteCanvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		if (addShadow) PixelArt.addShadow(ctx, 1, 0, addShadow);

		ctx.save();
		if (rotated == 1) ctx.translate(width, 0);
		else if (rotated == 2) ctx.translate(width, height);
		else if (rotated == 3) ctx.translate(0, height);
		ctx.rotate((Math.PI/2) * rotated);
		for(let y = 0; y < height; y ++) {
			for(let w,z,x = flipped ? width-1 : 0; flipped ? x > 0 : x < width; flipped ? x -- : x ++) {
				z = (flipped ? width - x : x);
				if (spriteData[y * width + z]) {
					w = palette.substr(6 * (spriteData[y * width + z] - 1), 6);
					if (w) {
						ctx.fillStyle = "#" + w;
						ctx.fillRect(x, y, 1, 1);
					}
				}
			}
		}
		ctx.restore();

		return spriteCanvas;
	}

	static addShadow(ctx, y, x, s, c) {
		ctx.shadowColor = c || `rgba(0,0,0,${s || 1})`;
		ctx.shadowOffsetY = y || 0;
		ctx.shadowOffsetX = x || 0;
	}

	static extract(encryptedPixelData, totalPixels) {
		const px = [];

		encryptedPixelData.replace(/./g, function(a) {
			let q = a.charCodeAt();
			px.push(q & 7);
			px.push((q >> 3) & 7);
		});

		let i = 0, length = px.length / totalPixels, sprites = [];

		// Initialize sprites data
		for(i = 0; i < length; i++) {
			sprites.push(px.splice(0, totalPixels));
		}

		return sprites;
	}
	
}
