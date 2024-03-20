document.addEventListener('DOMContentLoaded', function () {
    const displayClave = document.getElementById('clave');
    const displayContador = document.getElementById('contador');
    const botonesNumeros = document.querySelectorAll('.numero');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');

    const crono = new Crono(displayContador);
    const soundVictoria = new Audio('victoria.mp3');

    let claveSecreta = [];

    // Función para generar la clave secreta
    function generarClaveSecreta() {
        claveSecreta = [];
        for (let i = 0; i < 4; i++) {
            claveSecreta.push(Math.floor(Math.random() * 10));
        }
        console.log("Clave secreta generada:", claveSecreta);
        actualizarClave();
    }

    // Función para actualizar la visualización de la clave
    function actualizarClave() {
        displayClave.innerHTML = '';
        claveSecreta.forEach((digito, index) => {
            displayClave.innerHTML += `<span data-index="${index}">?</span>`;
        });
    }

    // Función para comprobar si la clave secreta ha sido adivinada
    function claveAdivinada() {
        return claveSecreta.every((digito, index) => {
            return digito == parseInt(displayClave.children[index].innerText);
        });
    }

    function clickNumero(event) {
        const numero = event.target.innerText;
    
        if (!crono.timer) {
            crono.start();
            generarClaveSecreta();
        }
    
        // Buscar todas las posiciones donde el número coincide con la clave
        let claveAdivinadaCompleta = false;
        for (let i = 0; i < claveSecreta.length; i++) {
            if (claveSecreta[i] == parseInt(numero)) {
                const span = displayClave.querySelector(`span[data-index="${i}"]:not(.acertado)`);
                if (span) {
                    span.innerText = numero;
                    span.style.color = 'green'; 
                    // Verificar si la clave ha sido adivinada completamente
                    if (!claveAdivinadaCompleta && claveAdivinada()) {
                        crono.stop();
                        soundVictoria.play();
                        alert(`¡Enhorabuena, has adivinado la clave (${claveSecreta.join('')}) en un tiempo de ${crono.min}:${crono.seg}:${crono.cent}!`);
                        claveAdivinadaCompleta = true;
                    }
                }
            }
        }
    }
    
    botonesNumeros.forEach(button => {
        button.addEventListener('click', clickNumero);
    });

    startButton.addEventListener('click', () => {
        crono.start();
    });

    stopButton.addEventListener('click', () => {
        crono.stop();
    });

    resetButton.addEventListener('click', () => {
        crono.stop();
        crono.reset();
        generarClaveSecreta();
    });
});
