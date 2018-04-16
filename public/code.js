
let parent

document.addEventListener('DOMContentLoaded', () => {

    const socket = io();
    const watcher = new Watcher(5)

    parent = document.querySelector('#table-body')


    get('http://localhost:8000/api/history/10').then(response => {

        for (let item of response) {
            watcher.push(item, (data) => {
                buildTable(data)
            })
        }


        socket.on('call', (response) => {
            delete response['_id']
            delete response['__v']
            watcher.push(response, data => { 
        
                
                buildTable(data) 
                let audio  = new Audio('./sound/notification.mp3')
                audio.play()
            })
        })
    })


})



function post(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            body
                : JSON.stringify(data)
        })
            .then(data => data.json())
            .catch(err => reject(err))
            .then(data => resolve(data))

    })
}


function get(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(data => data.json())
            .catch(err => reject(err))
            .then(data => resolve(data))

    })
}


function buildTable(data) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild)
    }



    for (let element of data) {
        const tr = document.createElement('tr')

        for (let [key, value] of Object.entries(element)) {
            let td = document.createElement('td')
            td.innerHTML = value
            tr.appendChild(td)
        }

        parent.appendChild(tr)
    }
}


class Watcher {
    constructor(max) {
        this.max = max
        this.data = []
    }

    push(data, callback) {

        if (this.data.length >= this.max) {
            this.pop()
        }

        this.data.unshift(data)
        callback(this.data)
        return this
    }

    pop(callback) {
        this.data.pop()
        return this
    }

    shift() {
        this.data.shift()
        return this
    }
}