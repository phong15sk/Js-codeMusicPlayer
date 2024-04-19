const pathUrl = "http://localhost:3000/song"

const nodeNameSong = document.querySelector('.name-song-playing')
const nodeImgSong = document.querySelector('.img-song img')
const nodelistSong = document.querySelector('.list-song')
const nodeToolPlay = document.querySelector('.tool .play')
const nodeToolPause = document.querySelector('.tool .pause')
const audioElement = document.querySelector("audio")
const playerProgress = document.querySelector(".player-progress")
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
    playerProgress.onclick = (e) => {
        let percent = parseFloat(e.offsetX / playerProgress.offsetWidth)
        progressUpdateByClick(percent)
        console.log(percent)
    }
}

function activePlay() {
    nodeToolPlay.classList.remove('active')
    nodeToolPause.classList.add('active')
    nodeToolPlay.setAttribute('isPlay', true)
    nodeImgSong.classList.add('active')
    audioElement.play()
}

function activePause() {
    nodeToolPause.classList.remove('active')
    nodeToolPlay.classList.add('active')
    nodeToolPlay.setAttribute('isPlay', false)
    nodeImgSong.classList.remove('active')
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
            playNextSongItem()
        }
    }
}

function progressUpdateByClick(percent){
   audioElement.currentTime  = (percent * audioElement.duration)
   console.log(audioElement.currentTime)
}

function playSongItem(urlAudio, indexSong) {
    audioElement.setAttribute('src', urlAudio)
    currentSongIndex = indexSong
    currentSong = {...lstSong[indexSong]}
    activePlay()
    showNameAndImgSong()
    nodeImgSong.classList.add('active')
}

function playNextSongItem()
{
    ++currentSongIndex
    resetIndexSong()
    currentSong = lstSong[currentSongIndex]
    if (currentSong != undefined)
    {
        audioElement.setAttribute('src', currentSong.url_audio)
        activePlay()
        showNameAndImgSong()
        nodeImgSong.classList.add('active')
    }
}

function playBackSongItem() {
    --currentSongIndex
    resetIndexSong()
    currentSong = lstSong[currentSongIndex]
    if (currentSong != undefined) {
        audioElement.setAttribute('src', currentSong.url_audio)
        activePlay()
        showNameAndImgSong()
        nodeImgSong.classList.add('active')
    }
}

function resetIndexSong()
{
    if (currentSongIndex >= lstSong.length || currentSongIndex < 0)
    {
        currentSongIndex = 0
    }   
}

function showNameAndImgSong() 
{
    nodeNameSong.innerHTML = currentSong.name
    nodeImgSong.setAttribute('src', currentSong.url_img)
}

function initSong() {
    currentSong = {...lstSong[currentSongIndex]}
    audioElement.setAttribute('src', currentSong.url_audio)
    showNameAndImgSong()
}

function render(listSong) {
    lstSong = [...listSong]
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
    initSong()
}

GetListSong(render)
AddEvent()