const searchForm = document.querySelector('#search-form')
const movie = document.querySelector('#movies')
const urlPoster = 'https://image.tmdb.org/t/p/w500'

function apiSearch (e) {
  e.preventDefault()
  const searchText = document.querySelector('.form-control').value
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=1352084e037071184a371f99fee87cd8&language=ru&query=' + searchText
  movie.innerHTML = 'Загрузка'

  fetch(server)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value)
      }

      return value.json()
    })
    .then((output) => {
      let inner = ''
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title
        inner += `
        <div class="col-12 col-md-4 col-xl-3 item">
        <img src="${urlPoster + item.poster_path}" alt = "${nameItem}">
        <h5>${nameItem}</h5>
        </div>
        `
      })
      movie.innerHTML = inner
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что-то пошло не так !'
      console.error('error: ' + reason.status)
    })
}

searchForm.addEventListener('submit', apiSearch)
