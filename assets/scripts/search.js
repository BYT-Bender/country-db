const searchInput = document.getElementById("search-input");
const autocompleteList = document.getElementById("search-input-autocomplete-list");

searchInput.addEventListener("keyup", (e) => {
    if (![40, 38, 13].includes(e.keyCode)) {
        showResults(searchInput.value);
    }
});

searchInput.addEventListener("keydown", (e) => {
    const rows = autocompleteList.getElementsByClassName("row");
    if (e.keyCode === 40) { // Arrow Down
        e.preventDefault();
        currentFocus++;
        addActive(rows);
    } else if (e.keyCode === 38) { // Arrow Up
        e.preventDefault();
        currentFocus--;
        addActive(rows);
    } else if (e.keyCode === 13) { // Enter
        e.preventDefault();
        if (currentFocus > -1 && rows[currentFocus]) {
            rows[currentFocus].click();
        } else {
            performSearch(searchInput.value);
        }
    }
});

autocompleteList.addEventListener("mousedown", function(e) {
    e.preventDefault();
});

let currentFocus = -1;

var searchTerms = [];

fetch("assets/data/countries.json")
    .then(response => response.json())
    .then(data => searchTerms = data)
    .catch(error => console.error("Error loading country list: ", error));

function autocompleteMatch(input) {
    if (!input) return [];
    const reg = new RegExp(input, 'i');
    return searchTerms.filter(term => term.match(reg));
}

function showResults(val) {
    autocompleteList.innerHTML = "";
    currentFocus = -1;

    let terms = autocompleteMatch(val);

    // Limit the results to 10
    terms = terms.slice(0, 10);

    if (terms.length === 0) {
        autocompleteList.innerHTML = `
            <div class="row-muted">
                <span>No results found</span>
            </div>
        `;
    } else {
        terms.forEach(term => {
            const row = document.createElement("div");
            row.classList.add("row");
            row.innerHTML = `
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </div>
                <span>${term}</span>
            `;

            row.addEventListener("click", function () {
                searchInput.value = term;
                autocompleteList.innerHTML = "";
                showResults(term);
            });

            autocompleteList.appendChild(row);
        });
    }
}

function addActive(rows) {
    if (!rows || rows.length === 0) return;
    removeActive(rows);

    if (currentFocus >= rows.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = rows.length - 1;
    rows[currentFocus]?.classList.add("autocomplete-active");
}

function removeActive(rows) {
    Array.from(rows).forEach(row => row.classList.remove("autocomplete-active"));
}

function performSearch(value) {
    if (!value.trim()) return;
    const searchUrl = getSearchUrl(value);
    if (searchUrl) window.location.href = searchUrl;
}

function getSearchUrl(value) {
    const query = encodeURIComponent(value);
    return `https://byt-bender.github.io/country-db?c=${query}`;
}
