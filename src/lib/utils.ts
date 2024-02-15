export function formResponseToJSON(response: string) {
	const data = JSON.parse(response);

	const process = (object: object) => {
		const map = new Map();
		for (const [key, value] of Object.entries(object)) {
			if (typeof value == 'number') {
				const next = data[value];
				if (typeof next == 'object') {
					map.set(key, process(next));
				} else {
					map.set(key, next);
				}
			}
		}
		console.log(object);
		console.log(map);
		return Object.fromEntries(map);
	};

	return process(data[0]);
}