const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const {
    delugeApi
} = require('./delugeApi')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    const routes = [
        'USAGE: /path POST - options in {body}',
        '/login  {url, password} --- returns token(str)',
        '/check_session  {token} --- returns true|false',
        '/list_methods {url} --- returns [methods]',
        '/deluge_method {url, method, params, id, password, token}',
        'see tests/test.json for example req.body for each method'        
    ]
    res.json(routes)
})


let id = ''
app.post('/login', async (req, res) => {
    (id === 0 || id > 10) ? id = 0: id = ++id
    const url = req.body.url
    const password = req.body.password
    let token = await delugeApi.login(url, password, id)
    if (!token) {
        res.json({
            error: 'invalid url or password'
        })
    }
    res.json({
        id,
        token: token.replace('_session_id=', '')
    })
})

app.post('/check_session', async (req, res) => {
    (id === 0 || id > 10) ? id = 0: id = ++id
    const url = req.body.url
    if (!req.body.token) {
        res.json({
            error: 'invalid cookie, login first'
        })
    }
    const token = '_session_id=' + req.body.token
    const valid = await delugeApi.sessionValid(url, token, id)
    res.json({
        valid
    })
})

app.post('/list_methods', async (req, res) => {
    (id === 0 || id > 10) ? id = 0: id = ++id
    const url = req.body.url
    if (!req.body.url) {
        res.json({
            error: 'invalid url or not provided'
        })
    }
    const methodList = await delugeApi.delugeMethod(url, 'system.listMethods', [], 1).then(res => {
        return res
    })
    res.json(methodList)
})

app.post('/deluge_method', async (req, res) => {
    (id === 0 || id > 10) ? id = 0: id = ++id
    const url = req.body.url
    const method = req.body.method
    const params = req.body.params
    const cookie = '_session_id=' + req.body.token
    const password = req.body.password || ''
    if (!url || !method) {
        res.json({
            error: 'invalid url or not provided'
        })
    }
    if (!method) {
        res.json({
            error: 'Method not provided'
        })
    }
    const result = await delugeApi.delugeMethod(url, method, params, id, password, cookie).then(res => {
        return res
    })
    console.log(result)
    res.json(result)
})

app.listen(port, () => console.log(`App listening on http://localhost:${port}`))
