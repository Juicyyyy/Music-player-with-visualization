const columnsGap = 0; // расстояние между колонками
const columnCount = 128; // Кол-во колонок: 1024, 512, 256, 128, 64
const canvas = document.getElementById('player-visualization');
const ctx = canvas.getContext('2d');

let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaElementSource(mainAudio);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = columnCount;
source.connect(analyser); // Подключаем анализатор к элементу audio
analyser.connect(audioCtx.destination); // Без этой строки нет звука, но анализатор работает
let frequencyData = new Uint8Array(analyser.frequencyBinCount);

// Рисует колонку
function drawColumn(x, width, height) {
    const gradient = ctx.createLinearGradient(0, canvas.height - height / 2, 0, canvas.height); // градиент колонки
    gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.9, "rgba(139, 39, 137, 1)");
    gradient.addColorStop(0, "rgba(238, 196, 237, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, canvas.height - height / 2, width, height);
}

// анимация колонок
function render() {
    analyser.getByteFrequencyData(frequencyData); // Записываем в массив данные уровней частот 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const columnWidth = (canvas.width / frequencyData.length) - columnsGap + (columnsGap / frequencyData.length) // Ширина колонки
    const heightScale = canvas.height / 100; // Масштабный коэффициент

    let xPos = 0;

    for (let i = 0; i < frequencyData.length; i++) {
        let columnHeight = frequencyData[i] * heightScale; // высота колонки
        drawColumn(xPos, columnWidth, columnHeight / 2);
        xPos += columnWidth + columnsGap; // смещение колонки
    }
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);