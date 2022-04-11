const apiKey = "c9d1090231da8c08f865778a5c890e64";
const cityForm = document.querySelector('#city-form');
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
const currentDay = mm + '/' + dd + '/' + yyyy;

const formSubmitHandler = event => {
    event.preventDefault();
    
    let city = cityName.value.trim();
    console.log(city);
  
    if (city) {
      getCityCoords(city);
      cityName.value = '';
    } else {
      alert('Please enter a valid City Name');
    }
  };

const getCityCoords = city => {
    let geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

    fetch(geoAPI)
        .then((response) => {
            if (response.ok) {
            console.log(response);
            response.json().then((data) => {  
                appendStorage(data[0].name, data[0].lat, data[0].lon);
                addCityButton(data[0].name, data[0].lat, data[0].lon);
                generateCards(data[0].name, data[0].lat, data[0].lon);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to Open Weather');
        });
};

const addCityButton = (cityName, cLat, cLon) => {
    let cityButtons = `<p class= "btn btn-block btn-light text-dark font-weight-bold" onclick="generateCards('${cityName}', ${cLat}, ${cLon})">${cityName}</p>`

    document.getElementById("cityListings").innerHTML += cityButtons
};

const appendStorage = (cityName, cLat, cLon) => {
    let cities = JSON.parse(localStorage.getItem("cities")) ?? [];
    cities.push({cName: cityName, lat: cLat, lon: cLon});
    localStorage.setItem("cities", JSON.stringify(cities)); 
};

const storageInit = () => {
    let cities = JSON.parse(localStorage.getItem("cities")) ?? [];
    cities.forEach(city => {
        addCityButton(city.cName, city.lat, city.lon);
    });
};

const generateCards = (name, lat, lon) => {
    let oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(oneCallAPI)
        .then((response) => {
            if (response.ok) {
            response.json().then((data) => {
                console.log(data);
                let current = data.current;
                primaryCard(name, currentDay, current.weather[0].icon, current.temp, current.wind_speed, current.humidity, current.uvi);
                generateDeck(data.daily);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to Open Weather');
        });
};

const primaryCard = (city, date, emoji, temp, wind, humidity, uv) => {
    let primary = `<h2 class="font-weight-bold card-title date">${city} (${date}) <img id="wicon" src="http://openweathermap.org/img/w/${emoji}.png" alt="Weather icon"></h2>` +
                  `<p class="temp">Temp: ${temp}</p>` +
                  `<p class="wind">Wind: ${wind}</p>` +
                  `<p class="humidity">Humidity: ${humidity}</p>` +
                  `<p id="uvIndex">UV Index: ${uv}</p>`;
    document.getElementById("currentCity").innerHTML = primary;
};

const generateDeck = (data) => {
    let fiveDayCards = '';
    document.getElementById("fiveDay").innerHTML = fiveDayCards;
    for (let i = 0; i < 5; i++) {
        fiveDayCards += `<div class="">` +
                        `<div class="card bg-dark text-white p-3">` +
                        `<h3 class="font-weight-bold date">${mm + '/' + String(today.getDate() + parseInt([i])).padStart(2, '0') + '/' + yyyy}</h3>` +
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
};

storageInit();
cityForm.addEventListener('submit', formSubmitHandler);