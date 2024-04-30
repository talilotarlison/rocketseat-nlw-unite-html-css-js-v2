// Importação do array de objeto dos usuarios;

import participantes from './users.js';

// Componente usuario que mostra na tela do usurio cadastrado;

let componenteUsuarios = (participantes) => {
    let dataInscricaoFormatada = dayjs(Date.now()).to(participantes.dataInscricao);
    let dataCheckInFormatada = dayjs(Date.now()).to(participantes.dataCheckIn);

    if (participantes.dataCheckIn === null) {
        dataCheckInFormatada = `
                                <button class='chek-in' data-email='${participantes.email}'>
                                    Confirmar Check-In. 
                                </button>

                                `
    }

    return (
        `
            <tr>
                <td>
                    <span>${participantes.nome}</span><br>         
                    <small>${participantes.email}</small>
                </td>
                <td>${dataInscricaoFormatada}</td>
                <td>${dataCheckInFormatada}</td>
            </tr>   
             `
    );
}

// Função mostra todos os participantes na tela;

let showParticipantes = (participantes) => {
    document.querySelector('tbody').innerHTML = ' ';

    participantes.map((participante) => {
        document.querySelector('tbody').innerHTML += componenteUsuarios(participante);
    });
}

// Cancelar o evento de recarregar pagina pelo botao;

const btn = document.querySelector(".btn");

btn.addEventListener("click", (event) => {

    /* Cancelar o evento de recarregar pagina;
     * https://developer.mozilla.org/pt-BR/docs/Web/API/Event/preventDefault 
     */
    event.preventDefault();

    /* Usando formDate para pegar dados do formulario; 
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
     */
    getDadosParticipante();
});

// Pega os dados do usuario do formulario;

let getDadosParticipante = () => {
    const form = document.querySelector(".formulario");
    const dadosDoFormulario = new FormData(form);
    // Função que valida dados do usuario cadastrado;
    validarDadosForm(dadosDoFormulario.get('name'), dadosDoFormulario.get('email'));
}

// Limpar input do formulario;

let limparCampo = () => {
    const nome = document.querySelector("#name");
    const email = document.querySelector("#email");

    nome.value = "";
    email.value = "";

    focoInput();
}

/* Função alert na tela para usuario;
 * [sucesso] - Para sucesso; 
 * [erro] - Para Erro no nome e Email;
 * [erroNome] - Para Erro no nome; 
 * [erroEmail] - Para Erro no Email;     
 */

let alertTela = (alert = "erro") => {
    const divName = document.querySelector(".name");
    const divEmail = document.querySelector(".email");

    let corErro = "red";
    let corSucesso = "aquamarine";

    let alertTelaInput = (corName, corEmail) => {
        divName.setAttribute("style", `border:2px; border-style:solid; border-color:${corName};`);
        divEmail.setAttribute("style", `border:2px; border-style:solid; border-color:${corEmail};`);
    }

    /* Uso do setAttribute em js;
     * https://stackoverflow.com/questions/50960526/add-attribute-value-right-below-border-of-html-element-with-javascript-css
     */
    if (alert == "sucesso") {
        alertTelaInput(corSucesso, corSucesso);
    } else if (alert == "erro") {
        alertTelaInput(corErro, corErro);
    }
    else if (alert == "erroNome") {
        alertTelaInput(corErro, corSucesso);
    }
    else if (alert == "erroEmail") {
        alertTelaInput(corSucesso, corErro);
    }

}

/* Função de foco no input;
 * [nome] - para foco no nome
 * [email] - para foco no email
 *
 */

let focoInput = (foco = 'nome') => {
    const nome = document.querySelector("#name");
    const email = document.querySelector("#email");
    if (foco == 'nome') {
        nome.focus();
    } else if (foco == 'email') {
        email.focus();
    }
}

// Mensagem na tele do usuario;

let mensgemTela = (msg, status) => {
    //alert(msg);
    swal(msg, '', status);
}

// valida dados de entrada do usuario;

let validarDadosForm = (nome, email) => {
    if (nome == '' && email == '') {
        mensgemTela('Os campos não podem ser vazio!', 'error');
        alertTela("erro");
        focoInput();
        return;
    } else if (nome == '') {
        mensgemTela('Os campos nome não pode ser vazio!', 'error');
        alertTela("erroNome");
        focoInput();
        return;
    } else if (email == '') {
        mensgemTela('Os campos e-mail não pode ser vazio!', 'error');
        alertTela("erroEmail");
        focoInput('email');
        return;
    } else if (!validateEmail(email)) {
        mensgemTela('Informe um e-mail valido!', 'error');
        alertTela("erroEmail");
        focoInput('email');
        return;
    } else {
        adicionaParticipante(nome, email);
    }
}

/* Validar email do usuario;
 * https://horadecodar.com.br/como-validar-email-com-javascript/
 */

let validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Adiciona o participante no array;

let adicionaParticipante = (nome, email) => {

    let novoParticipante = {
        nome: nome,
        email: email,
        dataInscricao: Date.now(),
        dataCheckIn: null
    };

    // validar se email ja cadastrado no sistema;

    let buscaEmailUsuario = participantes.find((participante) => {
        return participante.email === email ? true : false;

    });

    if (buscaEmailUsuario) {
        mensgemTela('E-mail ja cadastrado no sistema!', "error")
        limparCampo();
    } else {
        participantes.unshift(novoParticipante);
        showParticipantes(participantes);
        alertTela('sucesso');
        mensgemTela('Usuario adicionado com sucesso!!', "success")
        limparCampo();
        clickCheckInUser();
    }

}

// Suponha que todos os botões tenham a classe "meu-botao";

let clickCheckInUser = () => {

    const botoes = document.querySelectorAll('.chek-in');

    // Adicione um ouvinte de clique a cada botão;
    botoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // Lógica para manipular o clique do botão aqui;
            let emailChekIn = e.target.dataset.email;
            let msgConfirme = 'Você deseja relmente confirmar o checkIn?';
            // Validar se usuario quer fazer checkIn;
            swal({
                title: msgConfirme,
                buttons: ["Não!", "Yes"],
            }).then((willDelete) => {
                if (willDelete) {
                    // Coloque aqui o código que será executado após a confirmação do usuário

                    var checkInUserNow = participantes.find((participante) => {
                        return participante.email == emailChekIn;
                    });

                    // Assuming you know the index of the user you want to remove
                    const indexToRemove = participantes.findIndex((participante) => participante.email === emailChekIn);

                    if (indexToRemove !== -1) {
                        participantes.splice(indexToRemove, 1);
                    }

                    var user = {
                        nome: checkInUserNow.nome,
                        email: checkInUserNow.email,
                        dataInscricao: checkInUserNow.dataInscricao,
                        dataCheckIn: Date.now()
                    }

                    participantes.unshift(user)
                    showParticipantes(participantes);
                    clickCheckInUser();

                    let msg = "Ação confirmada pelo usuário!";
                    mensgemTela(msg,"success");
                } else {
                    let msg ="Ação cancelada pelo usuário.";
                    mensgemTela(msg,"error");
                }
            });

            //if(confirm(msgConfirme)==false){
            //    return;
            //}

        });
    });
}

/* 
 * Link para o projeto original da Rocketseat;
 * https://github.com/rocketseat-education/nlw-unite-html-css-js/tree/main  
 */
focoInput();
showParticipantes(participantes);
clickCheckInUser();