import RouteService from "../services/route.service.js";

(function(window, document) {
    "use strict"
    document.addEventListener("DOMContentLoaded", (e) => {

        laurel.controller('route', {
            initForm: async function() {

                return await new Promise((resolve, reject) => {
                    activeFormRoute();
                    resolve(true);
                });
            },
            create: async function(form) {
                try {
                    let datos = new FormData();
                    datos.append("no,bre", form.name.value);
                    datos.append("partida", form.startingplace.value);
                    datos.append("llegada", form.arrivalplace.value);
                    let result = await RouteService.create(datos);
                    if (result === true) {
                        form.reset();
                        Swal.fire('Exito!', 'Ruta creada correctamente!', 'success');
                    } else {
                        let error = laurel.validateStatusResponse(result);
                        Swal.fire('Error!', error, 'error');

                    }
                } catch (err) {
                    toastr.error("Lo sentimos, no se creó la ruta.", "Error!")
                }
            },
            list: async function() {
                laurel.renderLoader(true);
                let data = await RouteService.all();
                renderListRoutes(data);
                laurel.renderLoader(false);
            },

        });
    });
})(window, document);

const createRegisterRoute = (e) => {
    e.preventDefault();
    if (e.target.name.value != "" &&
        e.target.startingplace.value != "" &&
        e.target.arrivalplace.value != ""
    ) {
        laurel.getController().create(e.target);
    } else {
        Swal.fire("Error!", "Debes llenar todo los campos", "error");
    }
};

const activeFormRoute = () => {
    document.getElementById("app").classList.add("fixed-footer");
    document.getElementById("create-register").addEventListener("submit", createRegisterRoute)
};

const handlerDetail = () => {
    alert("Ok ");
};

const renderListRoutes = (data) => {

    var tbody = document.getElementById("table-registers");
    let template = document.getElementById("template");
    let fragmento = document.createDocumentFragment();
    let element, clon, detail;
    if (data.length == 0) return;
    tbody.innerHTML = "";
    for (let i = data.length - 1; i >= 0; i--) {
        element = data[i];
        console.log(element)
        clon = template.content.cloneNode(true);
        clon.querySelector(".tr-clone").id = element.idusuario;
        clon.querySelector(".id").textContent = element.idruta;
        clon.querySelector(".name").textContent = element.nombre.toUpperCase();
        clon.querySelector(".startingplace").textContent = element.lugarpartida;
        clon.querySelector(".arrivalplace").textContent = element.lugarllegada;

        detail = clon.querySelector(".detail");
        detail.id = element.idusuario;
        detail.addEventListener("click", handlerDetail);
        fragmento.appendChild(clon);
    };
    tbody.appendChild(fragmento);
}