const searchForm = document.querySelector('#search-form')
const movie = document.querySelector('#movies')

function apiSearch (e) {
  e.preventDefault()
  const searchText = document.querySelector('.form-control').value
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=1352084e037071184a371f99fee87cd8&language=ru&query=' + searchText
  movie.innerHTML = 'Загрузка'
  requestApi(server)
    .then((result) => {
      const output = JSON.parse(result)
      let inner = ''

      output.results.forEach(function (item) {
        let nameItem = item.name || item.title
        console.log(nameItem)
        inner += '<div class="col-3">' + nameItem + '</div>'
      })

      movie.innerHTML = inner
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что-то пошло не так !'
      console.log('error' + reason.status)
    })
}

searchForm.addEventListener('submit', apiSearch)

function requestApi (url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.addEventListener('load', () => {
      if (request.status !== 200) {
        reject({
          status: request.status
        })
        return
      }
      resolve(request.response)
    })
    request.addEventListener('error', () => {
      reject({
        status: request.status
      })
    })
    request.send()
  })
}

//   request.addEventListener('readystatechange', () => {
//     if (request.readyState !== 4) {
//       movie.innerHTML = 'Загрузка'
//       return
//     }

//     if (request.status !== 200) {
//       movie.innerHTML = 'Упс, что-то пошло не так !'
//       console.log('error' + request.status)
//       return
//     }

//     let inner = ''

//     output.results.forEach(function (item) {
//       let nameItem = item.name || item.title
//       console.log(nameItem)
//       inner += '<div class="col-3">' + nameItem + '</div>'
//     })

//     movie.innerHTML = inner
//   })
