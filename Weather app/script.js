const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    forecast = document.getElementById("forecast"),
    mainIcon = document.getElementById("icon"),
    uvindex = document.querySelector(".uv-index"),
    uvtext = document.querySelector(".uv-text"),
    windstatus = document.querySelector(".wind-status"),
    sunrise = document.querySelector(".sunrise-time"),
    sunset = document.querySelector(".sunset-time"),
    humidity = document.querySelector(".humidity-index"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    celciusBtn = document.querySelector(".celcius"),
    hourlyBtn = document.querySelector(".hourly"),
    weeklyBtn = document.querySelector(".weekly"),
    tempUnit  = document.querySelectorAll(".unit-options"),
humidityStatus = document.querySelector(".humidity-text"),
    visibility = document.querySelector(".visibility-index"),
    visibilityStatus = document.querySelector(".visibility-text"),
    airQuality = document.querySelector(".airquality-index"),
    airqualityStatus = document.querySelector(".airquality-text"),
    weatherCards = document.querySelector("#weather-cards")
    ;
let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";
let cardIcon = "";

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

function fetchAPI() {

    fetch("https://geolocation-db.com/json/",
        {
            method: "GET"
            
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
           fetchWeather(currentCity, currentUnit, hourlyorWeek);
        });

}

fetchAPI();


function fetchWeather(city, unit, hourlyorWeek) {
    const apiKey = "SRXNWLP3BPC82PHKHAC4Q3BLS";


    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerHTML = `${(today.temp)} <span class="temp-unit"><sup><sup>o</sup>C</sup></span>`;
            } else {
                temp.innerHTML = `${celciusToFahrenheit(today.temp)} <span class="temp-unit"><sup><sup>o</sup>F</sup></span>`;
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            forecast.innerText = "Perc - " + today.precipprob + "%";
            uvindex.innerText = today.uvindex;
            humidity.innerText = today.humidity;
            visibility.innerText = today.visibility;
            windstatus.innerText = today.windspeed;
            airQuality.innerText = today.winddir;
            measureUVIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirqualityStatus(today.winddir);
            sunrise.innerText = convertTo12hrFormat(today.sunrise);
            sunset.innerText = convertTo12hrFormat(today.sunset);
            
            cardIcon.innerText = today.icon;
            mainIcon.src = getIcon(today.icon);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            }
            else {
                updateForecast(data.days, unit, "week");
            }
        });

       
}




function celciusToFahrenheit(temp) {
    return ((temp)*(9/5) +32).toFixed(1);
}

function measureUVIndex(uvindex) {
    if (uvindex <= 2) {
        uvtext.innerText = "Low";
    }
    else if (uvindex <= 5) {
        uvtext.innerText = "Moderate";
    }
    else if (uvindex <= 7) {
        uvtext.innerText = "High";
    }
    else if (uvindex <= 10) {
        uvtext.innerText = "Very High";
    }
    else {
        uvtext.innerText = "Extreme";
    }
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    }
    else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    }
    else {
        humidityStatus.innerText = "High";
    }
}

function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    }
    else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    }
    else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    }
    else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    }
    else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    }
    else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    }
    else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    }
    else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

function updateAirqualityStatus(airQuality) {
    if (airQuality <= 50) {
        airqualityStatus.innerText = "Good";
    }
    else if (airQuality <= 100) {
        airqualityStatus.innerText = "Moderate";
    }
    else if (airQuality <= 150) {
        airqualityStatus.innerText = "Unhealthy for Sensitive People";
    }
    else if (airQuality <= 200) {
        airqualityStatus.innerText = "Unhealthy";
    }
    else if (airQuality <= 250) {
        airqualityStatus.innerText = "Very Unhealthy";
    }
    else {
        airqualityStatus.innerText = "Hazardous";
    }
}

function convertTo12hrFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    minute = minute < 10 ? '0' + minute : minute;

    let strTime = hour + ':' + minute + " " + ampm;
    return strTime;
}


function getIcon(cardIcon) {

    if (cardIcon === "partly-cloudy-day") {
        return "assessts/icons8-partly-cloudy-day.svg";
    }
    else if (cardIcon === "partly-cloudy-night") {
        return "assessts/weather_clouds_night_icon.svg";
    }
    else if (cardIcon === "rainy-day") {
        return "assessts/icons8-rain-cloud-48.svg";
    }
    else if (cardIcon === "rainy-night") {
        return "assessts/icons8-stormy-night.svg";
    }
    else if (cardIcon === "clear-day") {
        return "assessts/icons8-summer.svg";
    }
    else if (cardIcon === "clear-night") {
        return "assessts/night.svg";
    }
    else {
        return "assessts/sun.svg";
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday ", "Friday ", "Saturday", "Sunday"
    ];
    return days[day.getDay()]
}

function getHour(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour} : ${minute} PM`
    }
    else {
        return `${hour} : ${minute} AM`
    }
}

function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let cardNum = 0;

    if (type === "day") {
        cardNum = 24;
    }
    else {
        cardNum = 7;
    }
    for (let i = 0; i < cardNum; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
       let dayName ="";
        if (type === "week") {
             dayName = getDayName(data[day].datetime);
             
        }
        else{
            dayName = getHour(data[day].datetime);
        }

        


        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }

        let conditionIcon = data[day].icon;
        let iconSrc = getIcon(conditionIcon);
        let tempUnit = "C";

        if (unit === "f") {
            tempUnit = "F";
        }
        card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
                        <div class="card-icon">
                            <img src= ${iconSrc}>
                        </div>
                        <div class="day-temp">
                            <h2 class="temp">${dayTemp}</h2>
                            <span class="temp-unit"><sup>o</sup>${tempUnit}</span>
                        </div>
                        `;
        weatherCards.appendChild(card);
        day++;
    }
}

fahrenheitBtn.addEventListener("click", () => {
    switchTemp('f');
    
});
celciusBtn.addEventListener("click", () => {
      switchTemp('c');
      
   });




 
function switchTemp (unit){
    if (currentUnit !== unit){
    currentUnit = unit;

    if (currentUnit === 'c'){
        celciusBtn.classList.add ("active");
        fahrenheitBtn.classList.remove("active");
    }else{
    fahrenheitBtn.classList.add ("active");
    celciusBtn.classList.remove("active");
    }
    
}
fetchAPI();
}


hourlyBtn.addEventListener("click" , ()=> {
    changeTimeSpan ("hourly");
});
weeklyBtn.addEventListener("click" , ()=> {
    changeTimeSpan ("week");
});

function changeTimeSpan(unit){
    if(hourlyorWeek !== unit){
        hourlyorWeek = unit;
        if (unit === 'hourly'){
            hourlyBtn.classList.add("active");
            weeklyBtn.classList.remove("active");
            
        }
        else{
            hourlyBtn.classList.remove("active");
            weeklyBtn.classList.add("active");
        }
        
    }
    fetchAPI();
}

