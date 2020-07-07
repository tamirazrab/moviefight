const debounce = (callBack, delay = 300) => {
	let timerId;
	return (...arguments) => {
		// Don't know which arguments are being passed here
		if (timerId) clearTimeout(timerId);
		timerId = setTimeout(() => {
			callBack.apply(null, arguments);
		}, delay);
	};
};
