

const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
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

    const search = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results");


    const onInput = async (event) => {
        // This will fix the issue of sending request after every keystroke
        // It will not send request until user stops typing.
        // If user times new timeout is generated and next time gets cleared
        // then generated again if user stops timeout will be called.

        /* items presents all the data fetched from api related to search
           item presents item user clicked
           eachItem represents each item from items 
        */

        let items = await fetchData(event.target.value);
        if (!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }
        resultsWrapper.innerHTML = "";

        dropdown.classList.add("is-active");

        // Made await so that fetchData doesn't return promises instead of data actually needed.
        for (let eachItem of items) {
            const item = document.createElement("a");
            item.classList.add("dropdown-item");
            // This functionality is not supported with '' single quotes.
            item.innerHTML = renderOption(eachItem);

            item.addEventListener("click", () => {
                dropdown.classList.remove("is-active"); // closing dropdown menu after user clicked on menu
                // Drop down should be closed no matter case that's why this statement is left out of onOptionSelect function.
                search.value = inputValue(eachItem); // setting movie title to userInput
                onOptionSelect(eachItem); // func to extract full available information related to selected movie
            });

            resultsWrapper.appendChild(item);
        }
    };

    // Should not debounce should be called like : debounce( fetchData( event.target.value ) , 500 );


    search.addEventListener("input", debounce(onInput, 500));
    document.addEventListener("click", (event) => {
        if (!root.contains(event.target)) dropdown.classList.remove("is-active");
    });

};
