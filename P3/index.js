//Declarar variables y objetos
let xOrigenProyectil = 5;
let yOrigenProyectil = 300;
let xProyectil = xOrigenProyectil;
let yProyectil = yOrigenProyectil;
let ladoXProyectil = 120; 
let ladoYProyectil = 40; 

let xMinDiana = 200;
let xMaxDiana = 770;
let xDiana = getRandomInt(xMinDiana, xMaxDiana);
let yDiana = 345;

const displayCrono = document.getElementById("crono");  // Cronómetro
const displayAngulo = document.getElementById("sliderAngulo");  // Ángulo de disparo
const displayVelocidad = document.getElementById("sliderVelocidad");  // Velocidad de disparo
const mensajeVictoria = document.getElementById("mensaje"); // Mensaje de victoria o derrota

const crono = new Crono(displayCrono);

const btnLanzar = document.getElementById("btnLanzar");

const btnReniciar = document.getElementById("btnReniciar");

const canvas = document.getElementById("campotiro");

canvas.width = 800;
canvas.height = 400;

const ctx = canvas.getContext("2d");

const sonidoVictoria = new Audio('victoria.mp3');
const sonidoDerrota = new Audio('derrota.mp3');

//Establecer valores predeterminados para los deslizadores
angulo.value = 45;
velocidad.value = 50;

//-- Mostrar los valores predeterminados en los elementos de visualización
displayAngulo.innerHTML = angulo.value;
displayVelocidad.innerHTML = velocidad.value;

//-- Actualizar las variables de ángulo y velocidad con los valores predeterminados
let anguloProyectil = 45;
let velocidadProyectil = 0.05 * velocidad.value;

//Cargar la imagen del dardo
const imgDardo = new Image();
imgDardo.onload = () => {
    // Dibujar la imagen del dardo al cargar
    dibujarProyectil(xOrigenProyectil, yOrigenProyectil, ladoXProyectil, ladoYProyectil);
};
imgDardo.src = 'dardo.png';

//Cargar la imagen de la diana
const imgDiana = new Image();
imgDiana.onload = () => {
    // Dibujar la imagen de la diana al cargar
    dibujarDiana(xDiana, yDiana);
};
imgDiana.src = 'diana.png';

//Cargar la imagen de la mano
const imgMano = new Image();
imgMano.onload = () => {
    // Dibujar la imagen de la mano al cargar
    dibujarMano(xOrigenProyectil, yOrigenProyectil, ladoXProyectil, ladoYProyectil);
};
imgMano.src = 'mano.png';


//Ángulo del proyectil
angulo.oninput = () => {
    let inputAngulo = parseInt(angulo.value);
    if (inputAngulo < 0) {
        inputAngulo = 0;
    } else if (inputAngulo > 90) {
        inputAngulo = 90;
    }
    displayAngulo.innerHTML = inputAngulo;
    anguloProyectil = inputAngulo;
}

//Velocidad del proyectil
velocidad.oninput = () => {
    displayVelocidad.innerHTML = velocidad.value;
    velocidadProyectil = 0.05 * velocidad.value;
}

let tiempo = 0;

//Detectar colisión 
function colision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    }
    return false;
}

//Función principal
function lanzar() {
    
    let gravedad = 0.1 * 9.8; // Gravedad
    
    let velocidadX = velocidadProyectil * Math.cos((anguloProyectil * Math.PI) / 180); // Velocidad en el eje x
    let velocidadY = velocidadProyectil * Math.sin((anguloProyectil * Math.PI) / 180); // Velocidad en el eje y

    xProyectil = xProyectil + velocidadX * tiempo;
    yProyectil = yProyectil - velocidadY * tiempo + 0.5 * gravedad * tiempo * tiempo;

    tiempo += 0.2;

    //Verificar colisión con la diana
    let rectProyectil = {
        x: xProyectil,
        y: yProyectil,
        width: ladoXProyectil,
        height: ladoYProyectil
    };

    let rectDiana = {
        x: xDiana,
        y: yDiana,
        width: 50,
        height: 50
    };
    //Caso de victoria
    if (colision(rectProyectil, rectDiana)) {
        crono.stop();
        sonidoVictoria.play();
        alert("¡Has ganado! Pulsa 'Reiniciar' para hacer otro lanzamiento");
        return;
    }

    //Caso de derrota
    if (xProyectil < 0 || xProyectil > canvas.width || yProyectil < 0 || yProyectil > canvas.height) {
        crono.stop();
        sonidoDerrota.play(); // Reproducir el sonido de derrota
        alert("Tienes que mejorar tu puntería... ¡Prueba de nuevo pulsando 'Reiniciar'!");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarDiana(xDiana, yDiana); //Pintar la diana
    dibujarMano(xProyectil, yProyectil + ladoYProyectil, ladoXProyectil, ladoYProyectil); //Pintar la imagen de la mano debajo del proyectil
    dibujarProyectil(xProyectil, yProyectil, ladoXProyectil, ladoYProyectil); //Pintar el proyectil

    requestAnimationFrame(lanzar);
}

function dibujarMano(x, y, lx, ly) {
    ctx.drawImage(imgMano, 60, 320, 60, 100); 
}


function dibujarProyectil(x, y, lx, ly) {
    ctx.drawImage(imgDardo, x, y, lx, ly);
}

function dibujarDiana(x, y) {
    ctx.drawImage(imgDiana, x - 25, y - 25, 75, 75);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

btnLanzar.onclick = () => {
    lanzar();
    crono.start();
}

btnReiniciar.onclick = () => {
    location.reload();
    crono.stop();
    crono.reset();
}