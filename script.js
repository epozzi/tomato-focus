const html = document.querySelector('html');
const optionBt = document.querySelector('.app_button-config');
const quadroCores = document.querySelector('.color-selector__ul');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const urlSpotify = document.querySelector('.music-player__input')
const spotifyPlayer = document.querySelector('.embed-player')
const fraseMotivacional = document.querySelector('.app__section__frase')
// const iniciarOuPausarTeste = startPauseBt.querySelector('#start-pause span') funciona como a linha de cima
const imagemBt = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');

const colorBtLilas = document.getElementById('color-button-lilas')
const colorBtamarelo = document.getElementById('color-button-amarelo')
const colorBtverde = document.getElementById('color-button-verde')
const colorBtazul = document.getElementById('color-button-azul')

const duracaoFoco = 1500;
const duracaoDescansoCurto = 300;
const duracaoDescansoLongo = 900;

let tempoDecorridoEmSegundos = duracaoFoco;
let intervaloId = null;
let intervaloFrase = null;

colorBtLilas.addEventListener('click', () => {
    alteraCor('lilas')
})

colorBtamarelo.addEventListener('click', () => {
    alteraCor('amarelo')
})

colorBtverde.addEventListener('click', () => {
    alteraCor('verde')
})

colorBtazul.addEventListener('click', () => {
    alteraCor('azul')
})

function alteraCor(contextoCor) {
    html.setAttribute('data-contexto', contextoCor);
}

optionBt.addEventListener('click', () => {
    quadroCores.classList.toggle('hidden')
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoFoco;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoDescansoCurto;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');

})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoDescansoLongo;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(b => b.classList.remove('active'));
    // html.setAttribute('data-contexto', contexto);
}

urlSpotify.addEventListener('input', () => {
    buscaEmbedSpotify(urlSpotify.value)
})

async function buscaEmbedSpotify(url) {
    if (url) {
        const respostaSpotify = await fetch('https://open.spotify.com/oembed?url='+url)
        const resposta = await respostaSpotify.json();
        spotifyPlayer.innerHTML = resposta.html
    }
}

function alteraPlaylist(url) {
    const finalUrl = url.substring(url.lastIndexOf('/') + 1)
    const urlSplited = url.split('/')
    const tipoUrl = urlSplited[urlSplited.length - 2]
    const embedSrc = 'https://open.spotify.com/embed/' + tipoUrl + '/' + finalUrl + '?utm_source=generator'
    spotifyPlayer.setAttribute('src', embedSrc)
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        alert('Tempo finalizado');
        // verificando se o contexto da página é foco
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        // se o contexto é foco, irá disparar um evento de foco finalizado quando o tempo acabar
        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado')
            document.dispatchEvent(evento)
            // window.dispatchEvent(evento)
            // também funciona mas o evento deve ser escutando no window e não document
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        zerar();
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = 'Pausar';
    imagemBt.setAttribute('src', '/imagens/pause.png');
    // botoes.forEach(b => b.setAttribute('disabled', true));
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = 'Começar';
    imagemBt.setAttribute('src', '/imagens/play_arrow.png');
    // botoes.forEach(b => b.removeAttribute('disabled'));
    intervaloId = null;
}

function mostrarTempo() {
    // usando o date para formatar o tempo que aparece na tela
    const tempo = new Date(tempoDecorridoEmSegundos * 1000); //*1000 pois o Date trabalha com milisegundos
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

async function apresentarFraseMotivacional() {
    intervaloFrase = setInterval(mostrarFrase, 10000);
}

let contAgua = 5;

const mostrarFrase = async () => {
    if (contAgua == 5) {
        fraseMotivacional.textContent = 'Beba água!'
        contAgua = 0
    } else {
        const frase = await getFrases();
        fraseMotivacional.textContent = frase
        contAgua++;
    }
}

async function getFrases() {
    const frases = await fetch('./frases.json');
    const jsonFrases = await frases.json();
    const frase = jsonFrases[Math.floor(Math.random() * jsonFrases.length)];
    return frase.frase
}

mostrarFrase();
apresentarFraseMotivacional();
mostrarTempo();