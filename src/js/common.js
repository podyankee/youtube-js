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
  console.log(media)

  media.forEach(function (e) {
    e.style.cursor = 'pointer'
    e.addEventListener('click', showFullInfo)
  })
}

function showFullInfo () {
  console.log(this)
}
