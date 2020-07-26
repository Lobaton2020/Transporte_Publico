import UserService from "../services/user.service.js";
import config from "../libs/default.js";

(function(window, document) {
    "use strict"

    lob.controlador('user', {
        create: async function(form) {
            let datos = new FormData();
            datos.append("idrol", form.roles.value);
            datos.append("nombrecompleto", form.nombrecompleto.value);
            datos.append("correo", form.correo.value);
            datos.append("pass", form.contrasena.value);
            datos.append("imagen", form.avatar.files[0]);
            datos.append("telefono", form.telefono.value);


            if (await UserService.create(datos)) {
                alert("Usuario registrado")
            }
        },
        list: async function() {
            let users = await UserService.list();
            if (users) {
                renderUser(users);
            } else {
                console.log("No hay datos")
            }
        },
        listRoles: async function() {
            let roles = await UserService.listRoles();
            if (roles) {
                renderRoles(roles);
            } else {
                console.log("No hay datos")
            }
        }

    });
})(window, document);



const eventMouseOver = (e) => {
    e.target.style.opacity = 0.6;
    e.target.style.cursor = "pointer";
    e.target.style.borderRadius = "20%";
};

const eventMouseOut = (e) => {
    e.target.style.opacity = 1;
    e.target.style.cursor = "pointer";
};


const eventClick = (e) => {
    alert(e.target.id + " " + e.target.name);
};


const renderUser = (data) => {
    var div = document.createElement("div");
    data.forEach((element, i) => {
        let divhijo = document.createElement("div");
        let img = new Image(200);
        img.src = config.urlApi + element.imagen;
        divhijo.appendChild(img);
        img.onmouseover = eventMouseOver;
        img.addEventListener("mouseout", eventMouseOut);
        img.addEventListener("click", eventClick);
        divhijo.classList.add("hijo");
        div.appendChild(divhijo);
        divhijo.innerHTML += element.nombrecompleto;
    });
    document.getElementById("load-users").appendChild(div);
    document.title = data.length;
};

const handlerCreateUser = async(e) => {
    e.preventDefault();
    await lob.getCtrl().create(e.target);
}

const renderRoles = (data) => {
    var select = document.getElementById("roles");
    var form = document.getElementById("create-user");
    form.addEventListener("submit", handlerCreateUser)

    data.forEach((element, i) => {
        let option = document.createElement("option");
        select.appendChild(option);
        option.value = element.idrol;
        option.textContent = element.nombre;

    });




};