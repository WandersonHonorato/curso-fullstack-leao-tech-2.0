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

app.post('/login', async (req,res))  => {
    const cpf 
}






const token =jwt.sign(
    {
        id:usuario.id,
        name: usuario.nome
        tipo: usuario.tipo
    },JWT_SENHA,
    usuario {
        usario.id

    }
)



 app.get('/listarlivros/:id', (req, res) => {
    const id = req.params.id
    console.log(id)

    const {data, error} = await supabase.from('biblioteca_livro').select('*')

    if (error) {
        console.log(error)
        res.json({error: 'Erro ao listar os livros'})
        return
    }

    console.log('Deu tudo certo!', data)
    res.json({data})
})

app.post('/cadastrarusuario', async (req, res) => {
    const { name, password, cpf, phone, endereço, tipo } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase.from('biblioteca_usuario').insert([
        {
            name,
            cpf,
            phone,
            endereço,
            tipo,
            password: hashedPassword

        }
    ])

    if (error) {
        console.log(error)
        res.json({error: 'Erro ao cadastrar usuário'})
        return
    }

    console.log('Usuário cadastrado com sucesso!', data)
    res.json({data})
})



app.listen(3000, () => {
    console.log('Olá Mundo! Acessar http://localhost:3000')
})
