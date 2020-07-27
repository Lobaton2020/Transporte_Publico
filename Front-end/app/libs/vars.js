export default {
    urlApi: "http://localhost/SENA/5_Trim_PHP_SENA/Proyecto_Transporte_Publico/Back-end/",
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
            element: "slidebar",
            route: "app/views/templates/slidebar.html"
        }, {
            element: "footer",
            route: "app/views/templates/footer.html"
        }
    ]
};