import { UserService } from "../services/bus.service.js";

(function(window, document) {
    "use strict"
    // Controlador de ejemplo
    // para mostrar el cargador (animacion)
    var vista = document.getElementById("vista");
    var arr = document.createElement("div");
    // opciones del la libreria de alertas
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-bottom-right";
    var contador = 0;
    lob.controlador('bus', {
        // crear
        create: async function(form) {
            console.log("Crear")
            form.childNodes[5].disabled = true;
            vista.appendChild(arr).innerHTML = lob.loader;
            arr.style.display = "block";

            let datos = {
                id: ++contador,
                title: form.childNodes[1].childNodes[3].value,
                url: form.childNodes[3].childNodes[3].value
            }

            if (await LinkService.crear(datos)) {
                toastr["success"]("Tarea registrada correctamente!");
                form.reset();
                this.listar();
            } else {
                toastr["error"]("Error. Los campos estan vacios.");
            }
            arr.style.display = "none";
            form.childNodes[5].disabled = false;

        },
        // lISTAMOS TODOS LOS LINKS QUE EXISTEN
        //------------------------------------------------------------------------------------------------------------------------------
        list: function() {
            console.log(await UserService.list())
        }

    });
})(window, document);