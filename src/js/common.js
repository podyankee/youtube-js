const searchForm = document.querySelector('#search-form')
const movie = document.querySelector('#movies')

function apiSearch (e) {
  e.preventDefault()
  const searchText = document.querySelector('.form-control').value
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=1352084e037071184a371f99fee87cd8&language=ru&query=' + searchText
  requestApi(server)
}

searchForm.addEventListener('submit', apiSearch)

function requestApi (url) {
  const request = new XMLHttpRequest()
  request.open('GET', url)
  request.send()

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return

    if (request.status !== 200) {
      console.log('error' + request.status)
      return
    }

    const output = JSON.parse(request.responseText)

    let inner = ''

    output.results.forEach(function (item) {
      let nameItem = item.name || item.title
      console.log(nameItem)
      inner += '<div class="col-3">' + nameItem + '</div>'
    })

    movie.innerHTML = inner
  })
}
