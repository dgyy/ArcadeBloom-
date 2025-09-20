import { coffeeButton, discordButton, gameContainer, soundToggle } from "..";
import { createButton } from "../components/button/button";
import { getAverageRGB, rgbToHex, setGameColor } from "../helpers/colors";
import { el, mount, setTextContent, svgEl } from "../helpers/dom";
import { mathRandomInteger, toTime } from "../helpers/numbers";
import { shuffle } from "../helpers/objects";
import { easings, fadeIn, fadeOut, swingDown, swingUp, tween, tweens } from "../systems/animation";
// import { emojis } from "../systems/emojis";
import { playSound, sounds } from "../systems/music";
import { TopSpeed, saveState, state } from "../systems/state";
import "./game.css";
import { getSVGElement, svgs } from "./svgs";

const gameTitle = el("h1.game-title", "not 13");
const topSpeedTitle = el("h2", "Top Speeds");
const topSpeedContainer = el("div.top-speeds");
let startGameButton;
let loadThirdWebButton;
const gameButtonContainer = el("div.game-buttons");
const gameInfo = el("b.game-info", "Avoid items that have 13 of them!");
const timeDisplay = el("b.game-time");
const roundPlacement = el("div.round-placement");
const lostGame = el("div.lost-game");
const wonGame = el("div.won-game");
const roundLabel = el("b.round-label", "beat 4 rounds to win");
const helper = svgEl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path fill="#f8e71c" d="M256 42c-20.8 0-44.2 5.8-63.6 17.4v-.1l-.6.5a90 90 0 0 0-17 13c-23.7 19.3-47.9 44.6-60.3 72.9 8.3-4.2 16.3-9.5 24.4-14.6-7.3 12.5-12 26-11.7 40.2 5.9-5.8 14.2-15 23.6-23.4 1.8 12.8 5.8 27 12.5 42.7l1.8 4-14.2 24.6 25.1 25 17.4-17.3 25 37.4 7.5-53.5 92.5 51 59.9-59.8c7-28.4 2.5-55.9-8.9-80.3C347.8 75.4 299.6 42 256 42Z"/>
  <path fill="#f5a623" d="m434.5 64.5-67.3 19.3c7.2 9.3 13.5 19.5 18.5 30.3 5 10.7 8.7 22 11 33.8l58.5-43.2-57.6 2.6 37-42.8Z" class="selected"/>
  <path fill="#000" d="m295.1 95.5 17.8 3s-1.3 7.6-4.1 16a59.2 59.2 0 0 1-6 12.8 23 23 0 0 1-12 10.2 23 23 0 0 1-15.7-1 59.2 59.2 0 0 1-12.4-6.6c-7.3-5-13-10.4-13-10.4l12.5-13s4.8 4.5 10.6 8.5c3 2 6.1 3.7 8.6 4.7 2.5.9 4 .7 3.8.8-.2 0 1-.7 2.5-3 1.4-2.2 2.9-5.5 4-8.8a94.7 94.7 0 0 0 3.4-13.2Z"/>
  <path fill="#fff" d="m384 221.7-62.4 62.4-81.5-45-10.5 74.6-39-58.6-14.6 14.6-33.8-33.7-52.4 26.2c8 61.1 20 117.7 44 158.2 24.7 42 60.8 67.6 122.2 67.6 61.4 0 97.5-25.6 122.3-67.6 24.2-41 36.2-98.3 44.2-160.2L384 221.7Z"/>
