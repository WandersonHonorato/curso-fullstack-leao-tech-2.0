const prompt = require('prompt-sync')()
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
require('dotenv').config()
const express = require('express')

const app = express()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// npm i bcrypt

async function inserirLivro() {
  let name = prompt('Digite o nome do livro: ')
  let quantidade = parseInt(prompt('Digite a quantidade de livros: '))
  let genero = prompt('Digite o gênero do Livro: ') 
  let ano_publicacao = parseInt(prompt('Digite o ano de publicação do livro: '))
  let id_autor = parseInt(prompt('Digite o ID do autor do livro: '))    
    
    let novoLivro = {
        name: name,
        quantidade: quantidade,
        genero: genero,
        ano_publicacao: ano_publicacao,
        id_autor: id_autor
    }

    const {data, error} = await supabase.from('biblioteca_livro').insert(novoLivro).select()
    
    console.log(data)
    console.log(error)
}   
// inserirLivro()

//  --------------------------------------------------------------------------------------------------------------------------------

// endpoint para listar os livros, usando o método GET do express
app.get('/listarlivros', async (req, res) =>{
    const {data, error} = await supabase.from('biblioteca_livro').select('name, genero, biblioteca_autores(name,nacionalidade)')
    
    if (error) {
        console.error('Erro ao listar os livros:', error)
        res.status(500).json({ error: 'Erro ao listar os livros' })
        return
    }
    console.log(data)
    res.json(data)
})


// --------------------------------------------------------------------------------------------------------------------------------

async function NovoEmprestimo() {
    let id_usuario = parseInt(prompt('Digite o ID do usuário: '))   
    let id_livro = parseInt(prompt('Digite o ID do livro: '))
    let data_emprestimo = prompt('Digite a data do empréstimo: ')
    let data_devolucao = prompt('Digite a data de devolução: ')

    let novoEmprestimo = {
        id_usuario: id_usuario,
        id_livro: id_livro,
        data_emprestimo: data_emprestimo,
        data_devolucao: data_devolucao
    }   

    const {data, error} = await supabase.from('biblioteca_emprestimos').insert(novoEmprestimo).select()
    
    console.log(data)
    console.log(error)
}
// NovoEmprestimo()

// -------------------------------------------------------------------------------------------------------------------------------- 

// colocar o '*' para selecionar todas as colunas da tabela
async function listarLivros(name) {
    // para selecionar os campos da tabela relacionada, usar o nome da tabela e entre parênteses os campos desejados
    const {data, error} = await supabase.from('biblioteca_livro').select('name,genero, biblioteca_autores(*)').eq('name', name)

    console.log(data)
    console.log(error)

    if (error) {
        console.error('Erro ao listar os livros:', error)
        return
    }

    data.forEach(livro => {
        console.log('Título:', livro.name)
        console.log('Gênero:', livro.genero)
        console.log('------------------------')
    })
}
// listarLivros('Romeu e Julieta')

/*
eq('campo', valor) - para filtrar os resultados com base em um valor específico
neq('campo', valor) - para filtrar os resultados onde o valor do campo é diferente de um valor específico
gt('campo', valor) - para filtrar os resultados onde o valor do campo é maior que um valor específico
lt('campo', valor) - para filtrar os resultados onde o valor do campo é menor que um valor específico
lte('campo', valor) - para filtrar os resultados onde o valor do campo é menor ou igual a um valor específico
gte('campo', valor) - para filtrar os resultados onde o valor do campo é maior ou igual a um valor específico
like('campo', '%valor%') - para filtrar os resultados onde o valor do campo contém um determinado padrão
ilike('campo', '%valor%') - para filtrar os resultados onde o valor do campo contém um determinado padrão, ignorando maiúsculas e minúsculas
in('campo', [valor1, valor2, ...]) - para filtrar os resultados onde o valor do campo está em uma lista de valores específicos
order('campo', { ascending: true }) - para ordenar os resultados com base em um campo específico, em ordem crescente
limit(n) - para limitar o número de resultados retornados a n
*/

