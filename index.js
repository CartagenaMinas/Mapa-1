const url ="https://apiflaskdemo.herokuapp.com/predict"

// Puedes usar una url local durante el desarrollo para asegurarte que todo funciona bien
//const url = 'http://127.0.0.1:5000/predict'

// esperar a que se cargue el contenido de la app
document.addEventListener('DOMContentLoaded', function () {

    // instanciar el mapa con coordenadas y zoom inicial
    const map = L.map('map', {
        preferCanvas: true
    }).setView([41.39, 2.15], 17);

    // assignar capa al mapa con imágenes aéreas de google maps
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    // asignar acciones al botón
    const btn = document.getElementById('btn')
    btn.addEventListener('click', function () {

        // cambiar el texto y deshabilitar el botón para evitar llamadas concurrentes
        btn.innerText = 'Cargando ...'
        btn.disabled = true

        // convertir el mapa a imagen 
        return leafletImage(map, function (err, canvas) {

            // generamos una imagen con el mapa
            var img = new Image();
            img.src = canvas.toDataURL();

            // cuando la imagen ha sido cargada, cortamos el centro y lo enviamos a la API
            img.onload = function () {

                // cortamos el centro al tamaño deseado (224 x 224)
                crop_canvas = document.getElementById('crop_canvas');
                const w = crop_canvas.width
                const h = crop_canvas.height
                const sx = (canvas.width - w) / 2
                const sy = (canvas.height - h) / 2
                crop_canvas.getContext('2d').drawImage(img, sx, sy, w, h, 0, 0, w, h);

                // enviamos la imagen a la API 
                return crop_canvas.toBlob(function (blob) {
                    const formData = new FormData()
                    formData.append('file', blob)
                    return fetch(url, {
                        method: 'post',
                        body: formData
                    })
                        // recibimos la respuesta y la pintamos en la app
                        .then(res => res.json())
                        .then(res => {
                            const panel = document.getElementById('resultado')
                            panel.innerText = res.label

                            // habilitamos de nuevo el botón
                            btn.innerText = 'Clasifica'
                            btn.disabled = false
                        })
                })
            }
        })
    })
})