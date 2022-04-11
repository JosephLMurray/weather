const apiKey = "c9d1090231da8c08f865778a5c890e64";
const cityForm = document.querySelector('#city-form');
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
const currentDay = mm + '/' + dd + '/' + yyyy;

const formSubmitHandler = event => {
    event.preventDefault();
    
    const city = cityName.value.trim();
  
    if (city) {
      getCityCoords(city);
      cityName.value = '';
    } else {
      alert('Please enter a valid City Name');
    }
  };

const getCityCoords = city => {
    const geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

    fetch(geoAPI)
        .then((response) => {
            if (response.ok) {
            response.json().then((data) => {
                if (data.length > 0) {  
                    appendStorage(data[0].name, data[0].lat, data[0].lon);
                    addCityButton(data[0].name, data[0].lat, data[0].lon);
                    generateCards(data[0].name, data[0].lat, data[0].lon);
                } else {
                    alert('Please enter a valid City Name');
                }
            });
            } else {
            console.error(response.statusText);
            }
        })
        .catch((error) => {
           console.error('Unable to connect to Open Weather', error);
        });
};

const addCityButton = (cityName, cLat, cLon) => {
    const cityButtons = `<div class="row no-gutters my-3" id="${cityName}">` +
                        `<div class="col-11">` +
                            `<button class= "btn btn-block btn-light text-dark font-weight-bold" onclick="generateCards('${cityName}', ${cLat}, ${cLon})">${cityName}</button>` +
                        `</div>` +
                        `<div class="col-1">` +
                            `<button class="btn btn-danger" onclick="deleteCity('${cityName}')">X</button>` +
                        `</div>` +
                      `</div>`; 
    document.getElementById("cityListings").innerHTML += cityButtons
};

const appendStorage = (cityName, cLat, cLon) => {
    const cities = JSON.parse(localStorage.getItem("cities")) ?? [];
    cities.push({cName: cityName, lat: cLat, lon: cLon});
    localStorage.setItem("cities", JSON.stringify(cities)); 
};

const storageInit = () => {
    const cities = JSON.parse(localStorage.getItem("cities")) ?? [];
    cities.forEach(city => {
        addCityButton(city.cName, city.lat, city.lon);
    });
};

const generateCards = (name, lat, lon) => {
    const oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(oneCallAPI)
        .then((response) => {
            if (response.ok) {
            response.json().then((data) => {
                let current = data.current;
                createPrimaryCard(name, currentDay, current.weather[0].icon, current.temp, current.wind_speed, current.humidity, current.uvi);
                chooseUVColor(current.uvi);
                generateDeck(data.daily);
            });
            } else {
            console.error('Error: ' + response.statusText);
            }
        })
        .catch((error) => {
            console.error('Unable to connect to Open Weather', error);
        });
};

const createPrimaryCard = (city, date, emoji, temp, wind, humidity, uv) => {
    const primary = `<h2 class="font-weight-bold card-title date">${city} (${date}) <img id="wicon" src="http://openweathermap.org/img/w/${emoji}.png" alt="Weather icon"></h2>` +
                  `<p class="temp">Temp: ${temp}</p>` +
                  `<p class="wind">Wind: ${wind}</p>` +
                  `<p class="humidity">Humidity: ${humidity}</p>` +
                  `<p>UV Index: <span id="uvIndex" class="text-white btn">${uv}</span></p>`;
    document.getElementById("currentCity").innerHTML = primary;
};

const generateDeck = (data) => {
    let fiveDayCards = '';
    document.getElementById("fiveDay").innerHTML = fiveDayCards;
    for (let i = 0; i < 5; i++) {
        fiveDayCards += `<div class="">` +
                            `<div class="card bg-dark text-white p-3">` +
                                `<h3 class="font-weight-bold date">${mm + '/' + String(today.getDate() + parseInt([i]) + 1).padStart(2, '0') + '/' + yyyy}</h3>` +
                                `<div class="card-body">` +
                                    `<p><img id="wicon" src="http://openweathermap.org/img/w/${data[i].weather[0].icon}.png" alt="Weather icon"></p>` +
                                    `<p class="temp">Temp: ${data[i].temp.day}</p>` +
                                    `<p class="wind">Wind: ${data[i].wind_speed}</p>` +
                                    `<p class="humidity">Humidity: ${data[i].humidity}</p>` +   
                                `</div>` +
                            `</div>` +
                        `</div>`
    }
    document.getElementById("fiveDay").innerHTML += fiveDayCards;
    document.getElementById("hideBlock").classList.remove("d-none");
};

const chooseUVColor = uv => {
    const uvColor = document.getElementById("uvIndex");
    uv < 4 ? uvColor.classList.add("bg-success") :
    uv > 8 ? uvColor.classList.add("bg-danger") :
    uvColor.classList.add("bg-warning");
};

const deleteCity = cityName => {
    const cities = JSON.parse(localStorage.getItem("cities"));
    const newCities = cities.filter(city => city.cName !== cityName);
    localStorage.setItem("cities", JSON.stringify(newCities));
    document.getElementById(cityName).remove();
};

const loadFirstCity = () => {
    const cities = JSON.parse(localStorage.getItem("cities")) ?? [];
    if (cities.length > 0) {
        generateCards(cities[0].cName, cities[0].lat, cities[0].lon)
    }
};

storageInit();
loadFirstCity();
cityForm.addEventListener('submit', formSubmitHandler);