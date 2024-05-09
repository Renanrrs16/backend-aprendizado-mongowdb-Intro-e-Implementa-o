const express = require('express')
const { MongoClient } = require('mongodb')

// Preparamos as informacoes ao banco de dados
const dburl = 'mongodb+srv://admin:21213625A1@cluster0.gg04xsm.mongodb.net'
const dbname = 'mongodb-intro-e-implementacao'

// Declaramos a funcao main()
async function main() {
    // Realizamos a conexao com o banco de dados
    const client = new MongoClient(dburl)
    console.log('conectando ao banco de dados...')
    await client.connect()
    console.log('Banco de dados conectado com sucesso!.')

    const db = client.db(dbname)
    const collection = db.collection('personagem')

    const app = express()

    app.get('/', function (req, res) {
        res.send('Hello World!')
    })

    const lista = ['Java', 'Kotlin', 'Android']
    // idicies       0        1         2

    //Endpoint Read all [GET] /personagem
    app.get('/personagem', function (req, res) {
        res.send(lista.filter(Boolean))
    })

    //Endpoint Read By ID [GET] /personagem/:id
    app.get('/personagem/:id', function (req, res) {
        // Acessamos o parametro de Rota ID
        const id = req.params.id

        // Acessa o item na lista usando o ID - 1
        const item = lista[id - 1]

        // Checamos se o item obtido e existente
        if (!item) {
            return res.status(404).send('Item não encontrado.')
        }

        // Enviamos o item como resposta
        res.send(item)
    })

    //Sinaliza para o Express que estamos usando JSON no Body
    app.use(express.json())

    // Endpoint Create [POST] /personagem
    app.post('/personagem', function (req, res) {
        // Acessamos o body da Requisição
        const body = req.body

        // Aceitamos a Propriedade 'nome' no body
        const novoitem = body.nome

        // Checar se o nome esta presente no body
        if (!novoitem) {
            return res.status(400).send('Corpo da requisicao deve conter as propriedade `nome`.')
        }

        // Checa se o novoitem esta na lista ou nao
        if (lista.includes(novoitem)) {
            return res.status(409).send('Item ja existe na lista')
        }

        // Adicionamos na lista
        lista.push(novoitem)

        // Exibimos a mensagem com sucesso
        res.status(201).send('Item Adicionado com sucesso: ' + novoitem)
    })

    // Endpoint Update [PUT] /personagem/:id
    app.put('/personagem/:id', function (req, res) {
        const id = req.params.id

        // Checamos se o item do ID - 1 esta a lista, exibindo
        // uma mensagem caso nao esteja
        if (!lista[id - 1]) {
            return res.status(404).send('Item não encontrado.')
        }

        // Acessamos o Body da requisição
        const body = req.body

        // Acessamos a propriedade 'nome' do body
        const novoitem = body.nome

        // Checar se o nome esta presente no body
        if (!novoitem) {
            return res.status(400).send('Corpo da requisicao deve conter as propriedade `nome`.')
        }

        // Checa se o novoitem esta na lista ou nao
        if (lista.includes(novoitem)) {
            return res.status(409).send('Item ja existe na lista')
        }

        // Atualizamos na lista o novoitem pelo ID - 1
        lista[id - 1] = novoitem

        // Envia uma mesagem de sucesso
        res.send('Item atualizado com sucesso: ' + id + ' - ' + novoitem)
    })

    // Endpoint Delete [DELETE] /personagem/:id
    app.delete('/personagem/:id', function (req, res) {

        // Acessamos o parametro de rota
        const id = req.params.id

        // Checamos se o item do ID - 1 esta a lista, exibindo
        // uma mensagem caso nao esteja
        if (!lista[id - 1]) {
            return res.status(404).send('Item não encontrado.')
        }

        // Remover o item da lista usando ID - 1
        delete lista[id - 1]

        // Enviamos uma mensagem de sucesso
        res.send('Item deletado com sucesso: ' + id)
    })

    app.listen(5000, function () {
        console.log('Aplicação rodando em http://localhost:3000')
    })
}

// Executamos a funcao main()
main()