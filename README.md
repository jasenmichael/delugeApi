## another Deluge Api

### this solves the limitations and issues(IMHO) of the current Deluge WebApi

##### I found issues with cors and headers from the browser while trying to access Deluge webApi - hosting deluge in a docker container, on my nas

##### Solution, a simple proxy using Node and Axios - that exposes all Deluge webApi methods.

to use 
```js
const delugeApi = require('delugeApi')

// use with
// delugeMethod(url, method, params, id, password, cookie)

const url = 'http://localhost:8112/json'
const password = 'deluge'
let id = 0

let cookie = delugeApi.getCookie(url, password, id)
    .then(cookie => {
        // retun cookie or do another method using cookie
        console.log('use me in header for requests:', cookie)
        return cookie
    }).catch(err => {
        console.error(err)
    })


// get list of deluge webapi plugin methods
setTimeout(() => {
    delugeApi.listMethods(url).then(methodList => {
        console.log(methodList)
    })
}, 5000);

// then use a method
// see test.json for exapmple params and methods, The webApi documentation is lacking, so using the actual "Deluge WebUi" and used the browser dev tools
// I could watch network traffic. There I could see request body for each request, so I just went through the actions, add, pause, start, remove, etc..
let method = "web.update_ui"
let params = [
    ["queue", "name", "total_wanted", "state", "progress", "num_seeds", "total_seeds", "num_peers", "total_peers", "download_payload_rate", "upload_payload_rate", "eta", "ratio", "distributed_copies", "is_auto_managed", "time_added", "tracker_host", "save_path", "total_done", "total_uploaded", "max_download_speed", "max_upload_speed", "seeds_peers_ratio", "label"], {}
]

// store your cookie how ever you like once and reuse, using setTimeout here just for simple example.
setTimeout(() => {
    delugeApi.delugeMethod(url, method, params, id, password, '_session_id=6ec707e1dab55d2044e21b57740f8f812191').then(res => {
        console.log(res)
    })
}, 200)
```


