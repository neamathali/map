const continents = {
    "Africa": [
        { name: "Nigeria", population: 223000000, area: 923769, gdp: 514800 },
        { name: "Ethiopia", population: 120000000, area: 1104300, gdp: 96000 },
        { name: "Egypt", population: 104000000, area: 1001450, gdp: 303200 },
        { name: "South Africa", population: 60000000, area: 1219090, gdp: 349800 }
    ],
    "Asia": [
        { name: "China", population: 1439300000, area: 9596961, gdp: 16850000 },
        { name: "India", population: 1393400000, area: 3287263, gdp: 2875140 },
        { name: "Japan", population: 126000000, area: 377975, gdp: 4937000 },
        { name: "South Korea", population: 51800000, area: 100210, gdp: 1640000 }
    ],
    "Europe": [
        { name: "Germany", population: 83000000, area: 357022, gdp: 3846000 },
        { name: "France", population: 67000000, area: 551695, gdp: 2715000 },
        { name: "United Kingdom", population: 66000000, area: 243610, gdp: 2713000 },
        { name: "Italy", population: 60000000, area: 301340, gdp: 2074000 }
    ],
    "North America": [
        { name: "United States", population: 331000000, area: 9833517, gdp: 21433000 },
        { name: "Mexico", population: 128000000, area: 1964375, gdp: 1302000 },
        { name: "Canada", population: 38000000, area: 9976140, gdp: 1643000 }
    ],
    "South America": [
        { name: "Brazil", population: 213000000, area: 8515767, gdp: 2205000 },
        { name: "Argentina", population: 46000000, area: 2780400, gdp: 640000 },
        { name: "Colombia", population: 52000000, area: 1141748, gdp: 400000 }
    ],
    "Australia": [
        { name: "Australia", population: 26000000, area: 7692024, gdp: 1400000 }
    ],
    "Antarctica": [
        { name: "Antarctica", population: 1000, area: 14000000, gdp: 0 } // Temporary, no permanent residents
    ]
};
document.addEventListener("DOMContentLoaded", () => {
    const continentList = document.getElementById('continent-list');
    const countryInfo = document.getElementById('country-info');
    const searchBar = document.getElementById('searchBar');

    // Fetch data from the REST Countries API
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Process the data to organize countries by continent
            const continents = {};

            data.forEach(country => {
                if (country.continents) {
                    country.continents.forEach(continent => {
                        if (!continents[continent]) {
                            continents[continent] = [];
                        }
                        const countryDetails = {
                            name: country.name.common,
                            population: country.population,
                            area: country.area,
                            gdp: country.gdp ? country.gdp.total : 'N/A'
                        };
                        continents[continent].push(countryDetails);
                    });
                }
            });

            // Populate the continent list
            Object.keys(continents).forEach(continent => {
                const li = document.createElement('li');
                li.textContent = continent;
                li.addEventListener('click', () => showCountries(continent, continents));
                continentList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    function showCountries(continent, continents) {
        countryInfo.innerHTML = `<h2>${continent}</h2>`;
        const countries = continents[continent].sort((a, b) => b.population - a.population);

        countries.forEach((country, index) => {
            const countryElement = document.createElement('div');
            countryElement.className = 'country';
            countryElement.innerHTML = `
                <h3>${index + 1}. ${country.name}</h3>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Area: ${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</p>
                <p>GDP: ${country.gdp !== 'N/A' ? '$' + country.gdp.toLocaleString() : 'N/A'}</p>
            `;
            countryInfo.appendChild(countryElement);
        });
    }

    // Search functionality
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        document.querySelectorAll('.country').forEach(country => {
            const countryName = country.querySelector('h3').textContent.toLowerCase();
            country.style.display = countryName.includes(query) ? 'block' : 'none';
        });
    });
});
// Add buttons in HTML for sorting
/*
<button id="sortByPopulation">Sort by Population</button>
<button id="sortByArea">Sort by Area</button>
<button id="sortByGDP">Sort by GDP</button>
*/

// JavaScript for sorting functionality
document.getElementById('sortByPopulation').addEventListener('click', () => {
    showCountries(currentContinent, continents, 'population');
});

document.getElementById('sortByArea').addEventListener('click', () => {
    showCountries(currentContinent, continents, 'area');
});

document.getElementById('sortByGDP').addEventListener('click', () => {
    showCountries(currentContinent, continents, 'gdp');
});

function showCountries(continent, continents, sortBy = 'population') {
    countryInfo.innerHTML = `<h2>${continent}</h2>`;
    const countries = continents[continent].sort((a, b) => {
        if (sortBy === 'population') return b.population - a.population;
        if (sortBy === 'area') return (b.area || 0) - (a.area || 0);
        if (sortBy === 'gdp') return (b.gdp || 0) - (a.gdp || 0);
        return 0;
    });

    countries.forEach((country, index) => {
        const countryElement = document.createElement('div');
        countryElement.className = 'country';
        countryElement.innerHTML = `
            <h3>${index + 1}. ${country.name}</h3>
            <p>Population: ${country.population.toLocaleString()}</p>
            <p>Area: ${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</p>
            <p>GDP: ${country.gdp !== 'N/A' ? '$' + country.gdp.toLocaleString() : 'N/A'}</p>
        `;
        countryInfo.appendChild(countryElement);
    });
}
const map = L.map('map').setView([0, 0], 2); // Initial position

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add interactive layer for countries
// Assuming you have GeoJSON data for countries
L.geoJSON(geojsonData, {
    onEachFeature: function (feature, layer) {
        layer.on('click', function () {
            alert(`Country: ${feature.properties.name}`);
        });
    }
}).addTo(map);


function getCountryValue(countryElement, criteria) {
    switch (criteria) {
        case 'population':
            return parseInt(countryElement.querySelector('.population').textContent.replace(/,/g, ''));
        case 'area':
            return parseInt(countryElement.querySelector('.area').textContent.replace(/,/g, ''));
        case 'gdp':
            return parseInt(countryElement.querySelector('.gdp').textContent.replace(/,/g, ''));
        default:
            return 0;
    }
}

const countries = []; // Populate this with country names from data

searchBar.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const suggestions = countries.filter(country => country.toLowerCase().includes(query));
    showSuggestions(suggestions);
});

function showSuggestions(suggestions) {
    // Display a list of suggestions below the search bar
}
