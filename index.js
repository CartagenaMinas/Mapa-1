const url ="https://apiflaskdemo.herokuapp.com/predict"


document.addEventListener('DOMContentLoaded',function(){
    var mapa = L.map('mapa').setView([41.39, 2.15], 17);

    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom:20,
        subdomains: ['mt0','mt1','mt2','mt3'],
    }).addTo(mapa);


    const btn=document.getElementById("btn")
    btn.addEventListener('click',function(){
        btn.innerText="Cargando..."
        btn.disabled=true

        leafletImage(mapa, function(err, canvas) {
            const img = new Image();
            img.src = canvas.toDataURL();
            img.onload=function(){
                crop_canvas=document.getElementById('crop_canvas')
                const w = crop_canvas.width
                const h = crop_canvas.height
                const sx=(canvas.width-w)/2
                const sy=(canvas.height -h)/2
                crop_canvas.getContext('2d').drawImage(
                    img,
                    sx,
                    sy,
                    w,
                    h,
                    0,
                    0,
                    w,
                    h
                )

                //enviamos la imagen a la API
                return crop_canvas.toBlod(function (blob){
                    const formData=new FormData()
                    formData.append("file", blob)
                    return fetch(url,{
                        method:'post',
                        body:formData
                    })
                        //Recibimos la respuesta y la pintamos en la app
                        .then(res=>res.json())
                        .then(res=>{
                            const panel=document.getElementById('resultado')
                            panel.innerText=res.label

                            //Habilitamos de nuevo el boton
                            btn.innerText="Clasifica"
                            btn.disabled=false
                        })
                })


            }
        });
    })
})