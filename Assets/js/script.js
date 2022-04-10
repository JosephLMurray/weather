const apiKey = "c9d1090231da8c08f865778a5c890e64";
const cityForm = document.querySelector('#city-form');
const citiesList = document.getElementById(cityListings);


const formSubmitHandler = event => {
    event.preventDefault();
    
    let city = ''
    city = cityName.value;
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
        .then(function (response) {
            if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
              appendStorage(data[0].name, data[0].lat, data[0].lon);
              addCityButton(data[0].name, data[0].lat, data[0].lon);
              generateCards(data[0].lat, data[0].lon);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
};

const addCityButton = (cityName, cLat, cLon) => {
    let cityButtons = '';
    cityButtons = `<p class= "btn btn-block btn-secondary text-dark font-weight-bold" onclick="generateCards(${cLat, cLon})">${cityName}</p>`

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

generateCards = (lat, lon) => {
    let oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(oneCallAPI)
        .then(function (response) {
            if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
};


storageInit();
cityForm.addEventListener('submit', formSubmitHandler);