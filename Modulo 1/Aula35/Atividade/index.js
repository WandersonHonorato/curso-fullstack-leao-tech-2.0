import { createClient } from '@supabase/supabase-js'
import readline from 'readline'
import 'dotenv/config'


const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ----- INPUT ---------------------------------------------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const perguntar = (msg) => new Promise((resolve) => rl.question(msg, resolve))

const linha = () => console.log('─'.repeat(40))
const titulo = (t) => { console.log('\n' + '═'.repeat(40)); console.log(`${t}`); console.log('═'.repeat(40)) }
const ok = (msg) => console.log(`\n ${msg}`)
const erro = (msg) => console.log(`\n Erro: ${msg}`)

// --------------------------------------------------------------
// CLIENTES
// --------------------------------------------------------------

async function cadastrarCliente() {
  titulo('CADASTRAR CLIENTE')
  const nome = await perguntar('Nome: ')
  const cpf = await perguntar('CPF: ')
  const email = await perguntar('E-mail: ')
  const telefone = await perguntar('Telefone: ')

  const { data, error } = await supabase.from('banco_clientes')
  .insert([{ nome, cpf, email, telefone, status_ativo: true }]).select()

  if (error) return erro(error.message)
  ok(`Cliente "${data[0].nome}" cadastrado com sucesso!`)
}

async function listarClientes() {
  titulo('LISTA DE CLIENTES')

  const { data, error } = await supabase.from('banco_clientes').select('*').order('nome', {ascending: true})

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhum cliente cadastrado.')

  data.forEach((c, i) => {
    linha()
    console.log(`#${i + 1} | ${c.nome}`)
    console.log(`   CPF: ${c.cpf} | Tel: ${c.telefone}`)
    console.log(`   E-mail: ${c.email}`)
    console.log(`   Status: ${c.status_ativo ? ' Ativo' : ' Inativo'}`)
  })
  linha()
}

async function buscarCliente() {
  titulo('BUSCAR CLIENTE')
  const nome = await perguntar('Nome (ou parte do nome): ')

  const {data, error} = await supabase
    .from('banco_clientes')
    .select('*')
    .ilike('nome', `%${nome}%`)

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhum cliente encontrado.')

  data.forEach((c) => {
    linha()
    console.log(`ID: ${c.id}`)
    console.log(`Nome: ${c.nome} | CPF: ${c.cpf}`)
    console.log(`E-mail: ${c.email} | Tel: ${c.telefone}`)
    console.log(`Status: ${c.status_ativo ? 'Ativo' : 'Inativo'}`)
  })
  linha()
}

async function atualizarCliente() {
  titulo('ATUALIZAR CLIENTE')
  await listarClientes()

  const id = await perguntar('\nID do cliente a atualizar: ')
  const nome = await perguntar('Novo nome (Enter para manter): ')
  const email = await perguntar('Novo e-mail (Enter para manter): ')
  const tel = await perguntar('Novo telefone (Enter para manter): ')
  const ativo = await perguntar('Status ativo? (s/n, Enter para manter): ')

  const updates = {}
  if (nome) updates.nome = nome
  if (email) updates.email = email
  if (tel) updates.telefone = tel
  if (ativo) updates.status_ativo = ativo.toLowerCase() === 's'

  const { error } = await supabase.from('banco_clientes').update(updates).eq('id', id)

  if (error) return erro(error.message)
  ok('Cliente atualizado com sucesso!')
}

async function deletarCliente() {
  titulo('DELETAR CLIENTE')
  await listarClientes()

  const id = await perguntar('\nID do cliente a deletar: ')
  const confirmacao = await perguntar(`Confirma exclusão? (s/n): `)
  if (confirmacao.toLowerCase() !== 's') return console.log('\nOperação cancelada.')

  const { error } = await supabase.from('banco_clientes').delete().eq('id', id)

  if (error) return erro(error.message)
  ok('Cliente deletado com sucesso!')
}

// --------------------------------------------------------------
// CONTAS
// --------------------------------------------------------------

async function cadastrarConta() {
  titulo('CADASTRAR CONTA BANCÁRIA')
  await listarClientes()

  const cliente_id = await perguntar('\nID do cliente: ')
  const numero_conta = await perguntar('Número da conta: ')
  const agencia = await perguntar('Agência: ')
  const tipo_conta = await perguntar('Tipo (corrente/poupança): ')
  const saldo = await perguntar('Saldo inicial: ')

  const { data, error } = await supabase.from('banco_contas')
    .insert([{ cliente_id, numero_conta, agencia, tipo_conta, saldo: parseFloat(saldo) }]).select()

  if (error) return erro(error.message)
  ok(`Conta ${data[0].numero_conta} cadastrada com sucesso!`)
}

