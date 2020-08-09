import RouteBusService from "../services/routebus.service.js";

(function(window, document) {
    "use strict"

    document.addEventListener("DOMContentLoaded", (e) => {

        laurel.controller('routebus', {
            initFormAsign: function() {
                initFormAsign();
            },
            getbus: async function() {
                let bus = await RouteBusService.get();
                if (typeof bus.response == 'undefined') {
                    renderBus(bus);
                } else {
                    renderErrorBus();
                }
            },
            create: async function(form, buses) {
                let datos = new FormData();
                datos.append("idruta", form.idruta.value);
                buses.map((elem, i) => datos.append(`idbuses[${i}]`, elem))
                datos.append("fechainicio", form.fechainicio.value + " " + form.horainicio.value + ":00");
                datos.append("fechafin", form.fechafin.value + " " + form.horafin.value + ":00");
                let result = await RouteBusService.create(datos);
                laurel.renderLoader(false);
                if (result === true) {
                    document.getElementById("list-buses").innerHTML = ""
                    document.getElementById("render-buses").innerHTML = ""
                    form.ruta.readOnly = false;

                    form.reset();
                    Swal.fire(
                        'Exito!',
                        'Buses asignados correctamente!',
                        'success'
                    );
                } else {
                    let error = laurel.validateStatusResponse(result);
                    Swal.fire('Error!', error, 'error');

                }
            },
            listRoutesUsers: async function() {
                laurel.renderLoader(true);
                let rutas = await RouteBusService.all();
                if (rutas.length > 0) {
                    renderRoutesAllUsers(rutas);
                } else {
                    // renderErrorRoutes();
                }
                laurel.renderLoader(false);
            },
            listroutes: async function() {
                laurel.renderLoader(true);
                let rutas = await RouteBusService.allByUser();
                if (typeof rutas.response == 'undefined') {
                    renderRoutes(rutas);
                } else {
                    renderErrorRoutes();
                }
                laurel.renderLoader(false);
            },
            getRoutes: async function(value) {
                return await RouteBusService.getRoutes(value);
            },
            getBuses: async function(value) {
                return await RouteBusService.getBuses(value);
            },


        });
    });
})(window, document);

const addSelectElement = (e) => {
    let bus = document.getElementById("asign-bus");
    let input = document.getElementById("input-route")
    input.value = e.currentTarget.id + " | " + e.currentTarget.children[1].textContent;
    input.readOnly = true;
    bus.idruta.value = e.currentTarget.id;
    e.currentTarget.parentNode.innerHTML = "";
};

const renderRoutesForm = async(e) => {
    let data = await laurel.getController().getRoutes(e.target.value),
        container = document.getElementById("render-elements"),
        template = document.getElementById("show-element"),
        fragment = document.createDocumentFragment();
    let clon, subcontainer;

    container.innerHTML = "";
    if (typeof data.response !== "undefined") {
        let div = document.createElement("div");
        div.classList.add("driver-not-found");
        div.textContent = "Ruta no encontrada.";
        container.appendChild(div);
    } else {
        data.forEach((element, i) => {
            let { nombre, lugarpartida, lugarllegada } = element;
            clon = template.content.cloneNode(true);
            subcontainer = clon.querySelector(".element");
            clon.querySelector(".name").textContent = nombre;
            clon.querySelector(".placestarting").textContent = "Partida: " + lugarpartida;
            clon.querySelector(".placearrived").textContent = "Llegada: " + lugarllegada;
            subcontainer.id = element.idruta;
            subcontainer.addEventListener("click", addSelectElement)

            fragment.append(clon);
        });
        container.append(fragment);
    }
};

const removeItemBuses = (e) => {
    document.querySelector(`[value='${e.currentTarget.textContent}']`).outerHTML = "";
    e.currentTarget.outerHTML = "";
}

const addSelectBus = (e) => {
    let busForm = document.getElementById("asign-bus"),
        listBuses = document.getElementById("list-buses"),
        div = document.createElement("div"),
        inputHidden = document.createElement("input"),
        repeat = false;

    document.querySelectorAll('[name="idbuses"]')
        .forEach((elem) => {
            if (elem.value == e.currentTarget.id) {
                repeat = true
                return
            }
        })
    if (repeat) {
        let div = document.createElement("div"),
            container = document.getElementById("render-buses");
        container.innerHTML = "";
        div.classList.add("driver-not-found");
        div.textContent = "Ya añadiste este bus.";
        container.prepend(div);
        return;
    }
    inputHidden.type = "hidden";
    inputHidden.name = "idbuses";
    inputHidden.value = e.currentTarget.id;
    busForm.prepend(inputHidden);

    listBuses.appendChild(div)
    div.classList.add("item-list-buses")
    div.addEventListener("click", removeItemBuses)
    div.innerHTML = e.currentTarget.children[0].textContent;

};

