const baseUrl = 'http://localhost:3000'

$(document).ready(function(){
  $("#content").hide()
});

function getWeather() {
  $.ajax({
      url: `${baseUrl}/weather`,
      method: "GET",
      headers: { token: localStorage.getItem('token') }
    })
    .done(weatherInfo => {
      $('#city-name').empty()
      $("#city-name").prepend(`
      ${weatherInfo.name}
      `)
      $('#weather-info').empty()
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
}

function getNews() {
  $.ajax({
      url: `${baseUrl}/news`,
      method: "GET",
      headers: { token: localStorage.getItem('token') }
    })
    .done(topStories => {
      $('#fetched-news').empty()
      topStories.results.forEach(topStory => {
        $("#fetched-news").prepend(`
        <tr>
          <td>
            <a href="#" onclick="fetchNewsContent('${topStory.url}')">
              ${topStory.title} <br>
              <small>${topStory.byline}</small>
            </a>
          </td>
        </tr>
        `)
      })
    })
    .fail(err => {
      console.log("request failed", err);
    })
}

function fetchNewsContent(url) {
  let html = `<iframe src=${url} height="600" width="500"></iframe>`
  $('#news-content').empty()
  $('#news-content').append(html)
}

function onSignIn(googleUser) {
  if (!localStorage.getItem('token')) {
      const id_token = googleUser.getAuthResponse().id_token
      $.post(`${baseUrl}/google-login`, {
          token: id_token
      })
          .done(response => {
              localStorage.setItem('token', response.token)
              localStorage.setItem('name', response.name)
              localStorage.setItem('email', response.email)
              localStorage.setItem('picture', response.picture)
              
              getWeather()
              getNews()
          })
          .fail(err => {
              console.log(err)
          })
  }
  const profile = googleUser.getBasicProfile();

  $('.g-signin2').hide()
  $("#user").show()
  $("#content").show()

  let html = `<div class="navbar-brand">${profile.getName()}</div>
              <img src="${profile.getImageUrl()}" alt="userImage" style="border-radius: 8px; width: 50px;">
              <a href="#" onclick="signOut();" class="m-2 text-danger"><i class="fas fa-power-off" style="color: white;"></i></a>`

  $('#user').empty()
  $('#user').append(html)

  if (localStorage.getItem('token')) {
      getWeather()
      getNews()
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      console.log('User signed out.');
      localStorage.clear()
  });

  $("#user").hide()
  $("#content").hide()
  $('.g-signin2').show()
}