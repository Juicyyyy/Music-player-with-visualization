const wrapper = document.querySelector(".wrapper"), // обертка
musicImg = wrapper.querySelector(".img-area img"), // изображение песни
musicName = wrapper.querySelector(".song-details .name"), // детали песни (название песни)
musicArtist = wrapper.querySelector(".song-details .artist"), // детали песни (автор)
playPauseBtn = wrapper.querySelector(".play-pause"), // кнопка play-pause
prevBtn = wrapper.querySelector("#prev"), // кнопка предыдущая песня
nextBtn = wrapper.querySelector("#next"), // кнопка следующая песня
mainAudio = wrapper.querySelector("#main-audio"), // текущая песня
progressArea = wrapper.querySelector(".progress-area"), // прогресс обертка
progressBar = progressArea.querySelector(".progress-bar"), // прогресс бар
musicList = wrapper.querySelector(".music-list"), // плейлист
moreMusicBtn = wrapper.querySelector("#more-music"), // кнопка плейлиста
closemoreMusic = musicList.querySelector("#close"); // закрыть плейлист

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1); // получаем случайный индекс песни от 1 до 5
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});


// загрузка музыки по индексу и информация о ней
function loadMusic(indexNumb){ 
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `logo/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `audio/${allMusic[indexNumb - 1].src}.mp3`;
}

//функция воспроизведения музыки
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//функция паузы музыки
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();

}

//предыдущая песня
function prevMusic(){
  musicIndex--; // изменение индекса песни
  //если индекс меньше 1, тогда индекс будет длиной массива, поэтому будет воспроизводиться последняя песня
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  pauseMusic();
  playingSong(); 
}

//следующая песня
function nextMusic(){
  musicIndex++; // изменение индекса песни
  //если индекс больше длины массива, тогда индекс будет равен 1, поэтому будет воспроизводиться первая песня
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  pauseMusic();
  playingSong(); 
}

// событие кнопки воспроизведения или паузы
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  //если isPlayMusic имеет значение true, тогда pauseMusic, иначе playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

// событие кнопки предыдущая песня
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

// событие кнопки следующая песня
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// слушатель изменения времени песни
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; // настоящее время песни
  const duration = e.target.duration; // общая продолжительность песни
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"), // настоящее время песни
  musicDuartion = wrapper.querySelector(".max-duration"); // длительность песни
  mainAudio.addEventListener("loadeddata", ()=>{
    // обновить общую продолжительность песни
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60); // минуты
    let totalSec = Math.floor(mainAdDuration % 60); // секунды
    if(totalSec < 10){ // если sec меньше 10, добавьте перед ним 0
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`; // добавляю длительность песни
  });
  // обновить текущее время воспроизводимой песни
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ // если sec меньше 10, добавьте перед ним 0
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`; // добавляю текущее время песни
});

// обновить воспроизводимую песню в соответствии с шириной прогресс бара
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //получение ширины прогресс бара
  let clickedOffsetX = e.offsetX; // получение значения смещения x
  let songDuration = mainAudio.duration; // получение общей продолжительности песни
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); 
  playingSong();
});

//shuffle, repeat, repeat_one
const repeatBtn = wrapper.querySelector("#repeat-plist"); // кнопка повтора песни
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; // получение кнопки
  switch(getText){
    case "repeat": 
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped"); // песня зациклена
      break;
    case "repeat_one": 
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled"); // Воспроизведение в случайном порядке
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped"); // плейлист зациклен
      break;
  }
});

// слушатель конца песни
mainAudio.addEventListener("ended", ()=>{
  let getText = repeatBtn.innerText; // получение кнопки
  switch(getText){
    case "repeat":
      mainAudio.currentTime = 0; //установка текущего времени на 0
      nextMusic(); // вызов функции nextMusic
      playMusic(); //вызов функции playMusic
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //установка текущего времени на 0
      loadMusic(musicIndex); //вызов функции loadMusic с аргументом, в аргументе находится индекс текущей песни
      playMusic(); //вызов функции playMusic
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //генерация случайного индекса с максимальным диапазоном длины массива
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while(musicIndex == randIndex); // этот цикл выполняется до тех пор, пока следующее случайное число не будет совпадать с текущим индексом музыки
      musicIndex = randIndex; //передача случайного индекса в musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//показать список музыки при нажатии на значок музыки
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});

// скрыть список музыки
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// создадим теги li в соответствии с длиной массива для списка
for (let i = 0; i < allMusic.length; i++) {
  // передадим название песни и исполнителя из массива
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">0:0</span>
                <audio class="${allMusic[i].src}" src="audio/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //вставка li внутри тега ul

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //продолжительности песни
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //добавление атрибута t-duration со значением общей продолжительности
  });
}

// воспроизвести определенную песню из списка, нажав на тег li
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li"); // нахожу все li
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //если индекс тега li равен musicIndex
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; // обновление текущего индекса песни с помощью щелчка по индексу li
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

const volumeMusic = document.querySelector("#volume-music"); // прогресс бар для звука
const muteButton = document.querySelector(".volume");

volumeMusic.addEventListener("input", function() { 
  mainAudio.volume = volumeMusic.value; 
});

muteButton.addEventListener("click", muter); // клик по кнопке звука
function muter() {
  if (mainAudio.volume == 0) {
      muteButton.innerText = "volume_up";
      mainAudio.volume = 1;
      volumeMusic.value = mainAudio.volume;
    } else {
      muteButton.innerText = "volume_off";
      mainAudio.volume = 0;
      volumeMusic.value = mainAudio.volume;
  } 
}

mainAudio.addEventListener('volumechange', volumizer);

function volumizer() { // изменение иконки звуки при изменении прогресс бара
  if (mainAudio.volume == 0) {
    muteButton.innerText = "volume_off";
  } 
  else { 
    muteButton.innerText = "volume_up";
  }
}