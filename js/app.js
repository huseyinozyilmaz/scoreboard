
const context = new AudioContext()

const SOUND = {
  up: null,
  down: null,
  reset: null
}

const defaultAvatar = "/img/avatars/default.webp"
const avatars = [
  defaultAvatar,
  "/img/avatars/01.webp",
  "/img/avatars/02.webp",
  "/img/avatars/03.webp",
  "/img/avatars/04.webp",
  "/img/avatars/05.webp",
  "/img/avatars/06.webp",
  "/img/avatars/07.webp",
  "/img/avatars/08.webp",
  "/img/avatars/09.webp",
  "/img/avatars/10.webp",
  "/img/avatars/11.webp",
  "/img/avatars/12.webp"
]
const zeroPad = (num, places) => String(num).padStart(places, '0')

function scoreUp(player) {
  play(SOUND.up)
  const currentScore = getCurrentScoreByPlayer(player)
  const newScore = currentScore + 1
  if (newScore < 100) {
    setCurrentScoreByPlayer(player, newScore)
  }
}

function scoreDown(player) {
  play(SOUND.down)
  const currentScore = getCurrentScoreByPlayer(player)
  const newScore = currentScore - 1
  if (newScore >= 0) {
    setCurrentScoreByPlayer(player, newScore)
  }
}

function getCurrentScoreByPlayer(player) {
  const scoreBoard = document.getElementById(`score${player}`)
  return Number(scoreBoard.innerText)
}

function setCurrentScoreByPlayer(player, score) {
  const scoreBoard = document.getElementById(`score${player}`)
  scoreBoard.innerText = zeroPad(score, 2)
  saveScore(player, score)
}

function setPlayerName(player, name) {
  document.getElementById(`name${player}`).value = name
  savePlayerName(player, name)
}

function onResetBtnClick(btn) {
  play(SOUND.reset)
  resetScores()
  btn.classList.add('bounce')
  setTimeout(function() {
    btn.classList.remove('bounce')
  }, 100)
}

function resetScores() {
  setCurrentScoreByPlayer('A', 0)
  setCurrentScoreByPlayer('B', 0)
}

function saveScore(player, score) {
  let playerInfo = JSON.parse(localStorage.getItem(player)) 
  playerInfo.score = score
  localStorage.setItem(player, JSON.stringify(playerInfo))
}

function savePlayerName(player, name) {
  let playerInfo = JSON.parse(localStorage.getItem(player)) 
  playerInfo.name = name
  localStorage.setItem(player, JSON.stringify(playerInfo))
}

function saveAvatar(player, avatar) {
  let playerInfo = JSON.parse(localStorage.getItem(player)) 
  playerInfo.avatar = avatar
  localStorage.setItem(player, JSON.stringify(playerInfo))
}

function changeAvatar(player, image) {
  const url = new URL(image.src)
  const nextAvatar = avatars[(avatars.indexOf(url.pathname) + 1) % avatars.length]
  image.src = nextAvatar
  saveAvatar(player, nextAvatar)
}

function setAvatar(player, avatar) {
  document.getElementById(`avatar${player}`).src = avatar
}

function onSoundBtnClick(btn) {
  const oldPref = isSoundOn()
  const newPref = !oldPref
  saveSoundPreference(newPref)
  setSoundButton(btn, newPref)
}

function resetSoundButton(btn) {
  btn.classList.remove('off')
  btn.classList.remove('on')
}

function setSoundButton(btn, soundPreference) {
  resetSoundButton(btn)
  if (soundPreference) {
    btn.classList.add('on')
  } else {
    btn.classList.add('off')
  }
}

function isSoundOn() {
  return localStorage.getItem('sound') !== null ? JSON.parse(localStorage.getItem('sound')) : false
}

function saveSoundPreference(soundPreference) {
  localStorage.setItem('sound', JSON.stringify(soundPreference))
}

function toFixScreen() {
  window.scrollTo(document.body.scrollLeft, document.body.scrollTop)
  document.body.style.overflow = 'hidden'
  document.body.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.height = '100%'
}

function play(audioBuffer) {
  if (isSoundOn()) {
    const source = context.createBufferSource()
    source.buffer = audioBuffer
    source.connect(context.destination)
    source.start()
  }
}

function initAudio() {
  Object.keys(SOUND).map(key => {
    window.fetch(`/sounds/${key}.mp3`)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      SOUND[key] = audioBuffer
    })
  })
}

function initLocalStorage(...players) {
  players.map(player => {
    if (localStorage.getItem(player) === null) {
      localStorage.setItem(player, JSON.stringify({ name: '', score: 0, avatar: defaultAvatar}))
    }
  })
  if (localStorage.getItem('sound') === null) {
    localStorage.setItem('sound', JSON.stringify(false))
  }
}

function loadPlayers (...players) {
  players.map(player => {
    const loadedPlayer = JSON.parse(localStorage.getItem(player))
    setPlayerName(player, loadedPlayer.name)
    setCurrentScoreByPlayer(player, loadedPlayer.score)
    if (loadedPlayer.avatar) {
      setAvatar(player, loadedPlayer.avatar)
    }
  })
}

function loadSettings() {
  setSoundButton(document.getElementById('btnSound'), isSoundOn())
}

function onLoad() {
  initLocalStorage('A', 'B')
  initAudio()
  loadPlayers('A', 'B')
  loadSettings()
}