let workTimeInput = document.getElementById('work-time');
let breakTimeInput = document.getElementById('break-time');
let longBreakTimeInput = document.getElementById('relax-time');
const startTimerButton = document.getElementById('start-timer');
const stopTimerButton = document.getElementById('stop-timer');
const textAreas = Array.prototype.slice.call(document.querySelectorAll('text-area'));
const pomodoro = document.querySelector('.pomodoro');
const menuButton = document.querySelector('.menu-button');
const menuPath = document.getElementById('menu-path');
const currentStatusToDom = document.querySelector('.modal-info');

const work = { time: workTimeInput.value, working: true }
const relax = { time: breakTimeInput.value, working: false }
const longRelax = { time: longBreakTimeInput.value, working: false }

const timeTable = [ work, relax, work, relax, work, relax, work, longRelax ];

workTimeInput.addEventListener('change', ()=> work.time = workTimeInput.value);
breakTimeInput.addEventListener('change', ()=> relax.time = breakTimeInput.value);
longBreakTimeInput.addEventListener('change', ()=> longRelax.time = longBreakTimeInput.value);

let timerOn = false;
let alreadyStarted = false;

const startNewTimer = (interval) => {
  let counter = interval * 60; 
  const timerTick = () => {
    changeTimeInPomodoro(counter);
    setTimeout(() => { 
      counter -= 1; 
      if (counter > 0 && timerOn === true) { 
        timerTick();  
      } 
    }, 1000);
  }
  timerTick();
}

const startPomodoro = (i = 0) => {
  if (timeTable[i] === undefined) i = 0;
  const current = timeTable[i];
  console.log(current, timerOn);
  if (current.working === true) {
    pomodoro.classList.add('pomodoro-green');
    currentStatusToDom.innerHTML = `working`
    audioStart.currentTime = 0;
    audioStart.play();
  } else {
    pomodoro.classList.remove('pomodoro-green');
    currentStatusToDom.innerHTML = `relax`
    audioStop.currentTime = 0;
    audioStop.play();
  }
  if (timerOn === true) {
    startNewTimer(current.time);
    setTimeout(() => startPomodoro(i+1), current.time * 60000); //current.time * 1000 * 60);
  }
}

const changeTimeInPomodoro = (seconds) => {
  let sec = String (seconds % 60);
  let min = String ((seconds - sec) / 60);
  if (min.length === 1) min = `0${min}`;
  if (sec.length === 1) sec = `0${sec}`;
  pomodoro.innerHTML = `<p class="timer">${min}:${sec}</p>`;
}

const clearTimeInPomodoro = () => {
  pomodoro.innerHTML = `<p class="timer">00:00</p>`
  currentStatusToDom.innerHTML = `stopped`
}

startTimerButton.addEventListener('click', ()=>{
  if (alreadyStarted) return;
  timerOn = true;
  startPomodoro();
  stopTimerButton.classList.add('button_active-timer');
  alreadyStarted = true;
})

stopTimerButton.addEventListener('click', ()=>{
  pomodoro.classList.remove('pomodoro-green');
  audioStop.currentTime = 0;
  audioStop.play();
  timerOn = false;
  alreadyStarted = false;
  setTimeout(clearTimeInPomodoro, 0);
  stopTimerButton.classList.remove('button_active-timer');
})


// анимированная кнопочка
const animatedMenuButton = document.querySelector('.open-menu-button');
const startPath = document.getElementById('start-path');
animatedMenuButton.addEventListener('click', ()=>{ 
  startPath.classList.toggle('opening');
  startPath.classList.toggle('closing');
})


const audioStart = new Audio("content/work-sound.wav");
const audioStop = new Audio("content/stop-sound.wav");
