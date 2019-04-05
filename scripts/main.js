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
      <li class="PT-Serif-font"><img src="http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png">${weatherInfo.weather[0].main}</li>
      <li class="PT-Serif-font">Temperature: ${weatherInfo.main.temp} °C</li>
      <li class="PT-Serif-font">Pressure: ${weatherInfo.main.pressure} atm</li>
      <li class="PT-Serif-font">Humidity: ${weatherInfo.main.humidity} %</li>
      <li class="PT-Serif-font">Min. temp: ${weatherInfo.main.temp_min} °C</li>
      <li class="PT-Serif-font">Max. temp: ${weatherInfo.main.temp_max} °C</li>
      <li class="PT-Serif-font">Cloudiness: ${weatherInfo.clouds.all} %</li>
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
      let news = ''
      topStories.results.forEach(topStory => {
        news += 
        `
        <tr data-aos="fade-up">
        <td>
        <a href="#" onclick="fetch(['${topStory.url}', '${topStory.title}'])" style="font-family: 'Lora', serif; text-decoration: none !important; color: black">
        ${topStory.title} <br>
        <small>${topStory.byline}</small>
        </a>
        </td>
        </tr>
        `
      })
      $('#fetched-news').empty()
      $("#fetched-news").prepend(news)
    })
    .fail(err => {
      console.log("request failed", err);
    })
}

function fetch(info) {
  let url = info[0]
  let title = info[1]

  let buttonYoutube = `<a data-aos="fade-up" href="#fetched-video"><i class="fab fa-youtube fa-3x" style="color: red;"></i></a>`
  $('#show-youtube-button').empty()
  $('#show-youtube-button').append(buttonYoutube)

  fetchNewsContent(url)
  fetchYoutubeVideo(title)
}

function fetchNewsContent(url) {
  let html = `<iframe src=${url} height="600" width="100%" data-aos="zoom-in"></iframe>`
  $('#news-content').empty()
  $('#news-content').append(html)
}

function fetchYoutubeVideo(rawTitle) {
  let title = rawTitle.replace("’", "%27")
  $.ajax({
      url: `${baseUrl}/youtube/${title}`,
      method: "GET",
      headers: { token: localStorage.getItem('token') }
    })
    .done(data => {
      let videos = `<h3>Related Videos</h3>`
      if(data) {
        data.forEach(e => {
          videos += `<p data-aos="fade-left"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${e.id.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>`
        })
      }
      $('#fetched-video').empty()
      $('#fetched-video').append(videos)
  })
  .fail(err => {
    console.log("request failed", err);
  })
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
  $('body').removeClass('bg-landing')
  $('.parent-table').hide()
  $("#user").show()
  $("#content").fadeIn(500)

  let html = `<input class="mr-4" type="text" placeholder="Search news" style="border-radius: 5px; padding-left: 10px; padding-right: 10px;" onchange="search(this.value)">
              <div class="navbar-brand">${profile.getName()}</div>
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
      $('#news-content').empty()
      $('#show-youtube-button').empty()
      $('#fetched-video').empty()
  });

  $("#content").fadeOut(500)
  $("#user").hide()
  // $("#content").hide()
  $('.g-signin2').show()
  $('body').addClass('bg-landing')
  $('.parent-table').show()
}