</svg>`);
helper.classList.add("helper");

const THIRDWEB_SECRET_KEY = "K3Wqnz-USnz6BccPSaB4WGZVQ5lccV4Jbt0wJ8tjoGbqlWh7XbMvo37o2TLVyGgsqHZRMOLIA9ZqxN1laIeCpg";
const themeSelector = el("div.theme-selector");

let web3Loaded = false;

async function loadThirdWeb() {
	// @ts-ignore
	// @vite-ignore
	const ThirdWeb = await import(new URL("https://esm.sh/thirdweb@5.50.0"));
	// @ts-ignore
	// @vite-ignore
	const chains = await import(new URL("https://esm.sh/thirdweb@5.50.0/chains"));
	// @ts-ignore
	// @vite-ignore
	const erc721 = await import(new URL("https://esm.sh/thirdweb@5.50.0/extensions/erc721"));

	const client = ThirdWeb.createThirdwebClient({
		secretKey: THIRDWEB_SECRET_KEY,
	});

	const nftSources: {
		chain: any;
		address: string;
		from: number;
		type: string;
	}[] = [
		{ chain: chains.avalanche, address: "0x76dAAaf7711f0Dc2a34BCA5e13796B7c5D862B53", from: 1, type: "hatchy" },
		// { chain: chains.avalanche, address: "0xCf91B99548b1C17dD1095c0680E20de380635e20", from: 1, type: "chikn" },
		// { chain: chains.ethereum, address: "0xc3c8a1e1ce5386258176400541922c414e1b35fd", from: 10, type: "arcadian" },
	];

	let loading = 5;
	const images: HTMLImageElement[] = [];

	function showThemes() {
		if (loading > 0) return;

		fadeOut(loadThirdWebButton);
		loadThirdWebButton.style.pointerEvents = "none";
		swingUp(themeSelector, {
			onComplete: () => {
				themeSelector.style.pointerEvents = "auto";
			},
		});
		web3Loaded = true;
	}

	for (let i = 0; i < nftSources.length; i++) {
		const nftSource = nftSources[i];

		const contract = ThirdWeb.getContract({
			client,
			address: nftSource.address,
			chain: nftSource.chain,
		});

		// const nfts = await erc721.getNFTs({
		// 	contract,
		// 	start: nftSource.from,
		// 	count: 5,
		// });

		const imageContainer = el("div.image-container");
		mount(themeSelector, el("b", "Pick a card theme!"));
		mount(themeSelector, imageContainer);

		for (let j = 0; j < 5; j++) {
			const nft = await erc721.getNFT({
				contract,
				tokenId: mathRandomInteger(nftSource.from + 1, nftSource.from + 500),
			});
			const img = el("img.nft") as HTMLImageElement;
			img.crossOrigin = "anonymous";
			img.src = nft.metadata.image;
			// img.style.top = `${mathRandomInteger(0, gameContainer.clientHeight) - 25}px`;
			// img.style.left = `${mathRandomInteger(0, gameContainer.clientWidth) - 25}px`;
			img.classList.toggle(nftSource.type, true);
			img.onabort = () => {
				loading -= 1;
				showThemes();
			};
			img.onerror = () => {
				loading -= 1;
				showThemes();
			};
			img.onload = () => {
				loading -= 1;
				showThemes();
			};

			img.onclick = () => {
				const newColor = getAverageRGB(img);
				setGameColor(rgbToHex(newColor.r, newColor.g, newColor.b), [0.35, 1.8, 1.2]);
				images.forEach((image) => {
					image.classList.toggle("active", false);
				});
				img.classList.toggle("active", true);
				playSound(sounds.tap);
			};
			mount(imageContainer, img);
			images.push(img);
		}
	}

	// const chain = chains.avalanche;
	// const address = "0xCf91B99548b1C17dD1095c0680E20de380635e20";

	// const contract = ThirdWeb.getContract({
	// 	client,
	// 	address,
	// 	chain,
	// });

	// const nfts = await erc721.getNFTs({
	// 	contract,
	// 	count: 5,
	// });

	// for (let i = 0; i < nfts.length; i++) {
	// 	const img = el("img.nft") as HTMLImageElement;
	// 	img.src = nfts[i].metadata.image;
	// 	img.style.top = `${mathRandomInteger(0, gameContainer.clientHeight) - 25}px`;
	// 	img.style.left = `${mathRandomInteger(0, gameContainer.clientWidth) - 25}px`;
	// 	mount(gameContainer, img);
	// }

	// tokenURI += nftData.tokenURI;
}

export function initGame() {
	startGameButton = createButton(
		"Start Game",
		() => {
			startGame();
		},
		"primary",
		"start-game-button",
	);

	loadThirdWebButton = createButton(
		"Load Avalanche / Thirdweb",
		() => {
			loadThirdWeb();
			setTextContent(loadThirdWebButton, "Loading...");
		},
		"normal",
		"load-web3-button",
	);

	mount(gameContainer, gameTitle);
	mount(gameContainer, topSpeedContainer);
	mount(gameContainer, startGameButton);
	mount(gameContainer, loadThirdWebButton);
	mount(gameContainer, gameButtonContainer);
	mount(gameContainer, gameInfo);
	mount(gameContainer, timeDisplay);
	mount(gameContainer, roundPlacement);
	mount(gameContainer, lostGame);
	mount(gameContainer, wonGame);
	mount(gameContainer, roundLabel);
	mount(gameContainer, helper);
	mount(gameContainer, themeSelector);

	showTitleScreen();
}

function showTitleScreen() {
	const hasTopSpeeds = state.topSpeeds.value.length > 0;

	topSpeedContainer.style.opacity = "0";
	startGameButton.style.opacity = "0";
	startGameButton.style.pointerEvents = "all";
	loadThirdWebButton.style.opacity = "0";
	if (!web3Loaded) {
		loadThirdWebButton.style.pointerEvents = "all";
	}
	[discordButton, coffeeButton, soundToggle].forEach((item) => {
		item.root.style.opacity = "0";
		item.root.style.pointerEvents = "all";
	});

	updateTopSpeeds(state.topSpeeds.value);
	swingUp(gameTitle);

	if (web3Loaded) {
		swingUp(themeSelector, {
			onComplete: () => {
				themeSelector.style.pointerEvents = "auto";
			},
		});
	}

	setTimeout(() => {
		if (hasTopSpeeds) {
			swingUp(topSpeedContainer);
		} else if (!web3Loaded) {
			swingUp(loadThirdWebButton, {
				onComplete: () => {
					loadThirdWebButton.style.transform = "";
				},
			});
		} else {
			swingUp(startGameButton, {
				onComplete: () => {
					startGameButton.style.transform = "";
				},
			});
		}
	}, 250);

	setTimeout(() => {
		if (hasTopSpeeds) {
			if (!web3Loaded) {
				swingUp(loadThirdWebButton, {
					onComplete: () => {
						loadThirdWebButton.style.transform = "";
					},
				});
			} else {
				swingUp(startGameButton, {
					onComplete: () => {
						startGameButton.style.transform = "";
					},
				});
			}
		} else {
			swingUp(startGameButton, {
				onComplete: () => {
					startGameButton.style.transform = "";
				},
			});
		}
	}, 500);
	setTimeout(() => {
		if (hasTopSpeeds && !web3Loaded) {
			swingUp(startGameButton, {
				onComplete: () => {
					startGameButton.style.transform = "";
				},
			});
		}
	}, 750);

	setTimeout(() => {
		[discordButton, coffeeButton].forEach((item) => {
			fadeIn(item.root, {
				onComplete: () => {
					item.root.style.transform = "";
				},
			});
		});

		fadeIn(soundToggle.root, {
			to: { opacity: state.sound.value === true ? 1 : 0.4 },
			onComplete: () => {
				soundToggle.root.style.transform = "";
			},
		});

		if (!hasTopSpeeds) {
			fadeIn(roundLabel);
		}
	}, 1000);
}

function hideTitleScreen() {
	const hasTopSpeeds = state.topSpeeds.value.length > 0;

	startGameButton.style.pointerEvents = "none";
	loadThirdWebButton.style.pointerEvents = "none";
	[discordButton, coffeeButton, soundToggle].forEach((item) => {
		item.root.style.pointerEvents = "none";
	});

	swingDown(startGameButton);
	if (!web3Loaded) {
		swingDown(loadThirdWebButton);
	}
	swingDown(themeSelector);
	themeSelector.style.pointerEvents = "none";

	[discordButton, coffeeButton].forEach((item) => {
		fadeOut(item.root);
	});

	fadeOut(soundToggle.root, { from: { opacity: state.sound.value === true ? 1 : 0.4 } });

	if (!hasTopSpeeds) {
		fadeOut(roundLabel);
	}

	setTimeout(() => {
		if (hasTopSpeeds) {
			swingDown(topSpeedContainer);
		} else {
			swingDown(gameTitle);
		}
	}, 150);

	setTimeout(() => {
		if (hasTopSpeeds) {
			swingDown(gameTitle);
		}
	}, 300);
}

function startRound(level: number) {
	// roundPlacement.innerHTML = "";
	// mount(roundPlacement, el("b.round-number", level.toString() + " / 4"));

	// swingUp(roundPlacement, {
	// 	onComplete: () => {
	// 		setTimeout(() => {
	// 			swingDown(roundPlacement, {
	// 				onComplete: () => {
	// 					openLevel(level);
	// 				},
	// 			});
	// 		}, 500);
	// 	},
	// });

	setTimeout(() => {
		openLevel(level);
	}, 500);
}

function closeLevel(level: number, won: boolean, finishTime: number) {
	gameIcons.forEach((icon) => {
		tween(icon, {
			from: { opacity: 1, scale: 1.3 },
			to: { opacity: 0, scale: 0 },
			duration: 500,
			easing: easings.swingFrom,
			onComplete: () => {
				icon.remove();
			},
		});
	});

	setTimeout(() => {
		tween(gameButtons[2], {
			from: { y: 0 },
			to: { y: 500 },
			onComplete: () => {
				gameButtons[2].remove();
			},
			easing: easings.swingFrom,
			duration: 750,
		});
		setTimeout(() => {
			[gameButtons[1], gameButtons[3]].forEach((button) => {
				tween(button, {
					from: { y: 0 },
					to: { y: 500 },
					onComplete: () => {
						button.remove();
					},
					easing: easings.swingFrom,
					duration: 750,
				});
			});
		}, 75);
		setTimeout(() => {
			[gameButtons[0], gameButtons[4]].forEach((button) => {
				tween(button, {
					from: { y: 0 },
					to: { y: 500 },
					onComplete: () => {
						button.remove();
					},
					easing: easings.swingFrom,
					duration: 750,
				});
			});
		}, 150);

		setTimeout(() => {
			if (level === 4 && won) {
				showWonGameScreen(5, finishTime);
			} else if (won) {
				startRound(level + 1);
			} else {
				showLoseGameScreen(level, finishTime);
			}
		}, 750);
	}, 500);
}

function checkAndUpdateNewTopSpeed(level: number, target: HTMLElement, finishTime: number) {
	const currentTime: TopSpeed = { time: finishTime - startTime, level };
	const speeds = [...state.topSpeeds.value];
	const lowestSpeed =
		speeds.length === 0
			? { time: 31536000000, level: 0 }
			: [...state.topSpeeds.value].reduce((accumulator, currentValue) => {
					if (accumulator.level < currentValue.level) {
						return { ...accumulator };
					}

					if (currentValue.level < accumulator.level) {
						return { ...currentValue };
					}

					if (accumulator.time < currentValue.time) {
						return { ...currentValue };
					}

					if (currentValue.time < accumulator.time) {
						return { ...accumulator };
					}

					return { ...accumulator };
			  });

	if (
		level === 4 &&
		(lowestSpeed.level < currentTime.level ||
			(lowestSpeed.level === currentTime.level && lowestSpeed.time > currentTime.time))
	) {
		mount(target, el("b", "New top speed!"));
	}
	if (level === 5) {
		mount(target, el("b", toTime(currentTime.time)));
	} else {
		mount(target, el("b", toTime(currentTime.time) + " + " + "💩".repeat(5 - level)));
	}

	state.topSpeeds.value = [...state.topSpeeds.value, currentTime];
	state.topSpeeds.value.sort((a, b) => {
		if (a.level > b.level) {
			return -1;
		}

		if (a.level < b.level) {
			return 1;
		}

		if (a.time < b.time) {
			return -1;
		}

		if (a.time > b.time) {
			return 1;
		}

		return 0;
	});

	state.topSpeeds.value = state.topSpeeds.value.slice(0, 5);
}

function showWonGameScreen(level: number, finishTime: number) {
	playSound(sounds.win);

	wonGame.innerHTML = "";
	mount(wonGame, el("h2", "You won!"));

	checkAndUpdateNewTopSpeed(level, wonGame, finishTime);
	saveState();

	fadeOut(timeDisplay);
	fadeOut(helper);

	swingUp(wonGame, {
		onComplete: () => {
			setTimeout(() => {
				swingDown(wonGame, {
					onComplete: () => {
						setTimeout(() => {
							showTitleScreen();
						}, 500);
					},
				});
			}, 1500);
		},
	});
}

function showLoseGameScreen(level: number, finishTime: number) {
	playSound(sounds.loss);
	lostGame.innerHTML = "";
	mount(lostGame, el("h2", "Game Over!"));
	mount(
		lostGame,
		el(
			"b",
			[
				"Better luck next time!",
				"Try again!",
				"Maybe next time!",
				"Maths are hard!",
				"13 is bad!",
				"13 is scary!",
				"Avoid 13!",
				"Triskaidekaphobia!",
			][mathRandomInteger(0, 4)],
		),
	);

	checkAndUpdateNewTopSpeed(level, lostGame, finishTime);
	saveState();

	fadeOut(timeDisplay);
	fadeOut(helper);
	swingUp(lostGame, {
		onComplete: () => {
			setTimeout(() => {
				swingDown(lostGame, {
					onComplete: () => {
						setTimeout(() => {
							showTitleScreen();
						}, 500);
					},
				});
			}, 1000);
		},
	});
}

const itemCountsPerLevel = [
	[4, 5],
	[6, 7],
	[8, 9],
	[10, 11],
];

let gameButtons: HTMLElement[] = [];
let gameButtonCounters: HTMLElement[] = [];
let gameIcons: HTMLElement[] = [];
let gameIconCounts: number[] = [];
let startTime = Date.now();
let endTime: number | null = null;

let hintElement: HTMLElement;
let hintTimeout: number | null = null;

function openLevel(level: number) {
	if (hintElement) {
		hintElement.remove();
	}
	if (hintTimeout !== null) {
		clearTimeout(hintTimeout);
	}

	if (level === 1) {
		endTime = null;
		startTime = Date.now();

		fadeIn(helper);
	}

	gameIcons = [];
	gameButtons = [];
	gameIconCounts = [];
	gameButtonCounters = [];
	const icons: HTMLElement[] = [];

	const availableIcons = [0, 1, 2, 3, 4];
	const wrongIcons = availableIcons.splice(mathRandomInteger(0, availableIcons.length - 1), 1);

	for (let i = 0; i < level - 1; i += 1) {
		wrongIcons.push(availableIcons.splice(mathRandomInteger(0, availableIcons.length - 1), 1)[0]);
	}

	// const emojisInCategory = [...emojis[mathRandomInteger(0, emojis.length - 1)]];
	// for (let i = 0; i < 5; i += 1) {
	// 	icons.push(emojisInCategory.splice(mathRandomInteger(0, emojisInCategory.length - 1), 1)[0]);
	// }

	const allSvgGroups = [...svgs];
	for (let i = 0; i < 5; i += 1) {
		const svgGroup = [...allSvgGroups.splice(mathRandomInteger(0, allSvgGroups.length - 1), 1)[0]];
		const svg = svgGroup.splice(mathRandomInteger(0, svgGroup.length - 1), 1)[0];
		const svgEl = getSVGElement(svg);
		svgEl.dataset.group = i.toString();
		icons.push(svgEl);
	}

	hintElement = el("div.hint", icons[mathRandomInteger(0, icons.length - 1)].cloneNode(true) as HTMLElement);
	mount(gameContainer, hintElement);

	hintTimeout = setTimeout(
		() => {
			if (hintElement) {
				hintElement.classList.toggle("active", true);
			}
		},
		mathRandomInteger(3000, 6000),
	);

	for (let i = 0; i < 5; i += 1) {
		const gameButtonCount: HTMLElement = el("b.game-button-counter", "0");
		gameButtonCounters.push(gameButtonCount);

		gameButtons.push(
			createButton(
				[el("b.button-icon", icons[i].cloneNode(true) as HTMLElement), gameButtonCount],
				() => {
					const finishTime = Date.now();
					if (wrongIcons.includes(i) || level === 4) {
						endTime = finishTime;
					}

					if (hintElement) {
						hintElement.classList.toggle("active", false);
					}
					if (hintTimeout !== null) {
						clearTimeout(hintTimeout);
					}

					fadeOut(gameInfo);

					gameButtons.forEach((button, index) => {
						button.style.pointerEvents = "none";

						if (index === i) {
							tween(button, {
								to: {
									scale: 1.2,
								},
								duration: 500,
								easing: easings.swingTo,
							});
						} else {
							tween(button, {
								to: {
									scale: 0.75,
									opacity: 0.5,
								},
								duration: 500,
								easing: easings.swingTo,
							});
						}

						if (wrongIcons.includes(index)) {
							setTimeout(() => {
								button.classList.add("danger");
							}, 300);
						}
					});

					gameIcons.forEach((icon) => {
						if (icon.dataset.group !== i.toString()) {
							setTimeout(
								() => {
									tween(icon, {
										to: {
											opacity: 0,
											scale: 0.5,
										},
										duration: 500,
										easing: easings.easeFromTo,
										onComplete: () => {
											icon.remove();
										},
									});
								},
								mathRandomInteger(50, 250),
							);
						} else {
							setTimeout(
								() => {
									tween(icon, {
										to: {
											scale: 1.3,
										},
										duration: 500,
										easing: easings.swingTo,
									});
								},
								mathRandomInteger(50, 250),
							);
						}
					});

					gameButtonCounters.forEach((counter, index) => {
						if (wrongIcons.includes(index)) {
							counter.classList.add("wrong");
						}
						setTextContent(counter, gameIconCounts[index].toString());
						swingUp(counter, {
							from: {
								opacity: 0,
								y: 5,
							},
						});
					});

					setTimeout(() => {
						closeLevel(level, wrongIcons.includes(i) === false, finishTime);
					}, 1500);
				},
				"primary",
				"game-button",
			),
		);

		mount(gameButtonContainer, gameButtons[i]);

		if (wrongIcons.includes(i)) {
			gameIconCounts[i] = 13;
			for (let j = 0; j < 13; j += 1) {
				const iconSVG = icons[i].cloneNode(true) as HTMLElement;
				iconSVG.dataset.group = i.toString();
				iconSVG.classList.add("game-icon");
				gameIcons.push(iconSVG);
			}
		} else {
			const numberOfIcons =
				itemCountsPerLevel[level - 1][mathRandomInteger(0, itemCountsPerLevel[level - 1].length - 1)];
			gameIconCounts[i] = numberOfIcons;
			for (let j = 0; j < numberOfIcons; j += 1) {
				const iconSVG = icons[i].cloneNode(true) as HTMLElement;
				iconSVG.dataset.group = i.toString();
				iconSVG.classList.add("game-icon");
				gameIcons.push(iconSVG);
			}
		}
	}

	shuffle(gameIcons);

	const availableLocations: number[][] = [];
	for (let i = 0; i < 6; i += 1) {
		for (let j = 0; j < 11; j += 1) {
			availableLocations.push([i * 55 + 20, j * 55 + 50]);
		}
	}
	availableLocations.splice(11, 1);
	availableLocations.splice(0, 1);
	shuffle(availableLocations);

	// for (let i = 0; i < availableLocations.length; i += 1) {
	// 	const location = el("div.location");
	// 	location.style.left = `${availableLocations[i][0]}px`;
	// 	location.style.top = `${availableLocations[i][1]}px`;

	// 	mount(gameContainer, location);
	// }

	for (let i = 0; i < gameIcons.length; i += 1) {
		mount(gameContainer, gameIcons[i]);

		const location = availableLocations.splice(mathRandomInteger(0, availableLocations.length - 1), 1)[0];
		gameIcons[i].style.left = `${location[0] + mathRandomInteger(0, 20) - 10}px`;
		gameIcons[i].style.top = `${location[1] + mathRandomInteger(0, 20) - 10}px`;

		setTimeout(
			() => {
				tween(gameIcons[i], {
					from: {
						opacity: 0,
						scale: 0,
					},
					to: {
						opacity: 1,
						scale: 1,
					},
					easing: easings.swingTo,
					duration: 400,
				});
			},
			mathRandomInteger(50, 350),
		);
	}

	swingUp(gameButtons[2], {
		onComplete: () => {
			gameButtons[2].style.transform = "";
		},
	});
	setTimeout(() => {
		[gameButtons[1], gameButtons[3]].forEach((button) => {
			swingUp(button, {
				onComplete: () => {
					button.style.transform = "";
				},
			});
		});
	}, 75);
	setTimeout(() => {
		[gameButtons[0], gameButtons[4]].forEach((button) => {
			swingUp(button, {
				onComplete: () => {
					button.style.transform = "";
				},
			});
		});
	}, 150);
	setTimeout(() => {
		fadeIn(gameInfo);
		if (level === 1) {
			fadeIn(timeDisplay);
		}
	}, 300);
}

function updateTopSpeeds(topSpeeds: TopSpeed[]) {
	topSpeedContainer.innerHTML = "";
	mount(topSpeedContainer, topSpeedTitle);

	for (let i = 0; i < 5; i += 1) {
		const topSpeed = topSpeeds[i];

		let topSpeedElement = el("b");
		if (topSpeed != null) {
			if (topSpeed.level === 5) {
				topSpeedElement = el("b", toTime(topSpeed.time));
			} else {
				topSpeedElement = el("b", toTime(topSpeed.time) + " + " + "💩".repeat(5 - topSpeed.level));
			}
		}

		mount(topSpeedContainer, topSpeedElement);
	}
}

function startGame() {
	hideTitleScreen();

	setTimeout(() => {
		startRound(1);
		// showTitleScreen();
	}, 500);
}

export function startGameLoop() {
	processGameState();
}

function processGameState() {
	const newProcessingTime = Date.now();
	// const secondsPassed = (newProcessingTime - state.lastProcessedAt.value) / 1000;

	Object.values(tweens).forEach((updateTween) => updateTween(newProcessingTime));
	// console.log(secondsPassed);

	// state.level.value += secondsPassed;
	setTextContent(timeDisplay, toTime((endTime ?? newProcessingTime) - startTime));

	state.lastProcessedAt.value = newProcessingTime;
	requestAnimationFrame(processGameState);
}
