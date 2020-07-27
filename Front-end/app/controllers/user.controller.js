import UserService from "../services/user.service.js";

(function(window, document) {
    "use strict"

    document.addEventListener("DOMContentLoaded", (e) => {

        laurel.controller('user', {
            initValidate: function(){
                 callInitValidate();
            },
            validate: async function(form) {
                let datos = new FormData();
                datos.append("correo", form.email.value);
                datos.append("pass", form.password.value);

                if (await UserService.validate(datos)) {
                    Swal.fire(
                        'Datos validados!',
                        'Redireccionando...',
                        'success'
                      );
                    setTimeout(() => {
                        laurel.authentication = true;
                        window.location.hash = '#/user/list';
                    }, 1000);
                }else{
                    Swal.fire(
                        'Error!',
                        'Validacion incorrecta. Intenta nuevamente',
                        'error'
                      );
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
                
                if (await UserService.create(datos)) {
                    form.reset();
                    Swal.fire(
                        'Exito!',
                        'Usuario creado correctamente!',
                        'success'
                      );
                }else{
                    Swal.fire(
                        'Error!',
                        'Intentalo nuevamente!',
                        'error'
                      );
                    
                }
            },
            list: function() {
                console.log("okk")
                    // let users = await UserService.list();
                    // if (users) {
                    //     renderUser(users);
                    // } else {
                    //     console.log("No hay datos")
                    // }
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
    });
})(window, document);

const handlerValidateUser =  (e) => {
    e.preventDefault();
    laurel.getController().validate(e.currentTarget);
}
const callInitValidate =  () =>{
     document.getElementById("form-login").addEventListener("submit",handlerValidateUser);
}
const handlerCreateUser = async(e) => {
    e.preventDefault();
    await laurel.getController().create(e.target);
}

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