const renderBusesForm = async(e) => {
    let data = await laurel.getController().getBuses(e.target.value),
        container = document.getElementById("render-buses"),
        template = document.getElementById("show-buses"),
        fragment = document.createDocumentFragment();
    let clon, subcontainer;

    container.innerHTML = "";
    if (typeof data.response !== "undefined") {
        let div = document.createElement("div");
        div.classList.add("driver-not-found");
        div.textContent = "Ruta no encontrada.";
        container.appendChild(div);
    } else {
        data.forEach((element, i) => {
            let { placa, fabricante, modelo, color } = element;
            clon = template.content.cloneNode(true);
            subcontainer = clon.querySelector(".element");
            clon.querySelector(".placa").textContent = placa;
            clon.querySelector(".detail").textContent = color.toUpperCase() + " - " + modelo + " - " + fabricante.toUpperCase();
            subcontainer.id = placa;
            subcontainer.addEventListener("click", addSelectBus)

            fragment.append(clon);
        });
        container.append(fragment);
    }
};
const createAsignBus = async(e) => {
    e.preventDefault();

    laurel.renderLoader(true);
    var data = Array()
    e.target.querySelectorAll("[name='idbuses']")
        .forEach((elem) => {
            data.push(elem.value)
        });
    await laurel.getController().create(e.target, data);
};
const initFormAsign = () => {
    let inputRoute = document.getElementById("input-route"),
        inputBus = document.getElementById("input-bus");

    inputBus.addEventListener("keyup", renderBusesForm);
    inputRoute.addEventListener("keyup", renderRoutesForm);
    inputRoute.addEventListener("dblclick", (e) => {
        e.target.value = "";
        e.currentTarget.readOnly = false;
    });
    document.getElementById("asign-bus").addEventListener("submit", createAsignBus)
};
// Metodo de uso del rol de usuario conductor
const fixedFooter = () => {
    document.getElementById("app").classList.add("fixed-footer");

};
const renderBus = (data) => {
    fixedFooter();
    document.getElementById("placa").textContent = data.placa.toUpperCase();
    document.getElementById("modelo").textContent = data.modelo;
    document.getElementById("color").textContent = data.color.toUpperCase();
    document.getElementById("fabricante").textContent = data.fabricante.toUpperCase();
};

const renderErrorBus = () => {
    fixedFooter();
    document.getElementById("option-route").style.display = "none";
    document.getElementById("bus-response").innerHTML = "<h2>Aún no tienes un bus asignado.</h2>";
};
const completeRoute = (e) => {
    alert("Ok Ruta terminada");
}
const renderRoutes = (data) => {
    fixedFooter();
    var tbody = document.getElementById("table-routes");
    let template = document.getElementById("template");
    let fragmento = document.createDocumentFragment();
    let clon, element;

    tbody.innerHTML = "";
    for (let i = data.length - 1; i > 0; i--) {
        element = data[i];
        clon = template.content.cloneNode(true);
        clon.querySelector(".name").textContent = element.rutas.ruta.nombre;
        clon.querySelector(".lugarsalida").textContent = element.rutas.ruta.lugarpartida;
        clon.querySelector(".fechasalida").textContent = element.fechapartida;
        clon.querySelector(".lugarllegada").textContent = element.rutas.ruta.lugarllegada;
        clon.querySelector(".fechallegada").textContent = element.fechallegada;
        clon.querySelector(".route-complete").addEventListener("click", completeRoute)
        fragmento.appendChild(clon);
    };
    tbody.appendChild(fragmento);
};
const completeRouteAsigned = (e) => {
    alert("Ohh Muy bien");
}
const renderRoutesAllUsers = (data) => {
    var tbody = document.getElementById("table-routes");
    let template = document.getElementById("template");
    let fragmento = document.createDocumentFragment();
    let clon;

    tbody.innerHTML = "";
    data.forEach((elem, i) => {
        let { idbus, fechapartida, fechallegada, ruta, usuario, idusuario } = elem;
        let { nombrecompleto, correo, imagen } = usuario;
        let { lugarllegada, lugarpartida, iruta } = ruta;

        clon = template.content.cloneNode(true);
        clon.querySelector(".bus").textContent = idbus.toUpperCase();
        clon.querySelector(".lugarsalida").textContent = lugarpartida;
        clon.querySelector(".fechasalida").textContent = fechapartida;
        clon.querySelector(".lugarllegada").textContent = lugarllegada;
        clon.querySelector(".fechallegada").textContent = fechallegada;
        clon.querySelector(".image").src = laurel.url + imagen;
        clon.querySelector(".name").textContent = nombrecompleto;
        clon.querySelector(".email").textContent = correo;
        clon.querySelector(".route-complete").addEventListener("click", completeRouteAsigned)
        fragmento.appendChild(clon);

    })
    tbody.appendChild(fragmento);
};

const renderErrorRoutes = () => {
    fixedFooter();
    document.getElementById("table-users").innerHTML = "<h2>No se registran rutas a tu cargo.</h2>";
};