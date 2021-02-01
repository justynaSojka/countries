var countries = [];
var exchange = {};
var isMapShown = false;
var isNavShown = true;

var preload = new Image();
preload.src = 'img/lighter-dark-map.jpg';

function loadCountry(selectedCountryCode) {
    if (typeof selectedCountryCode == 'undefined') {
        selectedCountryCode = $('#countrySelect').val();
    }
    var selectedCountryData = countries.find(function(country) {
        return country.alpha2Code == selectedCountryCode;
    });
    var pounds = getExchangeRate(selectedCountryData.currencies[0].code, "GBP");
    var dollar = getExchangeRate(selectedCountryData.currencies[0].code, "USD");;
    var euro = getExchangeRate(selectedCountryData.currencies[0].code, "EUR");
    $('#countryName').html(selectedCountryData.name);
    $('#flag').attr('src', selectedCountryData.flag);
    $('#continent').html(selectedCountryData.region);
    $('#capital').html(selectedCountryData.capital);
    $('#weatherCity').html(selectedCountryData.capital);
    $('#language').html(selectedCountryData.languages.map(language => language.name).join(', '));
    $('#population').html(selectedCountryData.population);
    $('#timezone').html(selectedCountryData.timezones.join(', '));
    $('#currencyName').html(selectedCountryData.currencies[0].name);
    $('#currencyCode').html(selectedCountryData.currencies[0].code);
    $('#currencySymbol').html(selectedCountryData.currencies[0].symbol);
    $('#exchangeRate-gbp').html(pounds + ' ' + selectedCountryData.currencies[0].code + ' = 1 GBP');
    $('#exchangeRate-usd').html(dollar + ' ' + selectedCountryData.currencies[0].code + ' = 1 USD');
    $('#exchangeRate-eur').html(euro + ' ' + selectedCountryData.currencies[0].code + ' = 1 EUR');
    getEmergencyNumbers(selectedCountryData.alpha2Code);
    getPublicHolidays(selectedCountryData.alpha2Code);
    covid19(selectedCountryData.alpha2Code);
    $('#map').css('display', 'block');
    $('#infoModal')[0].scrollTop = 0;
    $('#link').html('<a href="https://en.wikipedia.org/wiki/' + selectedCountryData.name + '" target="_blank"> <i class="linkIcon fa fa-external-link-alt"></i>https://en.wikipedia.org/wiki/' + selectedCountryData.name + '</a>');
    getWikiParagraph(selectedCountryData.name);
    if (isMapShown == false) {
        initializeMap();
    }

    drawBorderingCountries(selectedCountryData.borders);

    if (isNavShown == false) {
        setTimeout(showModal, 1000);
    } else {
        showModal();
    }

    hideMainPage();
    showCountry(selectedCountryData);

    fetch('engine.php?question=weather&city=' + selectedCountryData.capital)
        .then(response => response.json())
        .then(data => {
            var iconcode = data.weather[0].icon;
            nextDaysForecast(data.coord.lat, data.coord.lon);
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            $('#weatherImage').attr('src', iconurl);
            var description = data.weather[0].description;
            $('#weatherDescription').html(description);
            var temperature = data.main.temp.toFixed(0);
            $('#temperature').html(temperature + ' °C');
        });
}

function drawBorderingCountries(countryCodes) {

    var container = $('#bordering-countries span');
    container.html('');
    for (let countryCode of countryCodes) {
        var countryData = countries.find(function(country) {
            return country.alpha3Code == countryCode;
        });
        container.append("<p onclick='loadCountry(`" + countryData.alpha2Code + "`)'><img src='" + countryData.flag + "'> " + countryData.name + "</p>")
    }

    if (countryCodes.length == 0) {
        container.html('<div class="text-center mb-3">No bordering countries!</div>');
    }
}

function showCountry(selectedCountryData) {

    if (window.matchMedia("(orientation:portrait) and (max-width: 850px)").matches) {
        var adjustedLatlng = [selectedCountryData.latlng[0] - 5, selectedCountryData.latlng[1]];
        var zoomLevel = 5;
    } else if (window.matchMedia("(orientation:landscape) and (max-width: 850px)").matches) {
        var adjustedLatlng = [selectedCountryData.latlng[0], selectedCountryData.latlng[1] + 7];
        var zoomLevel = 5;
    } else {
        var adjustedLatlng = [selectedCountryData.latlng[0], selectedCountryData.latlng[1] - 5.5];
        var zoomLevel = 6.5;
    }

    mymap.flyTo(adjustedLatlng, zoomLevel);
}

function nextDaysForecast(lat, lon) {
    fetch('engine.php?question=weather_next_days&lat=' + lat + '&lon=' + lon)
        .then(response => response.json())
        .then(data => {
            $('.weatherCard:not(#todayWeatherCard)').remove();
            for (var i = 1; i < 7; i++) {
                addWeatherCard(data.daily[i]);
            }
        });
}