async function listarContas() {
  titulo('LISTA DE CONTAS')

  const { data, error } = await supabase.from('banco_contas').select(`*,banco_clientes ( nome, cpf )`)
  .order('numero_conta', { ascending: true })

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhuma conta cadastrada.')

  data.forEach((c, i) => {
    linha()
    console.log(`#${i + 1} | Conta: ${c.numero_conta} | Agência: ${c.agencia}`)
    console.log(`Tipo: ${c.tipo_conta} | Saldo: R$ ${Number(c.saldo).toFixed(2)}`)
    console.log(`Cliente: ${c.banco_clientes?.nome} (CPF: ${c.banco_clientes?.cpf})`)
    console.log(`Abertura: ${new Date(c.data_abertura).toLocaleDateString('pt-BR')}`)
  })
  linha()
}

// --------------------------------------------------------------
// TRANSAÇÕES
// --------------------------------------------------------------

async function registrarTransacao() {
  titulo('REGISTRAR TRANSAÇÃO')
  await listarContas()

  const conta_id = await perguntar('\nID da conta: ')
  const tipo_transacao = await perguntar('Tipo (depósito/saque/transferência/pix): ')
  const valor = await perguntar('Valor: R$ ')
  const descricao = await perguntar('Descrição: ')

  const { data, error } = await supabase
    .from('banco_transacoes')
    .insert([{ conta_id, tipo_transacao, valor: parseFloat(valor), descricao }])
    .select()

  if (error) return erro(error.message)
  ok(`Transação registrada! Valor: R$ ${Number(data[0].valor).toFixed(2)}`)
}

async function listarTransacoes() {
  titulo('LISTA DE TRANSAÇÕES')

  const { data, error } = await supabase.from('banco_transacoes').select(`*,banco_contas( numero_conta, agencia )`)
    .order('data_transacao', { ascending: false })
    .limit(20)

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhuma transação registrada.')

  data.forEach((t, i) => {
    linha()
    console.log(`#${i + 1} | ${t.tipo_transacao.toUpperCase()} | R$ ${Number(t.valor).toFixed(2)}`)
    console.log(`   Conta: ${t.banco_contas?.numero_conta} | Ag: ${t.banco_contas?.agencia}`)
    console.log(`   Descrição: ${t.descricao || '-'}`)
    console.log(`   Data: ${new Date(t.data_transacao).toLocaleString('pt-BR')}`)
  })
  linha()
  console.log('(Exibindo últimas 20 transações)')
}

async function buscarTransacaoPorTipo() {
  titulo('BUSCAR TRANSAÇÃO POR TIPO')
  const tipo = await perguntar('Tipo (depósito/saque/transferência/pix): ')

  const { data, error } = await supabase.from('banco_transacoes').select('*, banco_contas ( numero_conta )')
    .eq('tipo_transacao', tipo)
    .order('data_transacao', { ascending: false })

  if (error) return erro(error.message)
  if (!data.length) return console.log(`\nNenhuma transação do tipo "${tipo}" encontrada.`)

  console.log(`\n📋 ${data.length} transação(ões) encontrada(s):`)
  data.forEach((t) => {
    linha()
    console.log(`Conta: ${t.banco_contas?.numero_conta} | R$ ${Number(t.valor).toFixed(2)}`)
    console.log(`Descrição: ${t.descricao || '-'} | Data: ${new Date(t.data_transacao).toLocaleString('pt-BR')}`)
  })
  linha()
}

async function buscarTransacaoPorValor() {
  titulo('BUSCAR TRANSAÇÃO POR VALOR')
  const minimo = await perguntar('Valor mínimo: R$ ')
  const maximo = await perguntar('Valor máximo: R$ ')

  const { data, error } = await supabase.from('banco_transacoes').select('*, banco_contas ( numero_conta )').gte('valor', parseFloat(minimo))
    .lte('valor', parseFloat(maximo))
    .order('valor', { ascending: false })

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhuma transação encontrada nessa faixa de valor.')

  console.log(`\n ${data.length} transação(ões) encontrada(s):`)
  data.forEach((t) => {
    linha()
    console.log(`${t.tipo_transacao.toUpperCase()} | R$ ${Number(t.valor).toFixed(2)}`)
    console.log(`Conta: ${t.banco_contas?.numero_conta} | ${t.descricao || '-'}`)
  })
  linha()
}

// --------------------------------------------------------------
// SERVIÇOS
// --------------------------------------------------------------

async function cadastrarServico() {
  titulo('CADASTRAR SERVIÇO')
  const nome_servico = await perguntar('Nome do serviço: ')
  const descricao = await perguntar('Descrição: ')
  const taxa_mensal = await perguntar('Taxa mensal: R$ ')

  const { data, error } = await supabase.from('banco_servicos')
    .insert([{ nome_servico, descricao, taxa_mensal: parseFloat(taxa_mensal), status_ativo: true }]).select()

  if (error) return erro(error.message)
  ok(`Serviço "${data[0].nome_servico}" cadastrado! Taxa: R$ ${Number(data[0].taxa_mensal).toFixed(2)}/mês`)
}

