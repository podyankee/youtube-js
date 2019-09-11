const searchForm = document.querySelector('#search-form')
const movie = document.querySelector('#movies')
const urlPoster = 'https://image.tmdb.org/t/p/w500'

function apiSearch (e) {
  e.preventDefault()
  const searchText = document.querySelector('.form-control').value
  if (searchText.trim().length === 0) {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>'
    return
  }
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=1352084e037071184a371f99fee87cd8&language=ru&query=' + searchText
  movie.innerHTML = '<div class="spinner"></div>'

  fetch(server)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value)
      }

      return value.json()
    })
    .then((output) => {
      let inner = ''
      if (output.results.length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-warning">По вашему запросу ничего не найдено</h2>'
        return
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title
        const poster = item.poster_path ? urlPoster + item.poster_path : './assets/img/noposter.jpg'
        let dataInfo = ''
        if (item.media_type !== 'person') {
          dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`
        }
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
        <img src="${poster}" class="img_poster" alt = "${nameItem}" ${dataInfo}>
        <h5>${nameItem}</h5>
        </div>
        `
      })
      movie.innerHTML = inner
      addEventMedia()
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что-то пошло не так !'
      console.error('error: ' + reason.status)
    })
}

searchForm.addEventListener('submit', apiSearch)

function addEventMedia () {
  const media = movie.querySelectorAll('img[data-id]')

  media.forEach(function (e) {
    e.style.cursor = 'pointer'
    e.addEventListener('click', showFullInfo)
  })
}

function showFullInfo () {
  let url = ''
  if (this.dataset.type === 'movie') {
    url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=1352084e037071184a371f99fee87cd8&language=ru'
  } else if (this.dataset.type === 'tv') {
    url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=1352084e037071184a371f99fee87cd8&language=ru'
  } else {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка, повторите позже!</h2>'
  }
  fetch(url)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value)
      }

      return value.json()
    })
    .then((output) => {
      console.log(output)
      movie.innerHTML = `
      <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
      <div class="col-4">
        <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">
        ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="blank_">Официальная страница</a></p>` : ''}
        ${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="blank_">Страница на IMDB.com</a></p>` : ''}
      </div>
      <div class="col-8">
        <p> Рейтинг: ${output.vote_average}</p>
        <p> Статус: ${output.status}</p>
        <p> Премьера: ${output.first_air_date || output.release_date}</p>
        ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезонов  ${output.last_episode_to_air.episode_number} серий вышло </p>` : ''}
				<p> Описание: ${output.overview}</p>
				<br>
				<div class="youtube"></div>
      </div>
			`
			getVideo(this.dataset.type, this.dataset.id)
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что-то пошло не так !'
      console.error('error: ' + reason.status)
    })
}

document.addEventListener('DOMContentLoaded', function () {
  fetch('https://api.themoviedb.org/3/trending/all/week?api_key=1352084e037071184a371f99fee87cd8&language=ru')
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value)
      }

      return value.json()
    })
    .then((output) => {
      let inner = '<h2 class="col-12 text-center text-info">Популярные за неделю!</h2>'
      if (output.results.length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-warning">По вашему запросу ничего не найдено</h2>'
        return
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title
        let mediaType = item.title ? 'movie' : 'tv'
        const poster = item.poster_path ? urlPoster + item.poster_path : './assets/img/noposter.jpg'
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
        <img src="${poster}" class="img_poster" alt = "${nameItem}" ${dataInfo}>
        <h5>${nameItem}</h5>
        </div>
        `
      })
      movie.innerHTML = inner
      addEventMedia()
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что-то пошло не так !'
      console.error('error: ' + reason.status)
    })
})

function getVideo (type, id) {
	let youtube = movie.querySelector('.youtube')
	fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=1352084e037071184a371f99fee87cd8&language=ru`)
		.then((value) => {
			if (value.status !== 200) {
				return Promise.reject(value)
			}
			return value.json()
		})
		.then((output) => {
			let videoFrame = '<h5 class="text-info">Трейлеры</h5>'
			if (output.results.length === 0) {
				videoFrame = '<p>К сожалению видео отсутствует</p>'
			}
			output.results.forEach((item) => {
				videoFrame += '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+ item.key +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
			})
			youtube.innerHTML = videoFrame
		})
		.catch((reason) => {
			youtube.innerHTML = 'Видео отсутсвует!'
			console.error(reason || reason.status);

		})
}