// import { gameContainer, soundToggle } from '../systems/game';
import { initAudioContext, zzfx, zzfxP, zzfxX } from "../third-party-libraries/zzfx";
import { zzfxM } from "../third-party-libraries/zzfxm";
// import { openModal } from './components/modal';
import { state } from "./state";
import { bodyElement, gameContainer, soundToggle } from "..";
import { openModal } from "../components/modal/modal";
import { initGame } from "../game/game";

const musicVolume = 1;

let musicStarted = false;

export const sounds = {
	tap: [1.03, 0.5, 355, , , 0, , 0.71, 12, , -752, 0.03, , , , , , 0.22, 0.01],
	rotate: [1.02, 0.5, 1133, , 0.01, 0.01, 1, 1.06, , 0.3, , , , 0.1, 52, , , 0.13, 0.01],
	loss: [1.37, , 1133, 1, 0.1, 0.27, , 1.45, -2, , 136, 0.09, 0.18, 0.2, , , 0.1, 0.83, 0.13],
	victory2: [1.03, 0.5, 411, , 0.19, 0.33, 1, 0.98, , , 133, 0.04, 0.15, , , , , 0.53, 0.18],
	victory4: [1.03, 0.5, 300, , 0.05, , , 0.7, 12, , -700, 0.07, , , , , , 0.3, 0.1],
	victory3: [1.2, 0.5, 355, , 0.02, 0.06, , 0.71, 14, , 100, 0.05, , , , , , 0.3, 0.01],
	win: [1.4, , 236, 0.11, 0.16, 0.46, 1, 0.8, 0.9, -38, 106, 0.08, 0.03, , , , 0.16, 0.69, 0.16],
};

// [[[.5,0,43,,,.25,,,,,,,,.1]],[[[,,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33]]],[0],50,{"title":"New Song","instruments":["Instrument 1"],"patterns":["Pattern 0"]}]
export const music = zzfxM(
	[[musicVolume, 0, 43, , , 0.25, , , , , , , , 0.1]],
	[
		[[, , 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33]],
		[[, , 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33]],
	],
	[0],
	50,
);

export function playSound(sound: (number | undefined)[]) {
	if (state.sound.value && zzfxX != null) {
		zzfx(...sound);
	}
}

export function initMusic() {
	if (state.sound.value == null) {
		openModal(
			gameContainer,
			"Play with sound?",
			"",
			[
				{
					type: "danger",
					content: "No",
					onClickCallback: () => {
						state.sound.value = false;
						initGame();
					},
				},
				{
					type: "primary",
					content: "Rock ON!",
					onClickCallback: () => {
						state.sound.value = true;
						if (soundToggle) {
							soundToggle.renderState(state.sound.value);
						}
						initGame();
					},
				},
			],
			null,
		);
	}

	bodyElement.onclick = () => {
		if (!musicStarted) {
			musicStarted = true;
			initAudioContext();
			zzfxP(...music).loop = true;

			if (state.sound.value) {
				zzfxX!.resume();
			} else {
				zzfxX!.suspend();
			}
		}
	};
}
