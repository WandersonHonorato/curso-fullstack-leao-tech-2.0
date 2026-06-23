// npm init -y
// npm install prompt-sync
// npm install @supabase/supabase-js
// npm install dotenv
// npm install express
// npm install bcrypt
// npm install jsonwebtoken
// npm install cors

//Extensão Thunder Client usada para fazer requisições

const prompt = require('prompt-sync')()
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
require('dotenv').config()

const express = require('express')
const app = express()
app.use(cors())
app.use(express.json())


const jwt = require('jsonwebtoken')
const JWT_SENHA=process.env.JWT_SENHA

const cors =require('cors')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.get('/listarlivros',autenticarToken,async (req,res) => {
    // const chaveRecebida = req.headers['api-key']
    // console.log(chaveRecebida)
    // if(chaveRecebida != API_KEY){
    //     return res.status(401).json({
    //         "erro":"Chave API errada"
    //     })
    // }

    const {data, error} = await supabase.from('biblioteca_livro').select('*')
    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})
app.get('/listarlivros/:id/:genero',autenticarToken, async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    const id = req.params.id
    const genero = req.params.genero
    console.log(id)
    console.log(genero)
    const {data, error} = await supabase.from('biblioteca_livro').select('*').eq('id',id)
    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.get('/buscarlivro', async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    console.log(req.query)
    const titulo = req.query.titulo
    const ano = req.query.ano
    const autor = req.query.autor
    const {data, error} = await supabase.from('biblioteca_livro').select('*').or(`titulo.ilike.%${titulo}%`,`autor.ilike.%${autor}%`,`ano.ilike.%${ano}%`)

    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.post('/cadastrarlivro', async(req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    console.log(req.body)
    const {data, error} = await supabase.from('biblioteca_livro').insert(req.body).select()

    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.put('/atualizarlivro/:id_livro', async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    const id_livro = req.params.id_livro
    const atualizacoes = req.body
    console.log(atualizacoes)
    const {data, error} = await supabase.from('biblioteca_livro').update(atualizacoes).eq('id',id_livro).select()

    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.delete('/deletarlivro/:id_livro', async (req,res) => {

    const chaveRecebida = req.headers['api-key']
    console.log(chaveRecebida)
    if(chaveRecebida != API_KEY){
        return res.status(401).json({
            "erro":"Chave API errada"
        })
    }

    const id_livro = req.params.id_livro
    const {data, error} = await supabase.from('biblioteca_livro').delete().eq('id',id_livro).select()
    if (error){
        console.log(error)
        res.json(error)
        return
    }
    console.log('Deu tudo certo!!',data)
    res.json(data)
})

app.post('/login', async (req,res) => {
    const cpf = req.body.cpf
    const senha = req.body.senha
    const {data, error} = await supabase.from('biblioteca_usuarios').select('*').eq('cpf',cpf)
    if(error){
        return res.status(401).json({
            "mensagem":`erro ${error}`
        })
    }
    if (data.length == 0){
        return res.json({
            "erro":"CPF não foi encontrado"
        })
    }
    const usuario = data[0]
    const senhaCorreta = await bcrypt.compare(senha,usuario.senha)
    if(senhaCorreta == false){
        return res.json({
            erro:'Senha incorreta'
        })
    }

    const token = jwt.sign(
        {
            id:usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
        },JWT_SENHA,
        {
            expiresIn:'1h'
        }
    )

    return res.json({
        mensagem: 'Login realizado com sucesso!',
        token: token,
        usuario:{
            id:usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
        }
    })

})

function autenticarToken(req, res, next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.json({
            erro:'Token não enviado'
        })
    }
    const token = authHeader.split(' ')[1]
    try{
        const usuario = jwt.verify(token,JWT_SENHA)
        req.usuario = usuario
        console.log(usuario)
        next()
    }catch{
        return res.json({
            erro:'Token inválido'
        })
    }
}

app.listen(3000, () => {
    console.log('Acesse o sistema em: http://localhost:3000')
})