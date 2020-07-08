const fetchData = async (itemSearch) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			s: itemSearch,
		},
	});

	if (response.data.Error)
		// if no data is found
		return []; // empty array

	return response.data.Search; // Only data we're now interested in.
};

// Should not debounce should be called like : debounce( fetchData( event.target.value ) , 500 );

let timerID = 0;
const onInput = async (event) => {
	// This will fix the issue of sending request after every keystroke
	// It will not send request until user stops typing.
	// If user times new timeout is generated and next time gets cleared
	// then generated again if user stops timeout will be called.
	let movies;
	if (event.target.value !== "") movies = await fetchData(event.target.value);
	// Made await so that fetchData doesn't return promises instead of data actually needed.
	for (let movie of movies) {
		const div = document.createElement("div");
		// This functionality is not supported with '' single quotes.
		div.innerHTML = `
			<img src="${movie.Poster}" />
			<h1> ${movie.Title} </h1>
		`;

		document.getElementById("movie-output").appendChild(div);
	}
};

const search = document.getElementById("movie-search");
search.addEventListener("input", debounce(onInput, 500));
