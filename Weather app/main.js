const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    forecast = document.getElementById ("forecast"),
    mainIcon = document.getElementById("icon"),
    uvindex = document.querySelector(".uv-index"),
    uvtext = document.querySelector(".uv-text"),
   windstatus= document.querySelector(".wind-status"),
    sunrise = document.querySelector(".sunrise-time"),
    sunset = document.querySelector(".sunset-time"),
    humidity = document.querySelector(".humidity-index"),
    humidityStatus = document.querySelector(".humidity-text"),
    visibility = document.querySelector(".visibility-index"),
    visibilityStatus = document.querySelector(".visibility-text"),
    airQuality = document.querySelector(".airquality-index"),
    airqualityStatus = document.querySelector(".airquality-text")
   ;
let  currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";
let lon = "";
let lat = "";

function getDateTime() {
    let now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    minute = minute < 10 ? '0' + minute : minute;



    let day = days[now.getDay()];
    return `${day}, ${hour}:${minute}`;
}

date.innerText = getDateTime();

setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

function fetchAPI(){

    fetch ("https://geolocation-db.com/json/",
    {
        method : "GET",
    })
    .then((response)=> response.json())
    .then((data) =>{
        console.log(data);
        lat = data.latitude;
        lon = data.longitude;
        currentCity = data.currentCity;
        fetchWeather(data.city, currentUnit, hourlyorWeek);
    } );
    
}

fetchAPI();


function fetchWeather(city, unit, hourlyorWeek){
    const apiKey = "ea51f176dc22c406af37d1c7426a82f8";


    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}` ,
    {
        method : "GET",
    })
    .then((response) => response.json())
    .then((data) =>{
        console.log(data);
        let today = data.current;
        if (unit === "c"){
            temp.innerText = today.temp;
        }else{
            temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText =data.resolvedAddress;
        condition.innerText = today.conditions;
        forecast.innerText = "Perc - " + today.precipprob + "%";
       measureUVIndex(today.uvi);
        sunrise.innerText = today.sunrise;
        sunset.innerText = today.sunset;
        humidity.innerText = today.humidity;
        visibility.innerText = today.visibility;
        windstatus.innerText = today.windspeed; 
        airQuality.innerText = today.winddir;

    });
}

function celciusToFahrenheit(temp){
    return ((temp*9)/5+32).toFixed(1);
}

function measureUVIndex(uvindex){
    if (uvindex <= 2){
        uvtext.innerText = "Low";
    }
    else if(uvindex <= 5){
        uvtext.innerText = "Moderate";
    }
    else if(uvindex <= 7){
        uvtext.innerText = "High";
    }
    else if(uvindex <= 10){
        uvtext.innerText = "Very High";
    }
    else{
        uvtext.innerText = "Extreme";
    }
}
