/*
 * Autor : Andres Lobaton
 * Año: 2020
 * Descripcion: Esta libreria esta hace con la finalidad de poder gestionar un sitio SPA.
 * Finalidad: Conectarda con un back-end (java o php). 
 */
import vars from "./vars.js";

(function(window, document) {
    document.addEventListener("DOMContentLoaded", () => {
        'use strict';
        const start = () => { //se interpreta como una clase
            let element = null;
            let frame = null;
            let routes = {};
            let controllers = [];
            let library = {
                url: vars.urlApi,
                urlLaurel: vars.urlLaurel,
                loader: '',
                defaultComponents: [],
                currentController: '',
                authentication: false,

                getBy: (id) => {
                    element = document.getElementById(id);
                    return laurel;
                },
                getById: (id) => {
                    return document.getElementById(id);
                },

                renderComponent: (route, element) => {
                    let elem = document.getElementById(element);
                    fetch(route)
                        .then((response) => response.text())
                        .then((text) => {
                            elem.innerHTML = text

                        });
                },

                getController: () => {
                    return window.laurel.currentController;
                },

                controller: (name, objController) => {
                    controllers[name] = objController;
                },

                route: (route, template, controller, action) => {
                    routes[route] = {
                        'templates': template,
                        'controller': controller,
                        'action': action
                    };
                    return window.laurel;
                },

                router: () => {
                    frame = element;
                    return window.laurel;
                },
                callDefaultComponents: () => {
                    let components = window.laurel.defaultComponents;
                    for (let view of components) {
                        window.laurel.renderComponent(view.route, view.element);
                        if (view.element == components[components.length - 1].element) {
                            let script = document.createElement("script");
                            script.src = "app/libs/template_files/js/main.js";
                            document.body.appendChild(script);
                        }
                    }
                    var interval = setInterval(() => {
                        setTimeout(() => {
                            clearInterval(interval);
                        }, 2000);
                        laurel.configureUserCredentials(laurel.credentials);
                    }, 100);
                },
                configureUserCredentials: (data) => {
                    let access = "",
                        namerol,
                        rol = parseInt(data.rol);
                    laurel.getById("image-profile").src = laurel.url + data.image;
                    laurel.getById("name-profile").textContent = data.name;
                    laurel.getById("email-profile").textContent = data.email;
                    laurel.getById("rol-profile").textContent = rol === 1 ? "Administrador" : rol === 2 ? "Coordinador" : "Conductor";
                    namerol = rol === 1 ? "admin" : rol === 2 ? "coo" : "conductor";
                    access = document.getElementsByClassName("item");
                    for (let element of access) {
                        if (element.classList.contains(namerol)) {
                            element.style.visibility = "visible";
                        } else {
                            element.outerHTML = "";
                        }
                    };

                },
                hideDefaultComponents: () => {
                    let contador = 0;
                    for (let view of window.laurel.defaultComponents) {
                        document.getElementById("app").style.display = "none";
                        document.getElementById(view.element).innerHTML = "";
                    }
                    laurel.fetch("app/views/auth/login.html", "GET", (data) => {
                        document.getElementById("default-view").innerHTML = data;
                        controllers["user"].initValidate();
                        laurel.currentController = controllers["user"];
                    }, '', 'text')
                },

                fetch: (url, method, callback, data = undefined, type = "json") => {
                    var options = { method: method };
                    typeof data !== undefined && data !== "" ? options.body = data : false;
                    fetch(url, options)
                        .then(response => type == "json" ? response.json() : response.text())
                        .then(result => callback(result));
                },
                verifyAuthentication: async() => {
                    laurel.fetch(vars.urlApi + "auth/see", "GET", (data) => {
                        if (typeof data.activeSession !== 'undefined') {
                            laurel.credentials = data.user_data_credentials;
                            laurel.callDefaultComponents();
                            laurel.handlerRoute();
                            return laurel.authentication = true;
                        } else {
                            window.location.hash = "#/auth/login";
                            laurel.hideDefaultComponents()
                            return laurel.authentication = false;
                        }
                    });
                },


                handlerRoute: () => {
                    let hash = window.location.hash.substring(1) || "/";
                    var uri_obj = routes[hash];
                    if (uri_obj && uri_obj.templates) {
                        if (typeof(uri_obj.action) === "function") {
                            if (uri_obj.templates.length === 0) {
                                laurel.currentController = controllers[uri_obj.controller];
                                uri_obj.action()
                                return;
                            }
                        }
                        frame.innerHTML = "";
                        uri_obj.templates.map(function(uri_template, i) {
                            fetch(uri_template)
                                .then((response) => response.text())
                                .then((text) => {
                                    frame.innerHTML += text;
                                    if (i < 1) {
                                        if (uri_obj.controller) {
                                            laurel.currentController = controllers[uri_obj.controller];
                                        }
                                        if (typeof(uri_obj.action) === "function") {
                                            uri_obj.action();
                                        }
                                    }

                                });
                        });
                    } else {
                        window.location.hash = '#/auth/login';
                    }
                }


            };
            return library;
        };


        if (typeof window.laurel === "undefined") {
            window.laurel = start();
            window.addEventListener("hashchange", laurel.handlerRoute, false);
        } else {
            console.log("Libreria ya definida")
        }

        const initLaurel = async(e) => {
            vars.getUrlApi();
            laurel.loader = vars.loader;
            laurel.defaultComponents = vars.defaultComponents
            await laurel.verifyAuthentication();
            window.laurel = laurel;
        };

        window.addEventListener("load", initLaurel);

    });
})(window, document);