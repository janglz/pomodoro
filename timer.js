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

const timeTable = [ work, relax, work, relax, work, relax, work, longRelax ]; //расписание промежутков работы и отдыха

workTimeInput.addEventListener('change', ()=> work.time = workTimeInput.value);
breakTimeInput.addEventListener('change', ()=> relax.time = breakTimeInput.value);
longBreakTimeInput.addEventListener('change', ()=> longRelax.time = longBreakTimeInput.value);

let timerOn = false;
let alreadyStarted = false;

const state = {
  timerOn: false,
}

//тут создается новый таймер, на основании полученного времени, и рекурсивно тикает, пока не кончится принятый им интервал

const createNewTimer = async (currentPeriod = 0) => {
  console.log('big interval launched')
  console.log(state.timerOn)
  const current = timeTable[currentPeriod];
  current.working ? makePomodoroGreen() : makePomodoroRed();

  for (let counter = Math.floor(current.time * 60); counter >= 0; counter -= 1) {
    console.log(counter);
    changeTimeInPomodoro(counter)
    await new Promise(resolve => {
      setTimeout(() => resolve(), 1000);
    })
    console.log(counter)
    if (!state.timerOn) { 
      console.log(state.timerOn)
      clearTimeout(changeTimeInPomodoro);
      counter = 0;
      return counter = 0;
    }
    if (counter <= 0 && state.timerOn) {
      createNewTimer(currentPeriod + 1);
    }
  }
}

//эта функция сует результат в DOM 
const changeTimeInPomodoro = (seconds) => {
  let sec = String (seconds % 60);
  let min = String ((seconds - sec) / 60);
  if (min.length === 1) min = `0${min}`;
  if (sec.length === 1) sec = `0${sec}`;
  pomodoro.innerHTML = `<p class="timer">${min}:${sec}</p>`;
  console.log(min, sec);
}

const makePomodoroRed = () => {
  pomodoro.classList.remove('pomodoro-green');
  currentStatusToDom.innerHTML = `relax`
  audioStop.currentTime = 0;
  audioStop.play();
}

const makePomodoroGreen = () => {
  pomodoro.classList.add('pomodoro-green');
  currentStatusToDom.innerHTML = `working`
  audioStart.currentTime = 0;
  audioStart.play();
}

const clearTimeInPomodoro = () => {
  pomodoro.innerHTML = `<p class="timer">00:00</p>`
  currentStatusToDom.innerHTML = `stopped`
}

startTimerButton.addEventListener('click', ()=>{
  if (alreadyStarted) return; //чтоб не нажималась кнопка старта более 1 раза
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


const audioStart = new Audio("content/work-sound.wav");
const audioStop = new Audio("content/stop-sound.wav");
