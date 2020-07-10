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
const root = document.querySelector(".autocomplete");
root.innerHTML = `
	<label><strong> Search for movie </strong></label>
	<input class="input" />
	<div class = "dropdown" > 
		<div class = "dropdown-menu" >
			<div class = "dropdown-content results" >
			
			</div>
		</div>
	</div>
`;

const search = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

let timerID = 0;
const onInput = async (event) => {
	// This will fix the issue of sending request after every keystroke
	// It will not send request until user stops typing.
	// If user times new timeout is generated and next time gets cleared
	// then generated again if user stops timeout will be called.
	let movies = await fetchData(event.target.value);
	if (!movies.length) {
		dropdown.classList.remove("is-active");
		return;
	}
	resultsWrapper.innerHTML = "";

	dropdown.classList.add("is-active");

	// Made await so that fetchData doesn't return promises instead of data actually needed.
	for (let movie of movies) {
		const item = document.createElement("a");
		item.classList.add("dropdown-item");
		// This functionality is not supported with '' single quotes.
		item.innerHTML = `
			<img src="${movie.Poster === "N/A" ? "" : movie.Poster}" />
			<center> ${movie.Title} </center>
		`;

		item.addEventListener("click", () => {
			search.value = movie.Title; // setting movie title to userInput
			dropdown.classList.remove("is-active"); // closing dropdown menu after user clicked on menu
			onMovieSelect(movie); // func to extract full available information related to selected movie
		});

		resultsWrapper.appendChild(item);
	}
};

search.addEventListener("input", debounce(onInput, 500));
document.addEventListener("click", (event) => {
	if (!root.contains(event.target)) dropdown.classList.remove("is-active");
});

const onMovieSelect = async (movie) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			i: movie.imdbID,
		},
	});

	console.log(response.data);
};
