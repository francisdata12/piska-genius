
const player = document.getElementById('audio-player');
const visor = document.getElementById('nombre-cancion-sonando');
const tablero = document.getElementById('tablero-memoria');
const txtParejas = document.getElementById('parejas-encontradas');
const txtTotalParejas = document.getElementById('total-parejas');
const txtMovimientos = document.getElementById('movimientos');

let cartasSeleccionadas = [];
let bloqueoTablero = false;
let parejasEncontradas = 0;
let movimientos = 0;
let nivelActual = 'facil';

const cancionesNombres = {
    2: "🎵 El Pasito del 2", 3: "🐾 El Safari del 3", 4: "🏆 Las Olimpiadas del 4",
    5: "🚀 Misión Espacial del 5", 6: "👨‍🍳 El Chef del 6", 7: "🏴‍☠️ El Tesoro del 7",
    8: "🤖 El Código Robot 8", 9: "🪄 El Hechizo del 9", 10: "🎭 El Carnaval del 10"
};

function configurarJuego(nivel) {
    nivelActual = nivel;
    cartasSeleccionadas = [];
    bloqueoTablero = false;
    parejasEncontradas = 0;
    movimientos = 0;
    
    if(txtParejas) txtParejas.textContent = 0;
    if(txtMovimientos) txtMovimientos.textContent = 0;

    if(tablero) tablero.className = `tablero-grid ${nivel}`;
    
    document.querySelectorAll('.btn-nivel').forEach(btn => btn.classList.remove('active'));
    const botonActivo = document.getElementById(`btn-${nivel}`);
    if (botonActivo) botonActivo.classList.add('active');

    let totalPiezas, maxNumero, minNumero;

    if (nivel === 'facil') {
        totalPiezas = 20; 
        minNumero = 0; maxNumero = 9; 
    } else if (nivel === 'medio') {
        totalPiezas = 40; 
        minNumero = 10; maxNumero = 99; 
    } else {
        totalPiezas = 60; 
        minNumero = 100; maxNumero = 999; 
    }

    const totalPares = totalPiezas / 2;
    if(txtTotalParejas) txtTotalParejas.textContent = totalPares;

    let numerosUnicos = new Set();
    while (numerosUnicos.size < totalPares) {
        let numAleatorio = Math.floor(Math.random() * (maxNumero - minNumero + 1)) + minNumero;
        numerosUnicos.add(numAleatorio);
    }

    let listaCartas = [...numerosUnicos, ...numerosUnicos];
    listaCartas.sort(() => Math.random() - 0.5); 

    crearTableroHTML(listaCartas);
}

function crearTableroHTML(listaCartas) {
    if(!tablero) return;
    tablero.innerHTML = ''; 

    listaCartas.forEach(numero => {
        const elementoCarta = document.createElement('div');
        elementoCarta.classList.add('carta-memoria');
        elementoCarta.dataset.valor = numero;

        elementoCarta.innerHTML = `
            <div class="cara cara-atras">?</div>
            <div class="cara cara-frente">${numero}</div>
        `;

        elementoCarta.addEventListener('click', voltearCarta);
        tablero.appendChild(elementoCarta);
    });
}

function voltearCarta() {
    if (bloqueoTablero) return;
    if (this === cartasSeleccionadas[0]) return; 
    if (this.classList.contains('emparejada')) return;

    this.classList.add('volteada');
    cartasSeleccionadas.push(this);

    if (cartasSeleccionadas.length === 2) {
        movimientos++;
        if(txtMovimientos) txtMovimientos.textContent = movimientos;
        comprobarPareja();
    }
}

function comprobarPareja() {
    let valor1 = cartasSeleccionadas[0].dataset.valor;
    let valor2 = cartasSeleccionadas[1].dataset.valor;
    
    console.log("Comparando:", valor1, "con", valor2);

    let esPareja = valor1 === valor2;
    if (esPareja) {
        console.log("¡Son iguales! Entrando a deshabilitarCartas()...");
        deshabilitarCartas();
    } else {
        console.log("No son iguales.");
        desvoltearCartas();
    }
}

