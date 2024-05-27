// econtrar botão adicionar tarefa
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textareaTarefa = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const ulTarefasDoing = document.querySelector('.app__section-task-list-doing');
const ulTarefasDone = document.querySelector('.app__section-task-list-done');
const btnCancelarAdicaoTarefa = document.querySelector('.app__form-footer__button--cancel');
// const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

const toDoBoard = document.querySelector('.app__section-task-todo');
const doingBoard = document.querySelector('.app__section-task-doing');
const doneBoard = document.querySelector('.app__section-task-done');

toDoBoard.ondragover = (e) => {
    allowDrop(e)
}
doingBoard.ondragover = (e) => {
    allowDrop(e)
}
doneBoard.ondragover = (e) => {
    allowDrop(e)
}

toDoBoard.ondrop = (e) => {
    drop(e)
}
doingBoard.ondrop = (e) => {
    drop(e)
}
doneBoard.addEventListener('drop', (e) => {
    drop(e)
}, false)

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const target = ev.target
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    const listaBoard = ev.target.querySelector('ul');
    console.log(listaBoard)
    listaBoard.appendChild(document.getElementById(data));
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// JSON.parse tranforma uma string em json
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefasDoing = JSON.parse(localStorage.getItem('tarefasDoing')) || [];
let tarefasDone = JSON.parse(localStorage.getItem('tarefasDone')) || [];
let tarefaSelectionada = null;
// referência para o elemento li criado para tarefa
// para poder usar em qualquer parte do código
let liTarefaSelectionada = null;

function esconderFormTarefa() {
    textareaTarefa.value = '';
    formAdicionarTarefa.classList.toggle('hidden');
}

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    li.setAttribute('draggable', 'true')
    const nomeTarefa = tarefa.descricao.replace(/ /g,'')
    li.setAttribute('id', nomeTarefa)
    // li.setAttribute('ondrag', 'drag(event)')

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');

    botao.append(imagemBotao);

    li.append(svg, paragrafo, botao);

    // a sintaxe abaixo do appendChild para esse contexto funciona igual ao append acima
    // a diferença é que o append dá pra inserir texto também
    // ex.: li.append(svg, paragrafo, 'teste', botao);
    // li.appendChild(svg)
    // li.appendChild(paragrafo)
    // li.appendChild(botao)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    }
    // } else {
    //     li.onclick = () => {
    //         document.querySelectorAll('.app__section-task-list-item-active')
    //             .forEach(li => {
    //                 li.classList.remove('app__section-task-list-item-active')
    //             })

    //         if (tarefaSelectionada == tarefa) {
    //             tarefaSelectionada = null;
    //             liTarefaSelectionada = null;
    //             paragrafoDescricaoTarefa.textContent = null;
    //             return
    //         }

    //         tarefaSelectionada = tarefa;
    //         liTarefaSelectionada = li;
    //         paragrafoDescricaoTarefa.textContent = tarefa.descricao;
    //         li.classList.add('app__section-task-list-item-active')
    //     }
    // }

    li.ondragstart = (e) => {
        drag(e)
    }

    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
    //alternancia da classe - sem tem tira, se não tem coloca
    formAdicionarTarefa.classList.toggle('hidden');
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    //o evento padrão do submit é recarrecar a página, e vamos mudar esse comportamento
    evento.preventDefault();

    // criar um objeto 'tarefa' com a descrição digitada
    const tarefa = {
        descricao: textareaTarefa.value
    }
    tarefas.push(tarefa);

    // adiciona a tarefa na lista de tarefas mostrada na tela
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);

    // localStorage só trabalha com string por isso não podemos passar diretamente o valor do array tarefas
    // JSON é uma API do próprio navegador que irá transformas a lista em uma string no formato Json
    atualizarTarefas();

    //limpar o textarea e esconder o formulário
    esconderFormTarefa();
})

// Diferenã do onclick para o addEventListener é que:
// onclick - seta a ação assim que a página carrega, se declarado mais de uma vez a última prevalece
// addEventListener - fica escutando os eventos no elemento e só aplica ao acontecer o evento
// pode declarar várias ações para o mesmo evento que todas acontecem e não sobrescreve
btnCancelarAdicaoTarefa.onclick = esconderFormTarefa;

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

// Adiciona um listener no documento para capturar o evento disparado no script.js
document.addEventListener('focoFinalizado', () => {
    if (tarefaSelectionada && liTarefaSelectionada) {
        liTarefaSelectionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelectionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelectionada.querySelector('.app_button-edit').setAttribute('disabled', 'disabled')
        tarefaSelectionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas
        ?'.app__section-task-list-item-complete'
        :'.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })

    tarefas = somenteCompletas
        ? tarefas.filter(tarefa => !tarefa.completa)
        : []
    atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)

btnRemoverTodas.onclick = () => removerTarefas(false);