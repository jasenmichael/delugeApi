'use strict';
// const url = process.env.DELUGE_URL // eslint-disable-line
// const password = process.env.DELUGE_PASS // eslint-disable-line

const axios = require('axios')
const delugeApi = {
    delugeMethod: async (url, method, params, id, password, token) => {
        let cookie = token
        id = !id ? 0 : id
        const body = {
            method,
            params,
            id
        }
        axios.defaults.withCredentials = true
        const config = {
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                "Cookie": cookie || ''
            }
        }

        if (method !== 'system.listMethods' && method !== 'auth.login') {
            const isValid = await delugeApi.sessionValid(url, cookie, id)
            if (!isValid) {
                console.log('invalid cookie', isValid, cookie)
                cookie = await delugeApi.login(url, password, id)
            }
        }

        if (cookie) {
            config.headers["Cookie"] = cookie
        }

        // do method with options
        return await axios.post(url, body, config)
            .then(async res => {
                let data = res.data
                if (body.method === 'auth.login') {
                    let cookie = res.headers['set-cookie'][0].split(';')[0]
                    data.token = cookie.replace('_session_id=', '')
                }
                return res.data.result ? data : {
                    error: res.data.error
                }
            })
            .catch(err => {
                return {
                    error: err
                }
            })
    },
    login: async (url, password, id) => {
        const config = {
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                'Accept': "*/*",
                'Access-Control-Allow-Origin': '*',
                'X-Requested-With': 'XMLHttpRequest',
                'Pragma': 'no-cache',
                'Access-Control-Allow-Headers': '"Origin, X-Requested-With, Content-Type, Accept"'
            }
        }
        const body = {
            method: 'auth.login',
            params: [password],
            id
        }
        let cookie = await axios.post(url, body, config)
            .then(res => {
                return res.headers['set-cookie'][0].split(';')[0]
            })
            .catch(err => {
                console.log("error logging in: ", err)
                return false
            })
        return cookie
    },
    sessionValid: async (url, cookie, id) => {
        !id ? 0 : ++id
        const body = {
            method: "auth.check_session",
            params: [],
            id
        }
        const config = {
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
            }
        }
        config.headers["Cookie"] = cookie
        // console.log('check session with cookie-------', cookie)
        return await axios.post(url, body, config)
            .then(res => {
                return res.data.result
            })
            .catch(err => {
                console.log('ERROR', err)
                return false
            })
    },
    listMethods: async (url) => {
        // (url, method, params, id, password, cookie)
        const body = {
            "method": "system.listMethods",
            "params": [],
            "id": 0
        }
        return await delugeApi.delugeMethod(url, 'system.listMethods', [], 0).then(res => {
            console.log(res)
            return res
        })
        // console.log(list)
        // return list.map(method => {
        //     return method
        // })
        // return list
    }
}

module.exports = {
    delugeApi
}
// module.exports = delugeApi


/////////////////
// const url = process.env.DELUGE_URL // eslint-disable-line
// const password = process.env.DELUGE_PASS // eslint-disable-line
// const tests = [{
//         method: 'auth.login',
//         params: []
//     },
//     {
//         method: "system.listMethods",
//         params: [],
//     }
// ]

// dev and test area, run previous tests then test new features.
// const runTests = require('./test')
// runTests(url, tests, password).then(
//     // delugeApi.auth_login(url, password, 0).then(res => {
//     //     console.log(res)
//     // })
//     delugeApi.listMethods(url, password, 0).then(res => {
//         console.log(res)
//     })
// )

// delugeApi.system__listMethods(url, password, id).then(res => {
//     console.log(res)
// })
