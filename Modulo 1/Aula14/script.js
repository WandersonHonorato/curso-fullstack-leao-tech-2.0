
// IF TERNÁRIO

// 1. Verificação de acesso ao cinema: 
// Crie um programa que receba a idade e se a pessoa tem ingresso Ela só pode entrar se a idade for maior que 16 anos e tiver ingresso


// let idade = prompt('Qual sua idade?')
// let Ingresso = confirm('Você tem o ingresso?')

// let AcessCinema = (idade > 16 && Ingresso) 
//       ? "Acesso permitido! Bom filme." 
//       : "Acesso negado. Verifique a idade ou o ingresso.";
// console.log(AcessCinema);


// 2. Validação de login:
// Crie um programa que peça o nome de usuário e a senha, se o nome de usuário for 'admin' e a senha for 'admin123' diga que ela conseguiu logar se ela errar uma das duas diga 'usuário não encontrado'


// let user = prompt('Qual o seu usuário?')
// let pass = prompt('Qual a sua senha?')

// let statusAcesso  = (user === 'admin' && pass === 'admin123') 
//      ? "Login realizado com sucesso! (200)" 
//      : "Usuário não econtrado (404)";
// console.log(statusAcesso);


//  3. Frete grátis:
// Crie um programa que receba o valor de uma compra e se o cliente é VIP. O cliente ganhará frete grátis se a compra for mais de 1000 ou se for VIP.


// let value = prompt('Qual o valor da sua compra?')
// let vip = confirm('Você é VIP?')

// let freeDelivery  = ((value > 1000) && (vip === true))
//         ? "Você ganhou frete gratis na sua compra" 
//         : "Você não é Vip e não atingiu o limite de compra";
// console.log(freeDelivery);



// 4. Bloqueio de acesso:
// Crie um programa que receba se o usuário digitou senha correta. Se a senha não estiver correta, mostrar "Acesso negado".

// let senha = prompt('Digite sua senha')
// senha = parseInt(senha)

// let ErrorPasswaord = ((senha === 'admin123')) ? 'Logado com sucesso' : 'Acesso Negado'
// console.log(ErrorPasswaord);


// 5. Entrada em festa
// Receba idade e se tem convite.
// Se menor de 16 -> “Entrada proibida”
// Se ≥ 16 e não tem convite -> “Precisa de convite”
// Se ≥ 16 e tem convite -> “Entrada liberada”




// 6. Compra com desconto especial
// Receba valor da compra, se é VIP e se tem cupom.
// Se valor ≥ 100	
// Dentro disso: ganha desconto se for VIP ou tiver cupom
// Senão: sem desconto






// 7.Liberação de empréstimo
// Receba salário, score e se é cliente antigo.
// Se salário ≥ 2000
// Dentro disso: aprova se score ≥ 700 ou (score ≥ 500 e cliente antigo)
// Senão: empréstimo negado 



// Utilize o if ternário para resolver as seguintes questões:

// 1. Verifique se o usuário do sistema é maior de idade ou não.
// 2. Peça ao usuário um número e verifique se ele é ímpar ou par.
// 3. Peça ao usuário a nota de um aluno e se for maior que 7, mostre aprovado se não mostre recuperação.
// 4. Peça para um usuário digitar um número e só permita que o número seja positivo.
// 5. Peça para o usuário digitar o preço de um produto e diga se ele é caro se custar mais de 100 reais e barato se custar menos que 100.


// Utilize o switch para resolver as seguintes questões 


// 1. Você está desenvolvendo um sistema simples de menu para um aplicativo.

// Solicite ao usuário uma opção digitando:
// 1 - Cadastrar usuário
// 2 - Listar usuários
// 3 - Sair do sistema

// Utilize switch para exibir a ação correspondente a cada opção. Caso o valor seja inválido, exiba "Opção inválida".

// 2. Crie um programa para mostrar o nome do mês de acordo com o número digitado. 1 = "Janeiro", 2 = "Fevereiro" ....

// 3. Um sistema escolar classifica alunos por conceito.
// Solicite ao usuário uma letra (A, B, C ou D) e utilize switch para exibir:

// A → "Excelente desempenho"
// B → "Bom desempenho"
// C → "Desempenho regular"
// D → "Desempenho insuficiente"

// Caso seja informada outra letra, exiba "Conceito inválido".

// 4. sistema de atendimento com fluxo (menu interativo)

// Você está desenvolvendo um sistema de atendimento para um aplicativo.

// O usuário deve escolher uma opção:

// 1 - Criar conta
// 2 - Fazer login 
// 3 - Recuperar senha

// Dependendo da escolha, o sistema deve:

// 1 (Criar conta):
// 	pedir nome
// 	pedir email
// 	pedir senha
// 	exibir: "Conta criada com sucesso para [nome]"
// 2 (Login):
// 	pedir email
// 	pedir senha
// 	exibir: "Login realizado com sucesso"
// 3 (Recuperar senha):
// 	pedir email
// 	perguntar "Deseja receber código por email ou SMS?"
// 	exibir: "Instruções enviadas"

// Caso a opção seja inválida, exibir "Opção inválida"

// 5. sistema de saque/depósito (simulação de caixa eletrônico)

// Você está desenvolvendo um sistema simples de caixa eletrônico.

// O sistema deve iniciar com um saldo fictício de R$ 1000.

// Mostre o seguinte menu:

// 1 - Consultar saldo
// 2 - Sacar dinheiro
// 3 - Depositar dinheiro

// Utilize switch para controlar o fluxo do sistema.

// Regras:

