export default {
    urlLaurel: location.origin.concat(location.pathname),
    urlApi: localStorage.getItem("url-api-php"),
    getUrlApi: function() {
        if (!this.urlApi) {
            Swal.fire({
                title: 'Ingresa la url de tu API',
                text: "Si la ingresas mal, borra 'url-api-php' del localStorage.",
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                confirmButtonText: 'Almacenar',

            }).then((url) => {
                if (url.value) {
                    localStorage.setItem("url-api-php", url.value)
                    this.urlApi = localStorage.getItem("url-api-php");
                    location.reload();
                } else {
                    document.getElementById("app").innerHTML = "";
                    Swal.fire({
                        'title': "Error!",
                        'text': "No ingresaste una url. Intenta nuevamente",
                        'icon': "error",
                        'showCloseButton': false,
                        'confirmButtonText': 'Aceptar'

                    }).then(() => {
                        location.reload();
                    })
                }
            })
        }

    },
    // Mensaje de cargando
    loader: `<div id="load" class="mt-3 animated fadeIn">
                <div id="figure">
                <div class="elemento1"></div>
                <div class="elemento3"></div>
            </div>
            <div id="text"></div>
            </div>`,
    // son los componentes predefinidos para mostrar al usuario
    defaultComponents: [{
            element: "navbar",
            route: "app/views/templates/navbar.html"
        },
        {
            element: "options",
            route: "app/views/templates/options.html"
        },
        {
            element: "slidebar",
            route: "app/views/templates/slidebar.html"
        }, {
            element: "footer",
            route: "app/views/templates/footer.html"
        }
    ]
};