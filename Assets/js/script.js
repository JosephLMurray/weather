const apiKey = "c9d1090231da8c08f865778a5c890e64";
const cityForm = document.querySelector('#city-form');
const oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?";


const formSubmitHandler = event => {
    event.preventDefault();
    
    let city = ''
    city = cityName.value;
    console.log(city);
  
    if (city) {
      getCityCoords(city);
  
      addCityButton(city);
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

const addCityButton = city =>
    

cityForm.addEventListener('submit', formSubmitHandler);