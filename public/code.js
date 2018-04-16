document.addEventListener('DOMContentLoaded', () => {
    const socket = io()


    const body = document.querySelector('#table-body')
    socket.on('history', (data) => {

        while (body.hasChildNodes()) {
            body.removeChild(body.lastChild)
        }
        
        data = JSON.parse(data)
        data.forEach(element => {
            delete element['_id']
            delete element['__v']

            const tr = document.createElement('tr')
            for (let [key, value] of Object.entries(element)) {
                const td = document.createElement('td')
                td.innerHTML = value;
                tr.appendChild(td)
            }
            body.appendChild(tr)

        });
    })
})
