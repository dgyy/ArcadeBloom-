export type Subscriber<valueType> = (value: valueType) => void;
export type Signal<valueType> = {
	value: valueType;
	subscribe: (subscriber: Subscriber<valueType>) => () => void;
};

export function createSignal<valueType>(initialValue): Signal<valueType> {
	let _value: valueType = initialValue;
	let subscribers: Subscriber<valueType>[] = [];

	function notify() {
		for (let subscriber of subscribers) {
			subscriber(_value);
		}
	}

	return {
		get value() {
			return _value;
		},
		set value(v) {
			_value = v;
			notify();
		},
		subscribe: (subscriber: Subscriber<valueType>) => {
			subscribers.push(subscriber);

			return () => {
				subscribers = subscribers.filter((s) => s !== subscriber);
			};
		},
	};
}
