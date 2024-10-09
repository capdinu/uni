document.getElementById('searchButton').addEventListener('click', fetchUniversities);
document.getElementById('filterInput').addEventListener('input', filterUniversities);

let universities = [];
let filteredUniversities = [];
let currentPage = 1;
const itemsPerPage = 7;


async function getcountri(){
    try{
        const country = await fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            data.map(country => {
                const countryName = country.name.common;
                country[countryName] = country.cca2;
                console.log(data)
            });
            populateCountrySelect();
           
        })
     
         
     
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}
getcountri();

// const displayOption = async () => {
//     const options = await ();
//     for (option of Object.keys(options)) {
//     const newOption = document.createElement("option");
//     console.log(option);
//     newOption.value = option;
//     newOption.text = option.name;
//     batchTrack.appendChild(newOption);
//     }
//     };
//     displayOption();ZAX

 async function populateCountrySelect() {
    const countri = await getcountri();
    const countrySelect = document.getElementById('countrySelect');
    conry
    // for (const country in countri) {
    //     const option = document.createElement('option');
    //     option.value = countri[country];
    //     option.textContent = countri;
    //     countrySelect.appendChild(option);
    //     console.log(countri)
    // }

}
populateCountrySelect();


function fetchUniversities() {
    const country = document.getElementById('countrySelect').value;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results
    universities = []; // Clear previous data

    if (country) {
        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = 'Loading universities...';
        resultsContainer.appendChild(loadingMessage);

        fetch(`http://universities.hipolabs.com/search?country=${country}`)
            .then(response => {
                loadingMessage.remove(); // Remove loading message on response
                return response.json();
            })
            .then(data => {
                universities = data;
                filteredUniversities = universities;
                currentPage = 1;
                displayUniversities();
                setupPagination();
            })
            .catch(error => {
                console.error('Error fetching universities:', error);
                resultsContainer.innerHTML = '<p>There was an error retrieving the data. Please try again later.</p>';
            });
    } else {
        alert('Please select a country.');
    }
}

function displayUniversities() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUniversities = filteredUniversities.slice(startIndex, endIndex);

    if (currentUniversities.length > 0) {
        currentUniversities.forEach(university => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="file:///home/uki/Desktop/uni/img/University-of-the-Philippines-Logo.png" alt="University Logo">
                <h3>${university.name}</h3>
                <p>${university.country}</p>
                <button onclick="window.open('${university.web_pages[0]}', '_blank')">Visit Website</button>
            `;
            resultsContainer.appendChild(card);
        });
    } else {
        resultsContainer.innerHTML = '<p>No universities found for the selected country.</p>';
    }
}

function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);

    const createButton = (text, page) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = page === currentPage;
        button.addEventListener('click', () => {
            currentPage = page;
            displayUniversities();
        });
        paginationContainer.appendChild(button);
    };

    createButton('<', currentPage > 1 ? currentPage - 1 : 1);

    for (let i = 1; i <= totalPages; i++) {
        createButton(i, i);
    }

    createButton('>', currentPage < totalPages ? currentPage + 1 : totalPages);
}

function filterUniversities() {
    const filterText = document.getElementById('filterInput').value.toLowerCase();
    filteredUniversities = universities.filter(university =>
        university.name.toLowerCase().includes(filterText)
    );
    currentPage = 1;
    displayUniversities();
    setupPagination();
}

// Populate country options on DOM load
document.addEventListener('DOMContentLoaded', populateCountrySelect);