// 1 (Consultar saldo):
// 	exibir o saldo atual
// 2 (Sacar dinheiro):
// 	pedir o valor do saque
// 	verificar:
// 	se o valor é menor ou igual ao saldo → realizar saque
// 	senão → exibir "Saldo insuficiente"
// 		atualizar o saldo
// 	exibir novo saldo
// 3 (Depositar dinheiro):
// 	pedir o valor do depósito
// 	adicionar ao saldo
// 	exibir novo saldo




//                                        * ATIVIDADE PARA ENTREGAR *



/////////////////////////  Laço de repetição ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. Você está desenvolvendo um sistema simples de menu para um aplicativo.

// Solicite ao usuário uma opção digitando:
// 1 - Cadastrar usuário
// 2 - Listar usuários
// 3 - Sair do sis
// tema


// let opcao = null 

// while(opcao != '3'){
//       opcao = prompt("Digite uma opção /n1 - Cadastrar")
// } switch()



// Utilize switch para exibir a ação correspondente a cada opção. Caso o valor seja inválido, exiba "Opção inválida".

// Repita a solicitação até que a pessoa selecione a opção 3 para sair do sistema.

// #############################
// ######## for ##################
// #############################

// 1. Crie um programa que seria uma lista de desejos, onde o usuário pode pedir 3 coisas e você mostra cada um dos pedidos na tela.

// for(let i=0; 1 < 3; i ++){
//       let desejo = prompt('Digite o primeiro item')
// } console.log(`desejo`)



// 2. Crie um programa que receba um valor de compra e depois um número de parcelas, e depois mostre na tela o valor de cada parcela utilizando um for

let valorCompra = Number(prompt('Digite o valor da compra'))
let numeroParcelas = parseInt(prompt('Digite o numero de parcelas'))

let parcela = valorCompra/numeroParcelas

for(let i=1; i <= numeroParcelas; i++){
      console.log(`parcela ${1} = ${parcela.toFixed(2)}`)
}

// & as duas condição tem que ser V
// || as duas condições tem que ser V e a outra F para entrar na While

 while( (numeroParcelas >= 0) & (numeroParcelas <= 12) ) {
      console.log('Valor inválido, o nºde parcelas é em até 12x')
 }



// 3. Um sistema de caixa precisa calcular o total de uma compra.

// Solicite ao usuário a quantidade de produtos comprados.
// Depois, usando um for:
// 	peça o preço de cada produto
// 	some os valores

// Ao final, exiba o total da compra.

let quantidadeProdutos = parseInt(prompt('Qual a quantidade de produtos comprados?'))
let preçoProduto = parseFloat(prompt('Digite o valor do produto'))

let totalCompras = 0

for (let i =0; i < quantidadeProdutos; i++){
      console.log("O total da compra é: R$ " + totalCompras.toFixed(2));
      totalCompras += preçoProduto;
}



// 4. Um professor tem 10 alunos e precisa saber quantos foram aprovados, crie um programa que peça a nota de cada um dos 10 alunos e se a nota for maior ou igual a 7, mostre aprovado, se não, recuperação.

// no final mostre o total de alunos aprovados e de recuperação




// #############################
// ######## while ################
// #############################

// 1. login até acertar (simples)

// Um sistema pede senha para acesso.

// Defina uma senha fixa (ex: "1234").
// Utilize um while para continuar pedindo a senha até o usuário acertar.

// Quando acertar, exiba: "Acesso liberado".

// 2 . Menu até sair
// sistema de saque/depósito (simulação de caixa eletrônico)

// Você está desenvolvendo um sistema simples de caixa eletrônico.

// O sistema deve iniciar com um saldo fictício de R$ 1000.

// Mostre o seguinte menu:

// 1 - Consultar saldo
// 2 - Sacar dinheiro
// 3 - Depositar dinheiro
// 4 - Sair

// Utilize switch para controlar o fluxo do sistema.

// Regras:

// 1 (Consultar saldo):
// 	exibir o saldo atual
// 2 (Sacar dinheiro):
// 	pedir o valor do saque
// 	verificar:
// 	se o valor é menor ou igual ao saldo → realizar saque
// 	senão → exibir "Saldo insuficiente"
// 		atualizar o saldo
// 	exibir novo saldo
// 3 (Depositar dinheiro):
// 	pedir o valor do depósito
// 	adicionar ao saldo
// 	exibir novo saldo
// 4 (Sair):
// 	Se o usuário selecionar o 4 deve encerrar o programa, se for qualquer outra opção deve pedir novamente a opção solicitada

// 3. caixa com múltiplas compras

// Um sistema de caixa permite registrar várias compras.

// Enquanto o usuário digitar "s" (sim), o sistema deve:

// pedir o valor da compra
// somar ao total

// Quando o usuário parar, exibir:

// total arrecadado

// 4. validação de entrada

// Um sistema precisa garantir que o usuário digite um valor válido.

// Solicite um número entre 1 e 10.
// Utilize while para repetir a pergunta até o valor ser válido.

// #############################
// ######## do  while #############
// #############################

// 1. confirmação de operação (simples)

// Um sistema precisa confirmar uma ação.

// Pergunte:
// "Deseja continuar? (s/n)"

// Utilize do while para repetir até o usuário digitar "s" ou "n".


// 2. sistema de menu com operações

// Um sistema possui o menu:

// 1 - Somar dois números
// 2 - Subtrair dois números
// 3 - Sair

// Utilize do while para:

// exibir o menu
// executar a operação escolhida (usar switch)
// repetir até o usuário escolher sair