export default {
    urlLaurel: location.origin.concat(location.pathname),
    urlApi: localStorage.getItem("url-api-php") || "http://localhost/SENA/5_Trim_PHP_SENA/Proyecto_Transporte_Publico/api/v1/",
    getUrlApi: function() {
        if (!this.urlApi) {
            Swal.fire({
                title: 'Ingresa la url de tu API',
                text: "Si la ingresas mal, borra 'url-api-php' del localStorage, Tambien la aplicacion no funcionará.",
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
    validateStatusResponse: function(result) {
        let error = "";
        error = result == 'invalidemail' ? 'El correo de usuario es invalido' : error;
        error = result == 'imagenotfound' ? 'Selecciona una imagen' : error;
        error = result == 'notvalidatecellphone' ? 'Telefono invalido' : error;
        error = result == 'invalidcellphone' ? 'Tu numero celular es muy largo' : error;
        error = result == 'imagenotsaved' ? 'El servidor no pudo almacenar la imagen' : error;
        error = result == 'invalidpassword' ? 'La contraseña no es valida' : error;
        error = result == 'alreadyexistregister' ? 'El registro ya existe' : error;
        error = result == 'fieldempty' ? 'Debes llenar los campos requerido' : error;
        error = result == 'notregistered' ? 'Error al registrar' : error;
        error = result == 'notexistsregister' ? 'El usuario no existe' : error;
        error = result == 'notupdated' ? 'Error al actializar' : error;
        error = error == "" ? "Error desconocido." : error;
        return error;

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