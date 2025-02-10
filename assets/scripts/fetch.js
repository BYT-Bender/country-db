document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get('c');

    if (countryName) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
            if (!response.ok) {
                throw new Error('Country not found');
            }
            const countryData = await response.json();
            document.dispatchEvent(new CustomEvent('countryDataLoaded', { detail: countryData }));
        } catch (error) {
            console.error('Error fetching country data:', error);
        }
    }
});
