const pathUrl = "http://localhost:3000/song"

let nodelistSong = document.querySelector('.list-song')

function GetListSong (callBack) {
    fetch(pathUrl)
        .then((result) => result.json())
        .then(callBack)
        .catch((error) => console.log(error))
}

function render(listSong) {
    let html = listSong.map((item) => {
        return `<div class="song-item flex">    
                    <div class="img-song-item">
                        <img src="${item.url_img}" alt="">
                    </div>
                    <div class="song-desc">
                        <h2 class="name-song-item">${item.name}</h2>
                        <div class="singer-song">${item.singer}</div>
                    </div>
                    <div class="icon-detail">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>`
    }).join('')

    nodelistSong.innerHTML = html
}

GetListSong(render)