async function atualizarAutor(id) {
    let name = prompt('Digite o novo nome: ')
    let nacionalidade = prompt('Digite a nova nacionalidade: ')
    let atualizacao = {
        name: name,
        nacionalidade: nacionalidade
    }

    const { data, error } = await supabase.from('biblioteca_autores').update(atualizacao).eq('id', id).select()
    if (error) {
        console.error('Erro ao atualizar o autor:', error)
        return
    }

    console.log(data)
    console.log(error)
}
// atualizarAutor()

// --------------------------------------------------------------------------------------------------------------------------------

async function cadastrarUsuario() {
    let name = prompt('Digite o nome: ')
    let cpf = prompt('Digite o CPF: ')
    let phone = prompt('Digite o telefone: ')
    let endereço = prompt('Digite o endereço: ')
    let tipo = prompt('Digite o tipo de usuário: ')
    let senha = prompt('Digite a senha: ')

    const saltRounds = 10
    const senhaCrip = await bcrypt.hash(senha, saltRounds)
    let novoUsuario = {
        name:name,
        cpf: cpf,
        phone: phone,
        endereço: endereço,
        tipo: tipo,
        senha: senhaCrip
    }
    const {data, error} = await supabase.from('biblioteca_usuarios').insert(novoUsuario).select()
    console.log(data)
    error ? console.log(error) : console.log('Dados inseridos com sucesso!')
    }

    async function logarSistema() {
        console.log('Faça login para acessar o sistema')
        console.log ('-----------------------------')
        const cpf = prompt('Digite o CPF: ')
        const senha = prompt('Digite a senha: ')

        const {data, error} = await supabase.from('biblioteca_usuarios').select('*').eq('cpf', cpf)
        if (error) {
            console.log('Erro ao buscar o usuário:', error)
            return
        }
    
        if (data.length > 0) {
            console.log(data[0].senha)
            const senhaCorreta = await bcrypt.compare(senha, data[0].senha)
            if (senhaCorreta) {
                return data[0]
            } else {  
                console.log('CPF não encontrado')
                return false
            }
        }
    }

    async function menu() {
        console.log('=========== MENU ===========')
        console.log('1 - Cadastrar Usuário')
        console.log('2 - Logar no Sistema')

        console.log('0 - sair')
        let opcao = prompt('Digite a opção desejada: ')

        while (opcao != '0'){
        switch (opcao) {    
            case '1':
                await cadastrarUsuario()
                break
            case '2':
                let usuario = await logarSistema()
                if (usuario) {
                    console.log('Usuário Logado')
                    console.log(`Seja bem-vindo, ${usuario.name}!`)

                    if(usuario.tipo === 'cliente') {
                        console.log('===== MENU DO CLIENTE =====')
                        console.log('1 - Listar Livros')
                        console.log('0 - Sair')
                        let opcaoCliente = prompt('Escolha uma opção: ')
                        while (opcaoCliente != '0') {
                            switch (opcaoCliente) {
                                case '1':
                                    await listarLivros()
                                    break;
                                default:
                                    break;
                            }
                            console.log('====== MENU ======')
                            console.log('1 - Listar Livros')
                            console.log('0 - Sair')
                            opcaoCliente = prompt('Escolha uma opção: ')
                        }
                        
                    }else if(usuario.tipo == 'funcionario'){
                        console.log('É funcionario')
                        console.log('===== MENU DO FUNCIONÁRIO =====')
                        console.log('1 - Cadastrar Livro')
                        console.log('2 - Listar Livros')
                        console.log('0 - Sair')
                        let opcaoCliente = prompt('Escolha uma opção: ')
                    }
                }
                break;
            
            default:
                break;
        }
        console.log('====== MENU ======')
        console.log('1 - Cadastrar Usuário')
        console.log('2 - Logar no sistema')
        console.log('0 - Sair')
        opcao = prompt('Escolha uma opção: ')
    }
}
// menu()


app.listen(3000, () => {
    console.log('Olá Mundo!')
})
