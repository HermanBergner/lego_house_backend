document.addEventListener('DOMContentLoaded', () => {



    get('http://localhost:8000/api/ping/3c0026001047343438323536').then(res => console.log(res))


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