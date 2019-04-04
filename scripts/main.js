$(document).ready(function(){
  $.ajax({
    // url: "http://localhost:3000/weather",
    url: "https://api.openweathermap.org/data/2.5/weather?id=1642907&appid=b83ae849dd58366eae054c11dc368753&units=metric",
    method: "GET"
  })
  .done(weatherInfo => {
    $("#city-name").prepend(`
    ${weatherInfo.name}
    `)
    $("#weather-info").prepend(`
    <li><img src="http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png">${weatherInfo.weather[0].main}</li>
    <li>Temperature: ${weatherInfo.main.temp} °C</li>
    <li>Pressure: ${weatherInfo.main.pressure} atm</li>
    <li>Humidity: ${weatherInfo.main.humidity} %</li>
    <li>Min. temp: ${weatherInfo.main.temp_min} °C</li>
    <li>Min. temp: ${weatherInfo.main.temp_max} °C</li>
    <li>Cloudiness: ${weatherInfo.clouds.all} %</li>
    `)
  })
  .fail(function(jqXHR, textStatus) {
    console.log("request failed", textStatus);
  })

  $.ajax({
    // url: "http://localhost:3000/news",
    url: "https://api.nytimes.com/svc/topstories/v2/science.json?api-key=L0wjor2umeVSgIiz3KiLreFcaH9MGLGT",
    method: "GET"
  })
  .done(topStories => {
    topStories.results.forEach(topStory => {
      $("#fetched-news").prepend(`
      <tr>
        <td >
          <a href="#" onclick="fetchNewsContent("${topStory.url}")">
            ${topStory.title} <br>
            <small>${topStory.byline}</small>
          </a>
        </td>
      </tr>
      `)
    })
  })
  .fail(function(jqXHR, textStatus) {
    console.log("request failed", textStatus);
  })

  function fetchNewsContent(url) {
    console.log(url);
    $("#news-content").append(`
    <iframe src=${url} height="600" width="500"></iframe>
    `)
  }

});

// <iframe id="news-content" height="600" width="500"></iframe>