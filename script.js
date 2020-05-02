

$("#search").on("click", function(){

var searchTerm=$("#searchTerm").val();


var querryUrl= "https://restcountries.eu/rest/v2/name/" + searchTerm;

$.ajax({

    url:querryUrl,
    method:"GET"
}).then(function(response){

    console.log(response[0].alpha2Code);
    console.log(response[0].name);
    $("#countryName").text(response[0].name);
    console.log(response[0].flag);
    $("#flag").attr("src", response[0].flag);
    console.log(response[0].region);
    $("#region").text("Region : " + response[0].region);
    $("#capital").text("Capital : " + response[0].capital);
    $("#languages").text("Language : " + response[0].languages[0].name);
    $("#population").text("Population : " + response[0].population);
    $("#currencies").text("Currency : " + response[0].currencies[0].name);
    
 
    var city=response[0].capital;
     console.log(city);
     var queryURL="http://api.openweathermap.org/data/2.5/weather?q=" + city + "&Appid=184b8c8a24ffd9f8f74e90f1cbf68400&units=imperial";
 
     


     $.ajax({
        url: queryURL,
        method:"GET"
    }).then(function(response){
        console.log(response);
        $("#temp").text((response.main.temp).toFixed(0) + "°F");
        $("#city").text(response.name + ", ");
        $(".imgP").html(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
        $(".description").text(response.weather[0].main);
        var timeUTC = new Date(response.dt * 1000);
        $(".currentDate").text(timeUTC.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));
         
       
    });
    var countryCovid=response[0].name;

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-map.p.rapidapi.com/v1/summary/region?region=" + countryCovid,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-map.p.rapidapi.com",
            "x-rapidapi-key": "a0f80e577emsha4706c37533c66bp1a1d81jsn8773d277f381"
        }
    }
    
    $.ajax(settings).done(function (res) {
        console.log(res);
        console.log(res.data.summary);
        $("#covidH1").text("Covid 19");
        $(".active_cases").text("Active Cases : " + res.data.summary.active_cases);
        $(".critical").text("Critical : " + res.data.summary.critical);
        $(".death_ratio").text("Death Ratio : " + res.data.summary.death_ratio);
        $(".deaths").text("Deaths : " + res.data.summary.deaths);
        $(".recovered").text("Recovered : " + res.data.summary.recovered);
        $(".recovery_ratio").text("Recovery Ratio : " + res.data.summary.recovery_ratio);
        $(".tested").text("Tested : " + res.data.summary.tested);
        $(".total_cases").text("Total Cases : " + res.data.summary.total_cases);
        
         if((parseInt(res.data.summary.active_cases))>10000){
            
            $("#covidHeader").removeClass("greenHead");
            $("#covidHeader").addClass("redHead");
           

         }
         else{
            $("#covidHeader").removeClass("redHead");
            $("#covidHeader").addClass("greenHead");
         }
        
    });

    var unsplashCountry=response[0].name;
    var unsplashURL="https://api.unsplash.com/search/photos/?client_id=I8U6GFIB0XafF8mMxgMsXBxjSO8LW-kqAs5EJfiO6hc&query=" + unsplashCountry;

    console.log(unsplashURL);
    console.log(unsplashCountry);

    $.ajax({
        url: unsplashURL,
        method:"GET"
    }).then(function(resp){
        console.log(resp);
        $("#Images").text("Images");
        $("#results").empty();
        resp.results.forEach(photo => {
        
        var result=`<img src=${photo.urls.thumb}>`;
        $("#results").append(result);
           
           
       });

        
       
    });


})

  
});

















