/* eslint-disable require-atomic-updates */
/* eslint-disable no-constant-condition */
require('dotenv').config()
// const url = process.env.DELUGE_URL // eslint-disable-line
// const password = process.env.DELUGE_PASS // eslint-disable-line

const axios = require('axios')
let cookie = 'default_cookie'
const delugeApi = {
    // cookie: '',
    delugeMethod: async (url, method, params, id, password) => {
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
                // "Cookie": delugeApi.cookie
            }
        }
        const isValid = await delugeApi.sessionValid(url, config, id)
        console.log('####### default cookie:', cookie)
        cookie = cookie + 1
        console.log('####### new default cookie:', cookie)
        if (!isValid) {
            console.log('getting cookie---------- cookie valid: ', isValid)
            cookie = await delugeApi.getCookie(url, password, id)
            config.headers["Cookie"] = cookie
            // console.log('returned cookie', cookie)
        }
        else {
            console.log('valid cookie------------', isValid)
        }


        // do method with options
        return await axios.post(url, body, config)
            .then(async res => {
                return res.data.result ? res.data : {
                    error: res.data.error
                }
            })
            .catch(err => {
                return {
                    error: err
                }
            })
    },
    getCookie: async (url, password, id) => {
        console.log('getting cookie with password -', url, password, id)
        const config = {
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
            }
        }
        const body = {
            method: 'auth.login',
            params: [password],
            id
        }
        let cookie = await axios.post(url, body, config)
            .then(res => {
                delugeApi.cookie = res.headers['set-cookie'][0].split(';')[0]
                return delugeApi.cookie
            })
            .catch(err => {
                console.log("error logging in: ", err)
                return false
            })
        // console.log(res)
        return cookie
    },
    sessionValid: async (url, config, id) => {
        const body = {
            method: "auth.check_session",
            params: [],
            id
        }
        console.log('current cookie -------------', delugeApi.cookie)
        config.headers["Cookie"] = delugeApi.cookie
        return await axios.post(url, body, config)
            .then(res => {
                return res.data.result
            })
            .catch(err => {
                console.log('---aaaa---', err)
                return false
            })
    },
    // auth__login: (url, password, id) => {
    //     id = !id ? 0 : id
    //     return delugeApi.delugeMethod(url, 'auth.login', [password], id)
    // },
    // system__listMethods: (url, password, id) => {
    //     id = !id ? 0 : id
    //     return delugeApi.delugeMethod(url, 'system.listMethods', [password], id).then(res => {
    //         return res.result
    //     })
    // },
    // listMethods: async (url, password, id) => {
    //     id = !id ? 0 : id
    //     let list = await delugeApi.system__listMethods(url, password, id)
    //     // console.log(list)
    //     return list.map(method => {
    //         return method
    //     })
    //     // return list
    // }
}


module.exports = delugeApi

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