async function listarServicos() {
  titulo('LISTA DE SERVIÇOS')

  const { data, error } = await supabase
    .from('banco_servicos')
    .select('*')
    .eq('status_ativo', true)
    .order('nome_servico', { ascending: true })

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhum serviço cadastrado.')

  data.forEach((s, i) => {
    linha()
    console.log(`#${i + 1} | ID: ${s.id}`)
    console.log(`   Serviço: ${s.nome_servico}`)
    console.log(`   Descrição: ${s.descricao}`)
    console.log(`   Taxa mensal: R$ ${Number(s.taxa_mensal).toFixed(2)}`)
  })
  linha()
}

async function contratarServico() {
  titulo('CONTRATAR SERVIÇO')
  await listarClientes()
  const cliente_id = await perguntar('\nID do cliente: ')

  await listarServicos()
  const servico_id = await perguntar('\nID do serviço: ')
  const observacao = await perguntar('Observação (opcional): ')

  const { data, error } = await supabase
    .from('banco_contratacoes')
    .insert([{ cliente_id, servico_id, status_contratacao: 'ativo', observacao }])
    .select()

  if (error) return erro(error.message)
  ok('Serviço contratado com sucesso!')
}

async function listarServicosContratados() {
  titulo('SERVIÇOS CONTRATADOS')

  const { data, error } = await supabase.from('banco_contratacoes').select(`*,banco_clientes ( nome ),banco_servicos ( nome_servico, taxa_mensal )`)
    .order('data_contratacao', { ascending: false })

  if (error) return erro(error.message)
  if (!data.length) return console.log('\nNenhum serviço contratado.')

  data.forEach((c, i) => {
    linha()
    console.log(`#${i + 1} | ${c.banco_servicos?.nome_servico}`)
    console.log(`   Cliente: ${c.banco_clientes?.nome}`)
    console.log(`   Taxa: R$ ${Number(c.banco_servicos?.taxa_mensal).toFixed(2)}/mês`)
    console.log(`   Status: ${c.status_contratacao} | Data: ${new Date(c.data_contratacao).toLocaleDateString('pt-BR')}`)
    if (c.observacao) console.log(`   Obs: ${c.observacao}`)
  })
  linha()
}

// --------------------------------------------------------------
// MENU
// --------------------------------------------------------------

function exibirMenu() {
  console.log('\n')
  console.log('╔════════════════════════════════════════╗')
  console.log('║             SISTEMA BANCÁRIO           ║')
  console.log('╠════════════════════════════════════════╣')
  console.log('║                CLIENTES                ║')
  console.log('║   1 - Cadastrar cliente                ║')
  console.log('║   2 - Listar clientes                  ║')
  console.log('║   3 - Buscar cliente                   ║')
  console.log('║   4 - Atualizar cliente                ║')
  console.log('║   5 - Deletar cliente                  ║')
  console.log('╠════════════════════════════════════════╣')
  console.log('║                CONTAS                  ║')
  console.log('║   6 - Cadastrar conta                  ║')
  console.log('║   7 - Listar contas (com cliente)      ║')
  console.log('╠════════════════════════════════════════╣')
  console.log('║              TRANSAÇÕES                ║')
  console.log('║   8 - Registrar transação              ║')
  console.log('║   9 - Listar transações                ║')
  console.log('║  10 - Buscar por tipo                  ║')
  console.log('║  11 - Buscar por valor                 ║')
  console.log('╠════════════════════════════════════════╣')
  console.log('║                SERVIÇOS                ║')
  console.log('║  12 - Cadastrar serviço                ║')
  console.log('║  13 - Listar serviços                  ║')
  console.log('║  14 - Contratar serviço                ║')
  console.log('║  15 - Listar serviços contratados      ║')
  console.log('╠════════════════════════════════════════╣')
  console.log('║   0 - Sair                             ║')
  console.log('╚════════════════════════════════════════╝')
}

async function main() {
  console.log('\n Conectando ao banco de dados...')
  console.log(' Sistema Bancário iniciado!\n')

  while (true) {
    exibirMenu()
    const opcao = await perguntar('\nEscolha uma opção: ')

    switch (opcao.trim()) {
      case '1': await cadastrarCliente();
       break
      case '2': await listarClientes(); 
      break
      case '3': await buscarCliente();
       break
      case '4': await atualizarCliente(); 
      break
      case '5': await deletarCliente();
       break
      case '6': await cadastrarConta(); 
      break
      case '7': await listarContas(); 
      break
      case '8': await registrarTransacao();
       break
      case '9': await listarTransacoes();
       break
      case '10': await buscarTransacaoPorTipo(); 
      break
      case '11': await buscarTransacaoPorValor(); 
      break
      case '12': await cadastrarServico(); 
      break
      case '13': await listarServicos(); 
      break
      case '14': await contratarServico(); 
      break
      case '15': await listarServicosContratados(); 
      break
      case '0':
        console.log('\n Saindo do sistema. Até logo!\n')
        rl.close()
        process.exit(0)
      default:
        console.log('\n Opção inválida. Tente novamente.')
    }
  }
}

main()
