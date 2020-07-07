const fetchData = async (itemSearch) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			s: itemSearch,
		},
	});

	console.log(response.data);
};

// Should not debounce should be called like : debounce( fetchData( event.target.value ) , 500 );

let timerID = 0;
const onInput = (event) => {
	// This will fix the issue of sending request after every keystroke
	// It will not send request until user stops typing.
	// If user times new timeout is generated and next time gets cleared
	// then generated again if user stops timeout will be called.
	if (event.target.value !== "") fetchData(event.target.value);
};

const search = document.getElementById("movie-search");
search.addEventListener("input", debounce(onInput, 500));
