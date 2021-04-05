let workTimeInput = document.getElementById('work-time');
let breakTimeInput = document.getElementById('break-time');
let longBreakTimeInput = document.getElementById('relax-time');
const startTimerButton = document.getElementById('start-timer');
const stopTimerButton = document.getElementById('stop-timer');
const textAreas = Array.prototype.slice.call(document.querySelectorAll('text-area'));
const pomodoro = document.querySelector('.pomodoro');
const menuButton = document.querySelector('.menu-button');
const menuPath = document.getElementById('menu-path');
const currentStatusToDom = document.querySelector('.pomodoro_leave');

const work = { time: workTimeInput.value, working: true }
const relax = { time: breakTimeInput.value, working: false }
const longRelax = { time: longBreakTimeInput.value, working: false }

const timeTable = [ work, relax, work, relax, work, relax, work, longRelax ]; //расписание промежутков работы и отдыха

workTimeInput.addEventListener('change', ()=> work.time = workTimeInput.value);
breakTimeInput.addEventListener('change', ()=> relax.time = breakTimeInput.value);
longBreakTimeInput.addEventListener('change', ()=> longRelax.time = longBreakTimeInput.value);

let timerOn = false;
let alreadyStarted = false;

const state = {
  timerOn: false,
}
//
const getTimeInMs = () => {
  const now = new Date();
  return now.getMilliseconds();
}

const createNewTimer = async (currentPeriod = 0) => {
  const current = timeTable[currentPeriod];
  current.working ? makePomodoroGreen() : makePomodoroRed();

  for (let counter = Math.floor(current.time * 60); counter >= 0; counter -= 1) {
    changeTimeInPomodoro(counter)
    const currentTime = getTimeInMs();
    await new Promise(resolve => {
      setTimeout(() => resolve(), correctedTimeout(currentTime));
    })
    if (!state.timerOn) { 
      clearTimeout(changeTimeInPomodoro);
      counter = 0;
      return counter = 0;
    }
    if (counter <= 0 && state.timerOn) {
      createNewTimer(currentPeriod + 1);
    }
  }
}


const correctedTimeout = (prevTickTime) => {
  const now = new Date();
  const currTickTime = now.getMilliseconds();
  const newTimeout = 1000 - (currTickTime - prevTickTime);
  return newTimeout < 0 ? 0 : newTimeout;
}

//эта функция сует результат в DOM 
const changeTimeInPomodoro = (seconds) => {
  let sec = String (seconds % 60);
  let min = String ((seconds - sec) / 60);
  if (min.length === 1) min = `0${min}`;
  if (sec.length === 1) sec = `0${sec}`;
  pomodoro.innerHTML = `<p class="timer">${min}:${sec}</p>`;
}

const makePomodoroRed = () => {
  pomodoro.classList.remove('pomodoro-green');
  currentStatusToDom.innerHTML = `<p class="current-status rotation">перерыв!</p>`
  audioStop.currentTime = 0;
  audioStop.play();
}

const makePomodoroGreen = () => {
  pomodoro.classList.add('pomodoro-green');
  currentStatusToDom.innerHTML = `<p class="current-status fade-in-out">работа</p>`
  audioStart.currentTime = 0;
  audioStart.play();
}

const clearTimeInPomodoro = () => {
  pomodoro.innerHTML = `<p class="timer">00:00</p>`
  currentStatusToDom.innerHTML = `<p class="current-status">остановлен</p>`
}

startTimerButton.addEventListener('click', ()=>{
  if (alreadyStarted) return; 
  state.timerOn = true;
  createNewTimer(0);
  stopTimerButton.classList.add('button_active-timer');
  alreadyStarted = true;
  
})

stopTimerButton.addEventListener('click', ()=>{
  audioStop.currentTime = 0;
  audioStop.play();
  setTimeout(() => {
    alreadyStarted = false
    pomodoro.classList.remove('pomodoro-green');
  }, 1000);
  setTimeout(clearTimeInPomodoro, 1000);
  stopTimerButton.classList.remove('button_active-timer');
  state.timerOn = false;
})


// анимированная кнопочка
const animatedMenuButton = document.querySelector('.open-menu-button');
const startPath = document.getElementById('start-path');
animatedMenuButton.addEventListener('click', ()=>{ 
  startPath.classList.toggle('opening');
  startPath.classList.toggle('closing');
})


const audioStart = new Audio("content/work-sound.mp3");
const audioStop = new Audio("content/stop-sound.mp3");
