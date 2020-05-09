var countries = [
    "United States of America",
    "France",
    "Greece",
    "Turkey",
    "Portugal",
    "Canada",
    "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas (the)", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory (the)", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands (the)", "Central African Republic (the)", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands (the)", "Colombia", "Comoros (the)", "Congo (the Democratic Republic of the)", "Congo (the)", "Cook Islands (the)", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Côte d'Ivoire", "Denmark", "Djibouti", "Dominica",
];

$("#ramdom").on("click", function (event) {
    event.preventDefault();
    for (i = 0; i < countries.length; i++) {
        var randomCountry = countries[Math.floor(Math.random() * countries.length)];
    };
    console.log(randomCountry);
    ajaxCalls(randomCountry);
});

var country = 'Turkey';
ajaxCalls(country);

$("#search").on("click", function (event) {
    event.preventDefault();

    country = $("#searchTerm").val();
    ajaxCalls(country);

});

function ajaxCalls(country) {

    newsSearch(country);

    var querryUrl = "https://restcountries.eu/rest/v2/name/" + country;

    $.ajax({

        url: querryUrl,
        method: "GET"
    }).then(function (response) {

        renderCountryData(response);
        var city = response[0].capital;
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&Appid=184b8c8a24ffd9f8f74e90f1cbf68400&units=imperial";


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            renderWeatherData(response);
        });

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://coronavirus-map.p.rapidapi.com/v1/summary/region?region=" + response[0].name,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "coronavirus-map.p.rapidapi.com",
                "x-rapidapi-key": "a0f80e577emsha4706c37533c66bp1a1d81jsn8773d277f381"
            }
        }

        $.ajax(settings).done(function (res) {
            renderCovidData(res)
        });

        var unsplashCountry = response[0].name;
        var unsplashURL = "https://api.unsplash.com/search/photos/?client_id=I8U6GFIB0XafF8mMxgMsXBxjSO8LW-kqAs5EJfiO6hc&query=" + unsplashCountry;

        $.ajax({
            url: unsplashURL,
            method: "GET"
        }).then(function (resp) {
            renderImages(resp);
        });

        var searchTerm = response[0].name + " travel";
        getRequest(searchTerm);

        showResults(results);

        var lat = response[0].latlng[0];
        var lng = response[0].latlng[1];
        initMap(lat, lng);

        var lat = response[0].latlng[0];
        var lng = response[0].latlng[1];
        initMap(lat, lng);

    })
}

function renderCountryData(response) {
    $("#countryName").text(response[0].name);
    $("#flag").attr("src", response[0].flag);
    $("#region").html("<strong>Region :</strong> " + response[0].region);
    $("#capital").html("<strong>Capital :</strong> " + response[0].capital);
    $("#languages").html("<strong>Language :</strong>  " + response[0].languages[0].name);
    $("#population").html("<strong>Population :</strong>  " + response[0].population);
    $("#currencies").html("<strong>Currency :</strong>  " + response[0].currencies[0].name);
}

function renderWeatherData(response) {
    $("#temp").text((response.main.temp).toFixed(0) + "°F");
    $("#city").text(response.name + ", ");
    $(".imgP").html(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
    $(".description").text(response.weather[0].main);
    var timeUTC = new Date(response.dt * 1000);
    $(".currentDate").text(timeUTC.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
}

function renderImages(resp) {
    $("#results").empty();
    resp.results.forEach(photo => {

        var result = `<img "class: imgP " src=${photo.urls.thumb}>`;
        $("#results").append(result);
    });
}


function renderCovidData(res) {

    $(".active_cases").html("<strong>Active Cases :</strong> " + res.data.summary.active_cases);
    $(".critical").html("<strong>Critical  :</strong>  " + res.data.summary.critical);
    $(".death_ratio").html("<strong>Death Ratio :</strong>" + res.data.summary.death_ratio);
    $(".deaths").html("<strong>Deaths:</strong> " + res.data.summary.deaths);
    $(".recovered").html("<strong>Recovered :</strong> " + res.data.summary.recovered);
    $(".recovery_ratio").html("<strong>Recovery Ratio :</strong>  " + res.data.summary.recovery_ratio);
    $(".tested").html("<strong>Tested :</strong>  " + res.data.summary.tested);
    $(".total_cases").html("<strong>Total Cases :</strong>  " + res.data.summary.total_cases);

    if (((parseInt(res.data.summary.total_cases)) > 20000)) {
        $(".covidCard").addClass("red");
        $(".covidCard").removeClass("yellow");
        $(".covidCard").removeClass("blue");
        $(".covidCard").removeClass("green");
        $("#covidH1").html("Do not travel");
    }
    if (((parseInt(res.data.summary.total_cases)) < 20000) & ((parseInt(res.data.summary.total_cases)) > 10000)) {
        $(".covidCard").addClass("yellow");
        $(".covidCard").removeClass("red");
        $(".covidCard").removeClass("blue");
        $(".covidCard").removeClass("green");
        $("#covidH1").html("Reconsider travelling");
    }
    if (((parseInt(res.data.summary.total_cases)) < 10000) & ((parseInt(res.data.summary.total_cases)) > 1000)) {
        $(".covidCard").addClass("blue");
        $(".covidCard").removeClass("red");
        $(".covidCard").removeClass("yellow");
        $(".covidCard").removeClass("green");
        $("#covidH1").html(" Travelling  is relatively safe");
    }
    if ((parseInt(res.data.summary.total_cases)) < 1000) {
        $(".covidCard").addClass("green");
        $(".covidCard").removeClass("red");
        $(".covidCard").removeClass("blue");
        $(".covidCard").removeClass("yellow");
        $("#covidH1").html("Travel is usually safe");
    }

}

function showResults(results) {
    var html = "";
    var entries = results.items;
    console.log(entries);
    $.each(entries, function (index, value) {
        var title = value.snippet.title;
        var thumbnail = value.snippet.thumbnails.default.url;
        html += '<p>' + '<span class="videoP">' + title + '</span>' + '</p>';
        html += "<a target = '_blank' href = https://www.youtube.com/watch?v=" + value.id.videoId + ' ><img  class="videosImg" src =' + value.snippet.thumbnails.default.url + '></a>';
    });
    $('.search-results').html(html);
    console.log(results);
}

function getRequest(searchTerm) {
    var url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
        part: 'snippet',
        key: 'AIzaSyARQCm-g4yyIRR3-kAZ7rSRcC4Tps7jDtQ',
        q: searchTerm
    };

    $.getJSON(url, params, showResults);
}


function initMap(latOne, LngOne) {
    // The location of Uluru
    var uluru = { lat: latOne, lng: LngOne };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: uluru });
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({ position: uluru, map: map });

}

function newsSearch(country) {
    var api = "https://newsapi.org/v2/everything?q=";
    var apiKey = "&apiKey=6b93eb01addf4c00bcd7f3c423d89e80";
    var queryURL = api + country + apiKey;


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        renderNews(response);
    });

};

function renderNews(response) {
    var card = $("<div>");
    card.addClass("card-body");

    $("#articles").empty();

    for (i = 0; i < 5; i++) {
        console.log('test')
        var NYTarticles = response.articles[i];
        console.log(NYTarticles)

        '<p>' + + '</p>';

        var title = $("<p>");

        var url = $("<div class='imgDiv'>");

        title.html('<span class="readP">' + NYTarticles.title + '</span>');

        url.html("<a target = '_blank' href=" + NYTarticles.url + '><img  class="size" src =' + NYTarticles.urlToImage + '></a>');

        card.append(title);
        card.append(url);

        $("#articles").append(card);
    }
}