function deshabilitarCartas() {
    const carta1 = cartasSeleccionadas[0];
    const carta2 = cartasSeleccionadas[1];

    carta1.style.pointerEvents = "none";
    carta2.style.pointerEvents = "none";
    
    carta1.classList.add('emparejada');
    carta2.classList.add('emparejada');

    const carasInternas = [
        ...carta1.querySelectorAll('.cara'),
        ...carta2.querySelectorAll('.cara')
    ];

    const esModoNino = document.body.classList.contains('modo-nino');
    
    if (esModoNino) {

        carta1.style.setProperty('background-color', '#C8E6C9', 'important');
        carta2.style.setProperty('background-color', '#C8E6C9', 'important');
        
        carasInternas.forEach(cara => {
            cara.style.setProperty('background-color', '#C8E6C9', 'important');
            cara.style.setProperty('border-color', '#4CAF50', 'important');
            cara.style.setProperty('color', '#1B5E20', 'important');
        });
    } else {
        
        carta1.style.setProperty('background-color', '#FFB7D5', 'important');
        carta2.style.setProperty('background-color', '#FFB7D5', 'important');
        
        carasInternas.forEach(cara => {
            cara.style.setProperty('background-color', '#FFB7D5', 'important');
            cara.style.setProperty('border-color', '#FF69B4', 'important');
            cara.style.setProperty('color', '#b0065d', 'important');
        });
    }

    parejasEncontradas++;
    if(txtParejas) txtParejas.textContent = parejasEncontradas;

    cartasSeleccionadas = [];
    bloqueoTablero = false;

    const totalPares = parseInt(txtTotalParejas.textContent);
    if (parejasEncontradas === totalPares) {
        setTimeout(() => {
            alert(`¡Felicidades! Completaste el nivel en ${movimientos} movimientos. 🎉🧠`);
        }, 500);
    }
}
function desvoltearCartas() {
    bloqueoTablero = true;
    setTimeout(() => {
        cartasSeleccionadas[0].classList.remove('volteada');
        cartasSeleccionadas[1].classList.remove('volteada');
        resetearSeleccion();
    }, 1000);
}

function resetearSeleccion() {
    cartasSeleccionadas = [];
    bloqueoTablero = false;
}

function playT(numero) {
    const nombreBonito = cancionesNombres[numero];
    if (nombreBonito) {
        if (visor) visor.innerText = nombreBonito;
        player.src = "musica/tabla" + numero + ".mp3"; 
        player.play();
    }
}
function reanudarMusica() { if(player) player.play(); }
function pausarMusica() { if(player) player.pause(); }
function detenerMusica() {
    if(player) {
        player.pause();
        player.currentTime = 0;
    }
    if (visor) visor.innerText = "Música detenida ⏹️";
}

function cambiarEstilo(genero) {
    const cuerpo = document.body;
    const btnBoy = document.querySelector('.btn-avatar-v.boy');
    const btnGirl = document.querySelector('.btn-avatar-v.girl');
    const burbuja = document.querySelector('.speech-bubble');

    if (genero === 'nino') {
        cuerpo.classList.add('modo-nino');
        if (btnBoy) btnBoy.classList.add('active-style');
        if (btnGirl) btnGirl.classList.remove('active-style');
        if (burbuja) burbuja.innerText = "¡Hola, Campeón! ¿Listo para entrenar tu mente? 🚀";
    } else {
        cuerpo.classList.remove('modo-nino');
        if (btnGirl) btnGirl.classList.add('active-style');
        if (btnBoy) btnBoy.classList.remove('active-style');
        if (burbuja) burbuja.innerText = "¡Hola, Princesa Genio! ¡A brillar! 🌟";
    }
}

window.onload = () => {
    configurarJuego('facil');
};