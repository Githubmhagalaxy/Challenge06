$(document).ready(() => {
    showHistory();
    $('#serachForm').on('submit', e => {
        e.preventDefault();
        var cityName = $('#cityName').val();
        getCurrentWeather(cityName);
        $('#cityName').val("");
    });

});
var gloablcity = "";
const getCurrentWeather = city => {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=2f8fb68d8a7d1a7c67cfaf83eb3b36dc`,
        type: "GET",
        dataType: "json",
        success: data => {
            console.log(data);
            gloablcity = data.name;
            getForecast(data.coord.lat, data.coord.lon);
            let history;
            if(localStorage.getItem('history')) {
                history = JSON.parse(localStorage.getItem('history'));
                history = [...history, `${gloablcity}`];
                localStorage.setItem('history', JSON.stringify(history));
            } else {
                history = [`${gloablcity}`];
                localStorage.setItem('history', JSON.stringify(history));
            }
            showHistory();
        },
        error: err => {
            console.error(err);
            window.alert('City Not Found');
        }
    })
};
const getForecast = (lat, lon) => {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=2f8fb68d8a7d1a7c67cfaf83eb3b36dc`,
        type: "GET",
        dataType: "json",
        success: data => {
            console.log(data);
            showData(data);
        },
        error: err => {
            console.error(err);
        }
    })
};
const showData = data => {
    let uvi = data.current.uvi,
        className;
    if(uvi < 3) {
        className = "low";
    } else if(uvi < 6) {
        className = "moderate";
    } else if(uvi < 8) {
        className = "high";
    } else if(uvi < 11) {
        className = "very-high";
    } else {
        className = "extreme";
    }
    let tmp;
    tmp = `<h2 class="current-city"><span id="name">${gloablcity}</span> <span id="date">${moment(data.current.dt * 1000).calendar(true)}</span> <span id="icon"><img src="http://openweathermap.org/img/w/${data.current.weather[0].icon}.png"></span></h2>
                <p id="temp">Temperature: <span>${data.current.temp}</span> °F</p>
                <p id="hue">Humidity: <span>${data.current.humidity}</span> %</p>
                <p id="speed">Wind Speed: <span>${data.current.wind_speed}</span> MPH</p>
                <p id="uv">UV Index: <span class="${className}">${data.current.uvi}</span></p>`;
    $('#currentInfoWrapper').html(tmp);
    // show 5 day forecast
    tmp = "";
    let list = $('#forecastList');
    $('#forecastList li').remove();
    for(let i=1; i<6; i++) {
        tmp = `<li>
                    <div class="date">${moment(data.daily[i].dt * 1000).calendar(true)}</div>
                    <div class="img"><img src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"></div>
                    <div class="temp">Temp: <span>${data.daily[i].temp.day}</span> °F</div>
                    <div class="hue">Humidity: <span>${data.daily[i].humidity}</span>%</div>
                </li>`;
        list.append(tmp);
    }
    $('.r-col').css('display', 'block');
    $('#sound').get(0).play();
};
const showHistory = () => {
    let history = $('#historyList');
    $('#historyList li').remove();
    let list = JSON.parse(localStorage.getItem('history'));
    if(list) {
        list = list.filter((value, index) => {
            return (list.indexOf(value) === index);
        });
    }
    $(list).each((i, elem) => {
        history.append(`<li>${elem}</li>`);
    });
    $('#historyList li').on('click', e => {
        e.preventDefault();
        getCurrentWeather(e.currentTarget.innerText);
    })
};