class TweenFX {

	static to(_element, _duration, _object, _ease, _update, _callback, _timeout = 16.66) {
		// 0 (default): ease in-out
		// 1: ease in
		// 2: ease out
		// *: linear

		const tweenedKeys = [];
		const tweenedStart = [];
		const tweenedEnd = [];

		Object.keys(_object).forEach(key => {
			tweenedKeys.push(key);
			tweenedStart.push(_element[key]);
			tweenedEnd.push(_object[key]);
		});

		let count = 0;
		const duration = _duration;
		const element = _element;

		const tween = e => {
			if (element.killed) {
				//TweenFX.callbacks.splice(TweenFX.callbacks.indexOf(tween), 1);
				return;
			}
			if (count < duration) {
				count ++;
				tweenedKeys.forEach((key, i) => {
					const eased = ease(_ease);
					if (tweenedStart[i] > tweenedEnd[i]) {
						element[key] = tweenedEnd[i] + (tweenedStart[i] - tweenedEnd[i]) / duration * (duration - eased);
					} else {
						element[key] = tweenedStart[i] - (tweenedStart[i] - tweenedEnd[i]) / duration * eased;
					}
				});
				if (_update != null) _update();
				//TweenFX.addTimedCallback(tween);
				setTimeout(tween, _timeout);
			} else if (_callback != null) {
				_callback();
			}
		}

		const ease = type => {
			if (type == 1) return duration * Math.pow(count / duration, 1.675);
			if (type == 2) return duration * (1 - Math.pow(1 - count / duration, 1.675));
			if (!type) return duration * .5 * (Math.sin((count / duration - .5) * Math.PI) + 1);
			return count;
		}

		element.killed = false;
		if (_update != null) _update();
		//TweenFX.addTimedCallback(tween);
		//requestAnimationFrame(tween);
		setTimeout(tween, _timeout);
	}

	static addTimedCallback(callback, frameLengthInMs) {
		if (!TweenFX.callbacks) {
			TweenFX.callbacks = [];
			TweenFX.entries = [];
			requestAnimationFrame(TweenFX.checkFrame);
		}

		if (TweenFX.callbacks.indexOf(callback) == -1) {
			TweenFX.callbacks.push(callback);
			TweenFX.entries.push([frameLengthInMs, Date.now(), Date.now()]);
		} else {
			console.warn("already animating")
		}
	}

	static removeTimedCallback(callback) {
		const entryId = TweenFX.callbacks.indexOf(callback);
		TweenFX.callbacks.splice(entryId, 1);
		TweenFX.entries.splice(entryId, 1);
	}

	static checkFrame() {
		// loop through all callbacks
		TweenFX.callbacks.forEach((callback, index) => {
			// calc elapsed time since last loop
			TweenFX.now = Date.now();
			TweenFX.elapsed = TweenFX.now - TweenFX.entries[index][1];

			// if enough time has elapsed, draw the next frame
			if (TweenFX.elapsed >= TweenFX.entries[index][0]) {
				// Get ready for next frame by setting then=now, but also adjust for your
				// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
				TweenFX.entries[index][1] = TweenFX.now - (TweenFX.elapsed % TweenFX.entries[index][0]);
				callback();
			}
		});

		// request another frame
		requestAnimationFrame(TweenFX.checkFrame);
	}
}
