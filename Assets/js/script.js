const apiKey = "c9d1090231da8c08f865778a5c890e64";
const cityForm = document.querySelector('#city-form');
const currentDay = moment().format('L');

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
    let cityButtons = `<p class= "btn btn-block btn-secondary text-dark font-weight-bold" onclick="generateCards('${cityName}', ${cLat}, ${cLon})">${cityName}</p>`

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
                primaryCard(name, currentDay, data.current.weather[0].icon, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi);

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

storageInit();
cityForm.addEventListener('submit', formSubmitHandler);