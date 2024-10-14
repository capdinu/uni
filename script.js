document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
  });
  
  let universitiesData = [];
  let filteredUniversities = [];
  let currentPage = 1;
  const universitiesPerPage = 10;
  
  document.getElementById('SearchBtn').addEventListener('click', async () => {
    const country = document.getElementById('countryDropdown').value;
    if (country === '') {
      alert('Please select a country from the dropdown.');
      return;
    }
    currentPage = 1; 
    await fetchUniversities(country);
  });
  
 
  function showUniversityFilter() {
    const universityFilter = document.getElementById('universityFilter');
    universityFilter.style.display = 'block'; 
  }
  
 
  document.getElementById('universitySearch').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    
 
    filteredUniversities = universitiesData.filter(university => 
      university.name.toLowerCase().includes(searchQuery) 
    );
    
    currentPage = 1; 
    displayUniversities(filteredUniversities, currentPage);
  });
  
  async function fetchUniversities(country) {
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');
    
    resultsContainer.innerHTML = ''; 
    loader.style.display = 'block'; 
    
    try {
      const response = await fetch(`http://universities.hipolabs.com/search?country=${country}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      universitiesData = await response.json();
      filteredUniversities = universitiesData;
      if (universitiesData.length === 0) {
        resultsContainer.innerHTML = `<p>No universities found for ${country}.</p>`;
      } else {
        displayUniversities(universitiesData, currentPage);
        showUniversityFilter(); 
      }
    } catch (error) {
      resultsContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    } finally {
      loader.style.display = 'none'; 
    }
  }
  
 
  function displayUniversities(universities, page) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; 
  
    const start = (page - 1) * universitiesPerPage;
    const end = start + universitiesPerPage;
    const paginatedUniversities = universities.slice(start, end);
  
    paginatedUniversities.forEach(university => {
      const logoUrl = `https://logo.clearbit.com/${new URL(university.web_pages[0]).hostname}`;
      const defaultLogoUrl = 'University-of-the-Philippines-Logo.png'; 
  
      const universityElement = document.createElement('div');
      universityElement.classList.add('card');
      universityElement.innerHTML = `
        <img src="${logoUrl}" alt="${university.name} Logo" class="university-logo" onerror="this.onerror=null;this.src='${defaultLogoUrl}';">
        <h3>${university.name}</h3>
        <p>${university.country}</p>
        <a href="${university.web_pages[0]}" target="_blank">Visit Website</a>
      `;
      resultsContainer.appendChild(universityElement);
    });
  
 
    const totalPages = Math.ceil(universities.length / universitiesPerPage);
  
  
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');
  
   
    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.disabled = page === 1; 
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayUniversities(universities, currentPage);
      }
    });
    paginationContainer.appendChild(prevButton);
  
 
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const pageNumberButton = document.createElement('button');
        pageNumberButton.textContent = i;
        if (i === page) {
          pageNumberButton.classList.add('active'); 
        }
        pageNumberButton.addEventListener('click', () => {
          currentPage = i;
          displayUniversities(universities, currentPage);
        });
        paginationContainer.appendChild(pageNumberButton);
      }
    }
  
  
    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.disabled = page === totalPages; 
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayUniversities(universities, currentPage);
      }
    });
    paginationContainer.appendChild(nextButton);
  
    resultsContainer.appendChild(paginationContainer);
  }
  
  async function fetchCountries() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; 
    
    try {
      const countries = await fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => data.map(country => country.name.common))
        .catch(error => console.error('Error fetching countries:', error));
  
      const countryDropdown = document.getElementById('countryDropdown');
      countries.sort().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      loader.style.display = 'none'; 
    }
  }
  
  const  abcd = math.floor(math.rondom()* 6 + 1);