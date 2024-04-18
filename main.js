const pathUrl = "http://localhost:3000/song"

const nodeNameSong = document.querySelector('.name-song-playing')
const nodeImgSong = document.querySelector('.img-song img')
const nodelistSong = document.querySelector('.list-song')
const nodeToolPlay = document.querySelector('.tool .play')
const nodeToolPause = document.querySelector('.tool .pause')
const audioElement = document.querySelector("audio")
const progressFilled = document.querySelector(".player-progress-filled")
const playerVolume = document.querySelector(".input-range")
const time = document.querySelector(".time")
const itemSong = document.querySelector(".img-song-item")
const nextTool = document.querySelector(".tool .next")
const backTool = document.querySelector(".tool .back")
const reLoadTool = document.querySelector(".tool .reset") 

let lstSong = []
let currentSong = {}
let currentSongIndex = 0 

console.log([audioElement])

function AddEvent() {

    nodeToolPlay.onclick = activePlay
    nodeToolPause.onclick = activePause
    audioElement.ontimeupdate = () => {
        progressUpdate()
        setTime()
    }
    playerVolume.onchange = () => {
        console.log([playerVolume.value])
        audioElement.volume = playerVolume.value
    }

    nextTool.onclick = playNextSongItem
    backTool.onclick = playBackSongItem
    reLoadTool.onclick = () => { 
        audioElement.load()
        audioElement.play()
    }
}

function activePlay() {
    nodeToolPlay.classList.remove('active')
    nodeToolPause.classList.add('active')
    nodeToolPlay.setAttribute('isPlay', true)
    audioElement.play()
}

function activePause() {
    nodeToolPause.classList.remove('active')
    nodeToolPlay.classList.add('active')
    nodeToolPlay.setAttribute('isPlay', false)
    audioElement.pause()
}

function setTime() {
    let covertTimeToDdate = new Date(audioElement.currentTime * 1000)
    time.innerHTML = covertTimeToDdate.toISOString().substring(14, 19)
}


function GetListSong (callBack) {
    fetch(pathUrl)
        .then((result) => result.json())
        .then(callBack)
        .catch((error) => console.log(error))
}

function progressUpdate(){
    const percent = (audioElement.currentTime / audioElement.duration) * 100
    progressFilled.style.width = `${percent}%`
    if (percent == 100){
        console.log(nodeToolPlay.getAttribute('isPlay'))
        if(Boolean(nodeToolPlay.getAttribute('isPlay')))
        {
            console.log(nodeToolPlay.getAttribute('isPlay'), Boolean(nodeToolPlay.getAttribute('isPlay')))
            showNameAndImgSong()
        }
    }
}

function playSongItem(urlAudio, indexSong) {
    audioElement.setAttribute('src', urlAudio)
    currentSongIndex = indexSong
    currentSong = {...lstSong[indexSong]}
    activePlay()
    showNameAndImgSong()
}

function playNextSongItem()
{
    currentSong = lstSong[++currentSongIndex]
    if (currentSong != undefined)
    {
        audioElement.setAttribute('src', currentSong.url_audio)
        activePlay()
        showNameAndImgSong()
    }   
}

function playBackSongItem()
{
    currentSong = lstSong[++currentSongIndex]
    if (currentSong != undefined)
    {
        audioElement.setAttribute('src', currentSong.url_audio)
        activePlay()
        showNameAndImgSong()
    }
}

function showNameAndImgSong() 
{
    nodeNameSong.innerHTML = currentSong.name
    nodeImgSong.setAttribute('src', currentSong.url_img)
}

function render(listSong) {
    lstSong = {...listSong}
    let html = listSong.map((item, index) => {
        return `<div class="song-item flex" onclick=playSongItem('${item.url_audio}',${index}) index-song=${index}>  
                    <div class="img-song-item" }>
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
AddEvent()