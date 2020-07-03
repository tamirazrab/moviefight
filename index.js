const fetchData = async (itemSearch) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			s: itemSearch,
		},
	});

	console.log(response.data);
};

let timerID = 0;
const onInput = (event) => {
	// This will fix the issue of sending request after every keystroke
	// It will not send request until user stops typing.
	// If user times new timeout is generated and next time gets cleared
	// then generated again if user stops timeout will be called.
	if (timerID) clearTimeout(timerID);
	timerID = setTimeout(() => {
		if (event.target.value !== "") fetchData(event.target.value);
	}, 300);
};

const search = document.getElementById("movie-search");
search.addEventListener("input", onInput);
