function shortNumberFormat(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(3) + " billion";
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(3) + " million";
    } else {
        return num.toString();
    }
}



document.addEventListener('countryDataLoaded', function(event) {
    const countryData = event.detail[0];

    getTemperature(countryData.latlng[0], countryData.latlng[1], apiKey)
        .then(temp => tempContainer.textContent = `${temp}°C`)
        .catch(err => console.error(err));

    const bgEffect = document.querySelector(".bg-effect");
    bgEffect.style.backgroundImage = `url(${countryData.flags.svg})`;

    const countryName = document.getElementById("country-name");
    const countryCapital = document.getElementById("country-capital");

    countryName.textContent = `${countryData.name.official} (${countryData.name.common})`;
    countryCapital.textContent = countryData.capital[0];



    const locationWrapper = document.getElementById("location-wrapper");

    locationWrapper.innerHTML = `
        <header>Geographical Details</header>
        <div class="inner-wrapper">
            <div class="row">Region: ${countryData.subregion}</div>
            <div class="row">Latitude: ${countryData.latlng[0]}</div>
            <div class="row">Longitude: ${countryData.latlng[1]}</div>
            <div class="sbr"></div>
            <a class="chip-link" href="${countryData.maps.googleMaps}" target="_blank">
                <div class="chip">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                        </svg>
                    </div>
                    <span>View on Google Maps</span>
                </div>
            </a>
        </div>`;
    

    const languageWrapper = document.getElementById("language-wrapper");

    languageWrapper.innerHTML = `
        <header>Official Languages</header>
        <div class="inner-wrapper">
            ${Object.values(countryData.languages).map(lang => `<div class="row">${lang}</div>`).join('')}
        </div>`;

        
    const akaWrapper = document.getElementById("aka-wrapper");

    akaWrapper.innerHTML = `
        <header>Alternative Names</header>
        <div class="inner-wrapper">
            ${Object.entries(countryData.name.nativeName).map(([key, value]) => `
                <div class="row"><span class="muted">${key.toUpperCase()}:</span> ${value.official} (${value.common})</div>
            `).join('')}
        </div>`;

        
    const telecomWrapper = document.getElementById("telecom-wrapper");
    const iddCodes = countryData.idd.suffixes.map(suffix => countryData.idd.root + suffix).join(", ");
    
    telecomWrapper.innerHTML = `
        <header>Telecommunication & Postal</header>
        <div class="inner-wrapper">
            <div class="row">IDD Code: ${iddCodes}</div>
            <div class="row">Postal Code Format: ${countryData.postalCode.format}</div>
        </div>`;


    const statusWrapper = document.getElementById("status-wrapper");
    const formattedStatus = countryData.status
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    statusWrapper.innerHTML = `
        <header>Country Status</header>
        <div class="inner-wrapper">
            <div class="row">Independent: ${(countryData.independent) ? "YES" : "NO"}</div>
            <div class="row">Status: ${formattedStatus}</div>
        </div>`;


    const currencyWrapper = document.getElementById("currency-wrapper");
    const currencies = Object.entries(countryData.currencies)
        .map(([code, details]) => `<div class="row"><span class="muted">[${code}]</span> ${details.name} (${details.symbol})</div>`)
        .join("");

    currencyWrapper.innerHTML = `
        <header>Currency & Exchange Rate</header>
        <div class="inner-wrapper">
            ${currencies}
            <!-- <div class="row">Exchange Rate (USD to INR): 1 USD ≈ 83 INR</div> -->
        </div>`;



    const borderStatus = document.querySelector("#border-status .inner-wrapper");

    borderStatus.innerHTML = `<div class="row">Landlocked: ${(countryData.landlocked) ? "YES" : "NO"}</div>`;

    const borders = countryData.borders || [];
    
    if (borders.length > 0) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`)
            .then(response => response.json())
            .then(borderCountries => {
                const borderHTML = borderCountries
                    .map(country => `
                        <a href="search.html?c=${encodeURIComponent(country.name.common)}">
                            <div class="card">
                                <div class="icon">
                                    <svg data-src="assets/maps/${country.cca2.toLowerCase()}/vector.svg" fill="#fff"></svg>
                                </div>
                                <span>${country.name.common}</span>
                            </div>
                        </a>
                    `)
                    .join("");
                
                borderStatus.innerHTML += `<div class="neighbors">${borderHTML}</div>`;
            })
            .catch(error => console.error("Error fetching border countries:", error));
    } else {
        borderStatus.innerHTML += "<p>No border countries</p>";
    }
    
        
    const unMemberStatus = document.querySelector("#un-member-status");
    if (countryData.unMember) unMemberStatus.classList.add("active");

    unMemberStatus.innerHTML = `
        <img src="assets/icons/UN_emblem_blue.svg" alt="UN">
        <span>${countryData.unMember ? "UN Member" : "Non-UN Member"}</span>`;
    

    const flag = document.getElementById("flag");
    const coatOfArms = document.getElementById("coat-of-arms");

    flag.innerHTML = `<img src="${countryData.flags.svg}" alt="${countryData.flags.alt}">`;
    coatOfArms.innerHTML = `<img src="${countryData.coatOfArms.svg}" alt="Coat of arms">`;
    
    
    const mapWrapper = document.getElementById("map-wrapper");
    
    mapWrapper.innerHTML = `
                <img src="assets/maps/${countryData.cca2.toLowerCase()}/vector.svg" alt="">
                <div class="overlay">
                    <div class="row">
                        <div class="icon">
                            <svg data-src="assets/icons/aspect-ratio.svg"></svg>
                        </div>
                        <span>${shortNumberFormat(countryData.population)} km²</span>
                    </div>
                    <div class="row">
                        <div class="icon">
                            <svg data-src="assets/icons/people-fill.svg"></svg>
                        </div>
                        <span>${shortNumberFormat(countryData.area)}</span>
                    </div>
                </div>`;

});
