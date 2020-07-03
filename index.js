const fetchData = async (itemSearch) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			s: itemSearch,
		},
	});

	console.log(response.data);
};

const search = document.getElementById("movie-search");
search.addEventListener("input", function (event) {
	fetchData(event.target.value); // Data user types into input box
	// Not ideal as search request being sent every time user hits single
	// key stroke
});
