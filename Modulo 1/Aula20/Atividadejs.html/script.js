
 
 let usuariosCadastrados = [{
      nome: "Wanderson Honorato",
      idade: 27,
      cpf: "07279901360",
      foto: "https://media.licdn.com/dms/image/v2/D4E03AQFLCGyFoEHtMg/profile-displayphoto-scale_400_400/B4EZzS5YpZIMAk-/0/1773064785813?e=1778716800&v=beta&t=2pkP4nlcWzXr5L7KRDbkOL9a3YSZcsGB9VoHqNWEbCk"
    },
    {
      nome: "Lionel Messi",
      idade: 36,
      cpf: "12345678901",
      foto: "https://www.espn.com.br/futebol/jogador/_/id/45843/lionel-messi"
    },
    {
      nome: "Cristiano Ronaldo",
      idade: 38,
      cpf: "11111111111",
      foto: "https://br.pinterest.com/pin/44965696270079692/"
    }];

  function cadastrarUsuario() {
    let nome = document.getElementById("nome");
    let idade = document.getElementById("idade");
    let cpf = document.getElementById("cpf");
    let foto = document.getElementById("foto");

    if (nome.value === "" || idade.value === "" || cpf.value === "" || foto.value === "") {
      alert("Preencha todos os campos para cadastrar um usuário.");
      return;
    }

    let novoUsuario = {
      nome: nome.value,
      idade: parseInt(idade.value),
      cpf: cpf.value,
      foto: foto.value
    };
    usuariosCadastrados.push(novoUsuario);

    console.log(`Usuário ${novoUsuario.nome} cadastrado com sucesso!`);
    limparCampos();
  }
  
  function listarUsuario() {
    let resultado = document.getElementById("resultado");
    resultado.innerHTML = "";

    usuariosCadastrados.forEach(usuario => {
      resultado.innerHTML += `
        <div class="col-12 col-md-4 mb-4">
        <div class="card shadow">
        <img src="${usuario.foto}" class="card-img-top">
        <div class="card-body">
        <h5 class="card-title fw-bold">${usuario.nome}</h5>
        <p class="card-text">Idade: ${usuario.idade}</p>
        <p class="card-text">CPF: ${usuario.cpf}</p>
        </div>
        </div>
        </div>`;
    });
  }

function editarUsuario() {
    let cpfDigitado = document.getElementById("cpf").value;
    let usuariosEncontrado = null;

    for (let i = 0; i < usuariosCadastrados.length; i++) {
        if (usuariosCadastrados[i].cpf == cpfDigitado) {
            usuariosEncontrado = usuariosCadastrados[i];
        }
    }

    if (usuariosEncontrado) {
        document.getElementById("nome").value = usuariosEncontrado.nome;
        document.getElementById("idade").value = usuariosEncontrado.idade;
        document.getElementById("foto").value = usuariosEncontrado.foto;

        console.log("Usuário encontrado!");
    } else {
        alert("Usuário não encontrado.");
    }
}

  function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("foto").value = "";
  }