function getWikiParagraph(countryName) {
     fetch('engine.php?question=wiki&countryName=' + countryName)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for(number in data.query.pages) {
               $('#wikiPara p').html(data.query.pages[number].extract);
               break;
            }
        });
}

function getPublicHolidays(code) {
   fetch('engine.php?question=holidays&code=' + code)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if ("title" in data) {
                $("#holidaysSection").hide();
            } else {
                $("#holidaysSection").show();
                $("#holidaysSection .dateWrapper").html("");
                for (var holiday of data) {
                  $("#holidaysSection .holidayDateWrapper").append("<p>" + holiday.date + ": <span>" + holiday.name + "</span></p>");
                }
            }
        }); 
}

function getEmergencyNumbers(code) {
   fetch('engine.php?question=emergency-numbers&code=' + code)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if(data.data.ambulance.all[0] == '' && data.data.fire.all[0] == '' && data.data.police.all[0] == ''){
                $('#emergencySection').hide();
            }else{
                $('#emergencySection').show();
            }

            if(data.data.ambulance.all[0] != ""){
                $('#ambulanceWrapper').show();
                $('#ambulance').html(data.data.ambulance.all[0]);    
            }else{
                $('#ambulanceWrapper').hide();
            }
            if(data.data.fire.all[0] != ""){
                $('#fireWrapper').show();
                $('#fire').html(data.data.fire.all[0]);
            }else{
                $('#fireWrapper').hide();
            }

            if(data.data.police.all[0] != ""){
                $('#policeWrapper').show();
                $('#police').html(data.data.police.all[0]);           
            }else{
                $('#policeWrapper').hide();
            }

        }); 
}


function covid19(code) {
    var date = new Date().toISOString().split('T')[0];
    fetch('engine.php?question=covid-19&code=' + code)
        .then(response => response.json())
        .then(data => {
            $('#confirmed').html(new Intl.NumberFormat().format(data[0].confirmed));
            $('#recovered').html(new Intl.NumberFormat().format(data[0].recovered));
            $('#deaths').html(new Intl.NumberFormat().format(data[0].deaths));
        });
}

function addWeatherCard(data) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wed', 'Thursday', 'Friday', 'Saturday'];
    var dayOfTheWeek = new Date(data.dt * 1000).getDay();
    dayOfTheWeek = days[dayOfTheWeek];
    var iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var card = `
  <div class="weatherCard">
    <div id="weatherDay">` + dayOfTheWeek + `</div>
    <div>
      <img id="weatherImage" src="` + iconurl + `">
      <span id="temperature">` + data.temp.day.toFixed(0) + ` °C</span>
    </div>
    <p id="weatherDescription"> ` + data.weather[0].description + `</p>
  </div>`;
    $('#weatherSection .weather-grid-container').append(card);
}

function showModal() {
    $('#infoModal').removeClass("prefetch");
    $('#infoModal').show();
    $('#infoModal').addClass('flip-in-hor-bottom');
    setTimeout(function() {
        $('#infoModal').removeClass('flip-in-hor-bottom');
    }, 450);
    $('#infoModal').removeClass('flip-out-hor-top');
}

function hideMainPage() {
    $('#darkMap').addClass('topNav');
    isNavShown = true;
}

function getExchangeRate(base, target) {
    var usdValue = parseFloat(exchange.rates[base]);
    return (usdValue / parseFloat(exchange.rates[target])).toFixed(2);
}


function initializeMap() {
    mymap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVzdHluYTE5OTQiLCJhIjoiY2tpMzY5dm1zMWtvYTJzb2FxbWt0ZTdwZCJ9.jGWdelY_X2BFrlxKp2UeMQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoianVzdHluYTE5OTQiLCJhIjoiY2tpMzY5dm1zMWtvYTJzb2FxbWt0ZTdwZCJ9.jGWdelY_X2BFrlxKp2UeMQ'
    }).addTo(mymap);
    isMapShown = true;
}

function closeModal() {
    $('#infoModal').addClass('flip-out-hor-top');
    $('#infoModal').removeClass('flip-in-hor-bottom');
}

var mymap;

$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position);
    });
    fetch('engine.php?question=countries')
        .then(response => response.json())
        .then(data => {
            countries = data;
        });

    fetch('engine.php?question=exchange')
        .then(response => response.json())
        .then(data => {
            exchange = data;
        });

    fetch('countryBorders.geo.json')
        .then(response => response.json())
        .then(data => {
            var countryList = data.features;
            console.log(data);
            function compare(a, b) {
                if (a.properties.name < b.properties.name) {
                    return -1;
                }
                if (a.properties.name > b.properties.name) {
                    return 1;
                }
                return 0;
            }

            countryList = countryList.sort(compare);
            for (var i = 0; i < countryList.length; i++) {
                if (countryList[i].properties.name != 'Antarctica') {
                    $('#countrySelect').append('<option value="' + countryList[i].properties.iso_a2 + '">' + countryList[i].properties.name + '</option>');
                }
            }
        });
});