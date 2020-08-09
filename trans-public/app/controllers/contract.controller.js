import ContractService from "../services/contract.service.js";
import UserService from "../services/user.service.js";
(function(window, document) {
    document.addEventListener("DOMContentLoaded", () => {
        "use strict"
        laurel.controller('contract', {
            initForm: function() {
                initUsersForm();
            },
            create: async function(form) {
                let datos = new FormData();
                datos.append("idusuario", form.idusuario.value);
                datos.append("fechainicio", form.fechainicio.value);
                datos.append("fechafin", form.fechafin.value);
                datos.append("empresa", form.empresa.value);
                datos.append("sueldo", form.sueldo.value);
                let result = await ContractService.create(datos);
                if (result === true) {
                    document.getElementById("input-user").readOnly = false;
                    form.reset();
                    Swal.fire(
                        'Exito!',
                        'Contrato creado correctamente!',
                        'success'
                    );
                } else {
                    let error = laurel.validateStatusResponse(result);
                    Swal.fire('Error!', error, 'error');

                }
            },
            update: async function(form) {
                laurel.renderLoader(true);
                let id = form.getAttribute("ide");
                let datos = new FormData();
                datos.append("idcontrato", id);
                datos.append("fechainicio", form.fechainicio.value);
                datos.append("fechafin", form.fechatermino.value);
                datos.append("sueldo", form.sueldo.value);
                let result = await ContractService.update(datos);
                laurel.renderLoader(false);
                if (result === true) {
                    $("#user-detail").modal("hide");
                    updateFieldsList(form, id);
                    form.reset();
                    Swal.fire(
                        'Exito!',
                        'Contrato renovado correctamente!',
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
                laurel.renderLoader(true);
                let data = await ContractService.all();
                if (data.length > 0) {
                    renderContracts(data);
                } else {
                    console.log("No hay datos")
                }
                laurel.renderLoader(false);
            },
            users: async function(name) {
                return await UserService.users(name);
            },
            loadModalEdit: async function() {
                return new Promise((resolve, reject) => {
                    let modal = document.getElementById("modal-view");
                    if (!modal.classList.contains("contract-update") || modal.innerHTML == "") {
                        modal.classList.add("contract-update");
                        laurel.fetch("app/views/modals/contractRenovate.html", "GET", (data) => {
                            modal.innerHTML = data;
                            resolve(true);
                        }, "", "text");
                    } else {
                        resolve(true);
                    }
                })
            },
            enployedContract: async function() {
                laurel.renderLoader(true);
                let data = await ContractService.list();
                if (data.length > 0) {
                    renderContractsList(data);
                } else {
                    console.log("No hay datos")
                }
                laurel.renderLoader(false);
            }

        });
    });
})(window, document);

const renderContractsList = (data) => {
    var tbody = document.getElementById("table-contracts");
    let template = document.getElementById("template");
    let fragmento = document.createDocumentFragment();
    let clon, estado, clonEstado, fechaActual = new Date(),
        fechaTermino;

    tbody.innerHTML = "";
    data.forEach((elem, i) => {
        let { idcontrato, fechainicio, fechatermino, empresa, valortotal } = elem;
        fechaTermino = new Date(fechatermino);
        estado = (fechaActual > fechaTermino) ? "Terminado" : "Activo";
        clon = template.content.cloneNode(true);
        clonEstado = clon.querySelector(".estado");
        clon.querySelector(".tr-clone").id = idcontrato
        clon.querySelector(".id").textContent = idcontrato;
        clon.querySelector(".empresa").textContent = empresa.toUpperCase()
        clon.querySelector(".sueldo").textContent = valortotal;
        clon.querySelector(".fechainicio").textContent = fechainicio;
        clon.querySelector(".fechatermino").textContent = fechatermino;
        clonEstado.textContent = estado;
        estado === "Activo" ? clonEstado.classList.add("badge-success") : clonEstado.classList.add("badge-danger")

        fragmento.appendChild(clon);

    })
    tbody.appendChild(fragmento);
}

const updateFieldsList = (form, id) => {

    let register = document.getElementById(id);
    register.querySelector(".sueldo").textContent = form.sueldo.value;
    register.querySelector(".fechainicio").textContent = form.fechainicio.value;
    register.querySelector(".fechatermino").textContent = form.fechatermino.value;
}
const addSelectUser = (e) => {
    let form = document.getElementById("create-contract");
    let input = document.getElementById("input-user")
    input.value = e.currentTarget.children[1].children[1].textContent + " | " + e.currentTarget.children[1].children[0].textContent;
    input.readOnly = true;
    form.idusuario.value = e.currentTarget.id;
    e.currentTarget.parentNode.innerHTML = "";
}

const renderUsersForm = async(e) => {
    let data = await laurel.getController().users(e.target.value),
        container = document.getElementById("list-user"),
        template = document.getElementById("show-user"),
        fragment = document.createDocumentFragment();
    let clon, subcontainer;

    container.innerHTML = "";
    if (data.length == 0) {
        let div = document.createElement("div");
        div.classList.add("driver-not-found");
        div.textContent = "Usuario no encontrado.";
        container.appendChild(div);
    } else {
        data.forEach((elem, i) => {
            let { idusuario, idrol, nombrecompleto, correo, imagen } = elem;
            clon = template.content.cloneNode(true);
            subcontainer = clon.querySelector(".user");
            clon.querySelector(".img-user").src = laurel.url + imagen
            clon.querySelector(".name").textContent = nombrecompleto;
            clon.querySelector(".email").textContent = correo;
            subcontainer.id = idusuario;
            subcontainer.addEventListener("click", addSelectUser)

            fragment.append(clon);
        });
        container.append(fragment);
    }

};

const createContract = (e) => {
    e.preventDefault();
    if (e.target.idusuario.value != "" &&
        e.target.fechainicio.value != "" &&
        e.target.fechafin.value != "" &&
        e.target.empresa.value != "" &&
        e.target.sueldo.value != ""
    ) {
        laurel.getController().create(e.target);
    } else {
        Swal.fire("Error!", "Debes llenar todo los campos", "error");
    }

};

const initUsersForm = () => {
    let input = document.getElementById("input-user")
    input.addEventListener("keyup", renderUsersForm);
    input.addEventListener("dblclick", (e) => {
        e.target.value = "";
        e.currentTarget.readOnly = false;
    });
    document.getElementById("create-contract").addEventListener("submit", createContract)
};

const handlerUpdateContract = (e) => {
    e.preventDefault();
    laurel.getController().update(e.target);
}

const handlerRenovateContract = async(e) => {
    let id = e.currentTarget.id;
    let user = document.getElementById(id);
    await laurel.getController().loadModalEdit();
    let form = document.getElementById("contract-update");
    $("#user-detail").modal("show");

    form.setAttribute("ide", id);
    form.nombrecompleto.disabled = true;
    form.nombrecompleto.value = user.querySelector(".name").textContent;
    form.fechainicio.value = user.querySelector(".fechainicio").textContent;
    form.fechatermino.value = user.querySelector(".fechatermino").textContent;
    form.sueldo.value = user.querySelector(".sueldo").textContent;
    form.addEventListener("submit", handlerUpdateContract, true)

};
const renderContracts = (data) => {
    var tbody = document.getElementById("table-contracts");
    let template = document.getElementById("template");
    let fragmento = document.createDocumentFragment();
    let clon, detail;

    tbody.innerHTML = "";
    data.forEach((elem, i) => {
        let { idcontrato, fechainicio, fechatermino, empresa, valortotal, usuario } = elem;
        let { idusuario, imagen, nombrecompleto, correo, rol } = usuario;

        clon = template.content.cloneNode(true);
        detail = clon.querySelector(".renovar")
        clon.querySelector(".tr-clone").id = idcontrato
        clon.querySelector(".image").src = laurel.url + imagen;
        clon.querySelector(".name").textContent = nombrecompleto;
        clon.querySelector(".email").textContent = correo;
        clon.querySelector(".empresa").textContent = empresa.toUpperCase()
        clon.querySelector(".sueldo").textContent = valortotal;
        clon.querySelector(".fechainicio").textContent = fechainicio;
        clon.querySelector(".fechatermino").textContent = fechatermino;
        detail.id = idcontrato
        detail.addEventListener("click", handlerRenovateContract)
        fragmento.appendChild(clon);

    })
    tbody.appendChild(fragmento);
};