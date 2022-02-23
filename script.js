const form = document.getElementById("form");
const input = document.querySelector("input");
const ContentDOM = document.querySelector(".cities");
const clearALL = document.querySelector(".clear");
const errorMessage = document.getElementById("message");
const errorMessageDOM = document.querySelector(".notification");

let id = 0;


form.addEventListener("submit", e => {
  e.preventDefault();
  let citySearch = input.value;
  errorMessageDOM.style.display = "none";

  /* -----CHECK IF CITY IS DISPLAYED ALREADY----- */
  const listOfCities = ContentDOM.querySelectorAll(".cities .city");
  /* convert nodeList to array */
  const listOfCitiesArray = Array.from(listOfCities);

  if(listOfCitiesArray.length > 0) {
    const filteredArray = listOfCitiesArray.filter(item => {
      let content = "";

      if(citySearch.includes(",")) {
        if (citySearch.split(",")[1].length > 2) {
          citySearch = citySearch.split(",")[0];
          content = item.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = item.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = item.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == citySearch.toLowerCase();
    });

    if(filteredArray.length > 0) {
      errorMessage.textContent = "Weather info for this city has been displayed already, enter a different city or add country code after a comma";

      errorMessageDOM.style.display = "block";

      form.reset();
      input.focus();
      return;
    }
  }
  /* --fetch data-- */
  apiRequest(citySearch).then(displayData).catch(() => {
    errorMessage.textContent = "The city name entered is not valid. To add country code, ensure to place a comma after city name. (E.g lagos,ng)";
    errorMessageDOM.style.display = "block";
  });
  form.reset();
  input.focus();
});

/* ----Function to Fetch data------ */
async function apiRequest(citySearch) {
  const key = "49735a5e889c4917d065864e72a06bfc";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${key}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

/* --- function to destructure and present data to UI --- */
function displayData(data) {
  /* console.log('resolved', data); */
  const {main, name, sys, weather} = data;

  let cityName = name;
  let country = sys.country;
  let iconElement = weather[0].icon;
  let tempElement = Math.floor(main.temp);
  let description = weather[0].description;
  

  const cityData = `<div class="city" id ="${id}">
          <div class="close">
            <i class="fa fa-close" id="close"></i>
          </div>
          <h2 class="city-name" data-name= "${cityName},${country}">
            <span>${cityName}</span> ${country}
          </h2>
          <div class="weather-icon">
            <img src="icons/${iconElement}.png" alt="">
          </div>
          <div class="temperature-value">
            <span id="city-temp">${tempElement}</span><span>&deg;C</span>
          </div>
          <p id="temp-description">${description}</p>
        </div>`;

  ContentDOM.insertAdjacentHTML("afterbegin", cityData);
  /* console.log(cityName, country, iconElement, tempElement, description, id); */
  id++;
  
}


/* ----To delete single search result----- */
ContentDOM.addEventListener("click", (e) => {
  let element = e.target;
  const elementId = element.id;
  
  if(elementId == "close") {
    element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
  }
});


/* ----To clear all search results----- */
clearALL.addEventListener("click", () => {
  ContentDOM.innerHTML = "";
})


