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
  const currentScore = getCurrentScoreByPlayer(player)
  const newScore = currentScore + 1
  if (newScore < 100) {
    setCurrentScoreByPlayer(player, newScore)
  }
}

function scoreDown(player) {
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
  btn.classList.add('bounce')
  setTimeout(function() {
    btn.classList.remove('bounce')
  }, 100)
  resetScores()
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

function initLocalStorage (...players) {
  players.map(player => {
    if (localStorage.getItem(player) === null) {
      localStorage.setItem(player, JSON.stringify({ name: '', score: 0, avatar: defaultAvatar}))
    }
  })
}

function loadPlayers(...players) {
  players.map(player => {
    const loadedPlayer = JSON.parse(localStorage.getItem(player))
    setPlayerName(player, loadedPlayer.name)
    setCurrentScoreByPlayer(player, loadedPlayer.score)
    if (loadedPlayer.avatar) {
      setAvatar(player, loadedPlayer.avatar)
    }
  })
}

function onLoad() {
  initLocalStorage('A', 'B')
  loadPlayers('A', 'B')
}