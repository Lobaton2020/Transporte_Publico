import UserService from "../services/user.service.js";

(function(window, document) {
    "use strict"

    document.addEventListener("DOMContentLoaded", (e) => {

        laurel.controller('user', {
            initValidate: function() {
                callInitValidate();
            },
            validate: async function(form) {
                laurel.renderLoader(true);
                let datos = new FormData();
                datos.append("correo", form.email.value);
                datos.append("pass", form.password.value);
                let res = await UserService.validate(datos)
                laurel.renderLoader(false);
                if (res) {
                    Swal.fire(
                        'Datos validados!',
                        'Redireccionando...',
                        'success'
                    );
                    form.reset();
                    let data = await UserService.see();
                    setTimeout(() => {
                        let redirect = '#/user/list';
                        if (data.user_data_credentials != 'undefined') {
                            redirect = data.user_data_credentials.rol == 3 ? '#/conductor/bus' : redirect;
                        }
                        window.location.hash = redirect;
                        window.location.reload();
                    }, 500);
                } else {
                    toastr.error('Validacion incorrecta. Intenta nuevamente')

                }
            },
            create: async function(form) {
                let datos = new FormData();
                datos.append("idrol", form.roles.value);
                datos.append("nombrecompleto", form.nombrecompleto.value);
                datos.append("correo", form.correo.value);
                datos.append("pass", form.contrasena.value);
                datos.append("imagen", form.avatar.files[0]);
                datos.append("telefono", form.telefono.value);
                let result = await UserService.create(datos);
                laurel.renderLoader(false);
                if (result === true) {
                    form.reset();
                    resetContainerImage();
                    Swal.fire(
                        'Exito!',
                        'Usuario creado correctamente!',
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
            update: async function(form) {
                let id = form.getAttribute("ide");
                let datos = new FormData();
                datos.append("nombrecompleto", form.nombrecompleto.value);
                datos.append("correo", form.correo.value);
                datos.append("telefono", form.telefono.value);
                let result = await UserService.update(datos, id);
                laurel.renderLoader(false);
                if (result === true) {
                    $("#user-detail").modal("hide");
                    updateFieldsList(form, id);
                    form.reset();
                    Swal.fire(
                        'Exito!',
                        'Usuario actualizado correctamente!',
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
                let users = await UserService.list();
                if (users) {
                    renderUser(users);
                    laurel.renderLoader(false);

                } else {
                    console.log("No hay datos")
                }
            },
            get: async function(id) {
                let user = await UserService.get(id);
                if (user) {
                    return user;
                } else {
                    console.log("No hay datos")
                }
            },


            listRoles: async function(obtener = null) {
                let roles = await UserService.listRoles();
                if (roles) {
                    if (obtener == "get") {
                        return roles;
                    }
                    renderRoles(roles);
                } else {
                    console.log("No hay datos")
                }
            },
            logout: async function() {
                if (await UserService.logout()) {
                    Swal.fire(
                        'Cerrando sesion!',
                        '',
                        'success'
                    );
                    setTimeout(() => {
                        window.location.reload(laurel.urlLaurel + "#/auth/login");
                    }, 500);
                } else {
                    Swal.fire(
                        'Error!',
                        "No se pudo cerrar la sesion.",
                        'error'
                    );
                }
            },
            loadModalEdit: async function() {
                return new Promise((resolve, reject) => {

                    let modal = document.getElementById("modal-view");
                    if (!modal.classList.contains("user-update") || modal.innerHTML == "") {
                        modal.classList.add("user-update");
                        laurel.fetch("app/views/modals/userUpdate.html", "GET", (data) => {
                            modal.innerHTML = data;
                            resolve(true);
                        }, "", "text");
                    } else {
                        resolve(true);
                    }
                })
            }

        });
    });
})(window, document);


const resetContainerImage = () => {
    let container = document.getElementById("container-img");
    container.classList.remove("container-img");
    container.innerHTML = "";
}

const handlerValidateUser = (e) => {
    e.preventDefault();
    laurel.getController().validate(e.currentTarget);
}
const callInitValidate = () => {
    document.getElementById("form-login").addEventListener("submit", handlerValidateUser);
}
const handlerCreateUser = async(e) => {
    e.preventDefault();
    laurel.renderLoader(true);
    await laurel.getController().create(e.target);
}

const updateFieldsList = (form, id) => {

    let register = document.getElementById(id);
    register.querySelector(".name").textContent = form.nombrecompleto.value;
    register.querySelector(".email").textContent = form.correo.value;
    register.querySelector(".contact").textContent = form.telefono.value;
}

const handlerUpdateUser = async(e) => {
    e.preventDefault();
    laurel.renderLoader(true)
    await laurel.getController().update(e.target);
};
// Manejador de  detalle de usuario
const handlerDetailUser = async(e) => {

    let id = e.currentTarget.id;
    let user = document.getElementById(id);
    await laurel.getController().loadModalEdit();
    let form = document.getElementById("update-user");
    $("#user-detail").modal("show");

    form.setAttribute("ide", id);
    form.nombrecompleto.value = user.querySelector(".name").textContent;
    form.correo.value = user.querySelector(".email").textContent;
    form.telefono.value = user.querySelector(".contact").textContent;

    form.addEventListener("submit", handlerUpdateUser, true)

};


const renderUser = async(data) => {
    var tbody = document.getElementById("table-users");
    let template = document.getElementById("template");
    let fragmento = document.createDocumentFragment();
    let rol, detail;

    tbody.innerHTML = "";
    for (let i = data.length - 1; i >= 0; i--) {
        let element = data[i];

        let clon = template.content.cloneNode(true);
        clon.querySelector(".tr-clone").id = element.idusuario;
        clon.querySelector(".image").src = laurel.url + element.imagen;
        clon.querySelector(".name").textContent = element.nombrecompleto;
        clon.querySelector(".email").textContent = element.correo;
        clon.querySelector(".contact").textContent = element.telefono;
        rol = clon.querySelector(".rol");
        switch (parseInt(element.idrol)) {
            case 1:
                rol.innerHTML = "<div class='badge badge-success'> Administrador</div>"
                break;
            case 2:
                rol.innerHTML = "<div class='badge badge-primary'> Coodinador</div>"
                break;
            case 3:
                rol.innerHTML = "<div class='badge badge-danger'> Conductor</div>"
                break;
            default:
                rol.innerHTML = "<div class='badge badge-secondary'>Desconocido</div>"
        }
        detail = clon.querySelector(".user-detalle");
        detail.id = element.idusuario;
        detail.addEventListener("click", handlerDetailUser);
        fragmento.appendChild(clon);
    };
    tbody.appendChild(fragmento);
};


const handlerRenderImage = (e) => {
    let image = e.target.files[0].type.substring(0, 5) == "image" ? e.target.files[0] : "";
    if (image == "") {
        Swal.fire(
            'Error!',
            "Debes poner un archivo de tipo imagen",
            'error'
        );
        e.target.value = "";
        return;
    }
    let urlImg = URL.createObjectURL(image);
    let ubication = document.getElementById("container-img");
    let img = new Image()
    img.src = urlImg;
    img.classList.add("img-prueba");
    ubication.innerHTML = ""
    ubication.classList.add("container-img");
    ubication.appendChild(img);
};

const prepareEventImage = () => {
    var image = document.getElementById("avatar");
    image.addEventListener("change", handlerRenderImage);
};

const renderRoles = (data) => {
    var select = document.getElementById("roles");
    var form = document.getElementById("create-user");
    prepareEventImage();
    form.addEventListener("submit", handlerCreateUser)
    data.forEach((element, i) => {
        let option = document.createElement("option");
        select.appendChild(option);
        option.value = element.idrol;
        option.textContent = element.nombre;
    });
};