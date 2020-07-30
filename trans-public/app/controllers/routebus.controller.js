import RouteBusService from "../services/routebus.service.js";

(function(window, document) {
    "use strict"

    document.addEventListener("DOMContentLoaded", (e) => {

        laurel.controller('routebus', {
            getbus: async function() {
                let bus = await RouteBusService.get();
                if (typeof bus.response == 'undefined') {
                    renderBus(bus);
                } else {
                    renderErrorBus();
                }
            },
            listroutes: async function() {
                let rutas = await RouteBusService.all();
                if (typeof rutas.response == 'undefined') {
                    renderRoutes(rutas);
                } else {
                    renderErrorRoutes();
                }
            }


        });
    });
})(window, document);

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

const renderErrorRoutes = () => {
    fixedFooter();
    document.getElementById("table-users").innerHTML = "<h2>No se registran rutas a tu cargo.</h2>";
};