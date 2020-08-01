import UserService from "../services/user.service.js";
import BusService from "../services/bus.service.js";
(function(window, document) {
    document.addEventListener("DOMContentLoaded", () => {
        "use strict"
        laurel.controller('bus', {
            activeForm: function() {
                activeFormDrivers();
            },
            create: async function(form) {
                let datos = new FormData();
                datos.append("placa", form.placa.value);
                datos.append("idusuario", form.idusuario.value);
                datos.append("color", form.color.value);
                datos.append("modelo", form.modelo.value);
                datos.append("fabricante", form.fabricante.value);
                let result = await BusService.create(datos);
                if (result === true) {
                    document.getElementById("input-driver").readOnly = false;
                    form.reset();
                    Swal.fire(
                        'Exito!',
                        'Bus creado correctamente!',
                        'success'
                    );
                } else {
                    let error = laurel.validateStatusResponse(result);
                    Swal.fire(
                        'Error!',
                        error,
                        'error'
                    );

                }
            },
            list: async function() {
                let buses = await BusService.list();
                renderListBuses(buses);
            },
            drivers: async function(name) {
                return await UserService.drivers(name);
            }

        });
    });
})(window, document);

const addSelectDriver = (e) => {
    let bus = document.getElementById("create-bus");
    let input = document.getElementById("input-driver")
    input.value = e.currentTarget.children[1].children[1].textContent + " | " + e.currentTarget.children[1].children[0].textContent;
    input.readOnly = true;
    bus.idusuario.value = e.currentTarget.id;
    e.currentTarget.parentNode.innerHTML = "";
};

const renderDrivers = async(e) => {
    let data = await laurel.getController().drivers(e.target.value),
        container = document.getElementById("list-drivers"),
        template = document.getElementById("show-driver"),
        fragment = document.createDocumentFragment();
    let clon, subcontainer;

    container.innerHTML = "";
    if (data.length == 0) {
        let div = document.createElement("div");
        div.classList.add("driver-not-found");
        div.textContent = "Conductor no encontrado.";
        container.appendChild(div);
    } else {
        data.forEach((element, i) => {
            clon = template.content.cloneNode(true);
            subcontainer = clon.querySelector(".driver");
            clon.querySelector(".img-driver").src = laurel.url + element.imagen;
            clon.querySelector(".name").textContent = element.nombrecompleto;
            clon.querySelector(".email").textContent = element.correo;
            subcontainer.id = element.idusuario;
            subcontainer.addEventListener("click", addSelectDriver)

            fragment.append(clon);
        });
        container.append(fragment);
    }

};
const createBus = (e) => {
    e.preventDefault();
    if (e.target.placa.value != "" &&
        e.target.idusuario.value != "" &&
        e.target.color.value != "" &&
        e.target.modelo.value != "" &&
        e.target.fabricante.value != ""
    ) {
        laurel.getController().create(e.target);
    } else {
        Swal.fire("Error!", "Debes llenar todo los campos", "error");
    }
};

const activeFormDrivers = () => {
    let input = document.getElementById("input-driver")
    input.addEventListener("keyup", renderDrivers);
    input.addEventListener("dblclick", (e) => {
        e.target.value = "";
        e.currentTarget.readOnly = false;
    });
    document.getElementById("create-bus").addEventListener("submit", createBus)
};
const handlerDetail = () => {
    alert("Ok ");
};
const renderListBuses = (data) => {
    var tbody = document.getElementById("table-buses");
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
        clon.querySelector(".image").src = laurel.url + element.usuario.imagen;
        clon.querySelector(".name").textContent = element.usuario.nombrecompleto;
        clon.querySelector(".email").textContent = element.usuario.correo;
        clon.querySelector(".plaque").textContent = element.placa.toUpperCase();
        clon.querySelector(".color").textContent = element.color.toUpperCase();
        clon.querySelector(".model").textContent = element.modelo.toUpperCase();
        clon.querySelector(".maker").textContent = element.fabricante.toUpperCase();

        detail = clon.querySelector(".detail");
        detail.id = element.idusuario;
        detail.addEventListener("click", handlerDetail);
        fragmento.appendChild(clon);
    };
    tbody.appendChild(fragmento);
}