

$("#search").on("click", function (event) {

    event.preventDefault();

    var searchTerm = $("#searchTerm").val();
    var country = $("#searchTerm").val();
    newsSearch(country);

    var country = $("#searchTerm").val();
    newsSearch(country);




    var querryUrl = "https://restcountries.eu/rest/v2/name/" + searchTerm;

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

        var lat=response[0].latlng[0];
        var lng=response[0].latlng[1];
        initMap(lat,lng);

        var lat=response[0].latlng[0];
        var lng=response[0].latlng[1];
        initMap(lat,lng);

    })

});

function renderCountryData(response){
    $("#countryName").text(response[0].name);
    $("#flag").attr("src", response[0].flag);
    $("#region").text("Region : " + response[0].region);
    $("#capital").text("Capital : " + response[0].capital);
    $("#languages").text("Language : " + response[0].languages[0].name);
    $("#population").text("Population : " + response[0].population);
    $("#currencies").text("Currency : " + response[0].currencies[0].name);
}

function renderWeatherData(reponse){
    $("#temp").text((response.main.temp).toFixed(0) + "°F");
    $("#city").text(response.name + ", ");
    $(".imgP").html(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
    $(".description").text(response.weather[0].main);
    var timeUTC = new Date(response.dt * 1000);
    $(".currentDate").text(timeUTC.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
}

function renderImages(resp){
    $("#Images").text("Images");
    $("#results").empty();
    resp.results.forEach(photo => {

        var result = `<img src=${photo.urls.thumb}>`;
        $("#results").append(result);
    });
}


function renderCovidData(res){
    $("#covidH1").text("Covid 19");
    $(".active_cases").text("Active Cases : " + res.data.summary.active_cases);
    $(".critical").text("Critical : " + res.data.summary.critical);
    $(".death_ratio").text("Death Ratio : " + res.data.summary.death_ratio);
    $(".deaths").text("Deaths : " + res.data.summary.deaths);
    $(".recovered").text("Recovered : " + res.data.summary.recovered);
    $(".recovery_ratio").text("Recovery Ratio : " + res.data.summary.recovery_ratio);
    $(".tested").text("Tested : " + res.data.summary.tested);
    $(".total_cases").text("Total Cases : " + res.data.summary.total_cases);

    if ((parseInt(res.data.summary.active_cases)) > 10000) {
        $("#covidHeader").removeClass("greenHead");
        $("#covidHeader").addClass("redHead");
    }
    else {
        $("#covidHeader").removeClass("redHead");
        $("#covidHeader").addClass("greenHead");
    }
}

function showResults(results) {
    var html = "";
    var entries = results.items;
    console.log(entries);
    $.each(entries, function (index, value) {
        var title = value.snippet.title;
        var thumbnail = value.snippet.thumbnails.default.url;
        html += '<p class="videoP">' + title + '</p>';
        html += "<a target = '_blank' href = https://www.youtube.com/watch?v=" + value.id.videoId + ' ><img  class="videosImg" src =' + value.snippet.thumbnails.default.url + '></a>';
    });
    $("#videos").text("Videos");
    $('.search-results').html(html);
    console.log(results);
}

function getRequest(searchTerm) {
    var url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
        part: 'snippet',
        key: 'AIzaSyC4vv5RSV6CNNL0Scjw2pRTfoiO-1_dEYE',
        q: searchTerm
    };

    $.getJSON(url, params, showResults);
}
// function validateSearch(input){
//     if(!input){
//         console.log("success");
//     }
// }
function initMap(latOne,LngOne) {
    // The location of Uluru
    var uluru = {lat: latOne, lng: LngOne};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
  
    }

    function newsSearch(country) {
        var api = "https://newsapi.org/v2/everything?q=";
        var apiKey = "&apiKey=6b93eb01addf4c00bcd7f3c423d89e80";
        var queryURL = api + country + apiKey;

        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var card = $("<div>");
            card.addClass("card-body");

            for (i = 0; i < 10; i++) {
                console.log('test')
                var NYTarticles = response.articles[i];
                console.log(NYTarticles)



                var title = $("<h1>");
                var url = $("<div>");
                var img = $("<img class='size'>");
                img.addClass("size");


                title.append(NYTarticles.title);
                img.attr("src", NYTarticles.urlToImage);
                url.append("<a href=>" + NYTarticles.url);

                card.append(title);
                card.append(img);
                card.append(url);

                $("#articles").append(card);

            }
        });
        
    };
    

// var queeryUrl="https://www.travel-advisory.info/api?countrycode=AD"

// $.ajax({

//     url: queeryUrl,
//     method:"GET"
// }).then(function(response){

// console.log(response);
// console.log(response.data.AD.advisory.score);
// console.log(response.data.AD.advisory.message);

// });
