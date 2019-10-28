/* eslint-disable require-atomic-updates */
'use strict';
require('dotenv').config()
const consola = require('consola')
const fs = require('fs')

const url = process.env.DELUGE_URL // eslint-disable-line
const password = process.env.DELUGE_PASS // eslint-disable-line
const {delugeApi} = require('../delugeApi')

const runTests = async (url, tests, password, cookie) => {
    console.log('\n')
    consola.info('Running delugeApi Tests')
    let testResults = []
    let id = 0
    await tests.forEach(async test => {
        // let cookieOrPassword = password
        // if (test.method === 'auth.login' && cookie) {
        //     console.log(cookie)
        //     // cookieOrPassword = cookie
        // }
        consola.info(`Testing Method - ${test.method}`)
        await delugeApi.delugeMethod(url, test.method, test.params, id, password, cookie).then(async res => {
            res.result !== null && !res.error ? await testResults.push(true) : await testResults.push(false)
            res.result !== null && !res.error ?
                consola.success(`Test Passed - ${test.method}`) :
                consola.error(`Test Failed - ${test.method}`)
        })
        if (tests.length === testResults.length) {
            !testResults.includes(false) ?
                consola.success('All Tests Passed') :
                consola.success(`${testResults.filter(x => x===true).length} Test${testResults.filter(x => x===true).length > 1 ? 's' : ''} Passed`)
            if (testResults.includes(false)) {
                consola.error(`${testResults.filter(x => x===false).length} Test${testResults.filter(x => x===false).length > 1 ? 's' : ''} Failed`)

            }
        }
    })
}
module.exports = runTests

// remove comments from test.json && copy to testsCleaned.json .then run tests on forEach method in 'testCleaned.json'
const testJson = fs.readFileSync('./test/test.json', 'utf8')
const withoutComments = testJson.toString().split('\n').filter(line => {
    return !line.includes(` // `)
})
let data = withoutComments.join('\n').replace(/\n\s*\n/g, '\n')
fs.writeFile('./test/testCleaned.json', data, (err) => {
    if (err) {
        throw err
    }
    const tests = JSON.parse(fs.readFileSync('test/testCleaned.json', 'utf8'))
    setTimeout(async () => {
        let cookie = await delugeApi.login(url, password, 0)
        await runTests(url, tests, password, cookie)
        // console.log('cookie--', cookie)
    }, 2000)
})


