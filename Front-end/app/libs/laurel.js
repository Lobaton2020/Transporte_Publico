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
                url : '',
                loader: '',
                defaultComponents: [],
                currentController: '',
                authentication : false,

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
                        .then((text) => { elem.innerHTML = text });
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
                    for (let view of window.laurel.defaultComponents) {
                        console.log(view)
                        window.laurel.renderComponent(view.route, view.element);
                    }
                },
                fetch: (url, method, callback, data = undefined,type = "json") => {
                    var options = { method: method };
                        typeof data !== undefined  && data !== "" ? options.body = data : false;
                    fetch(url, options)
                        .then(response => type == "json" ?  response.json() :  response.text())
                        .then(result => callback(result));
                },

                verifyAuthentication: () => {
                    laurel.fetch(vars.urlApi + "auth/see","GET",(data)=>{
                        if(typeof data.activeSession !== 'undefined'){
                            laurel.handlerRoute();
                            return laurel.authentication = true;
                        }else{
                            return laurel.authentication = false;
                        }
                    });
                },

                showViewCustom: (url,paramcontroller)=>{
                    laurel.fetch(url,"GET",(data)=>{
                        frame.innerHTML = data;
                        laurel.currentController = controllers[paramcontroller];
                        return controllers[paramcontroller].initValidate();
                    },"","text");
                    
                },

                handlerRoute: () => {
                    let hash = window.location.hash.substring(1) || "/";
                    var uri_obj = routes[hash];

                    if (uri_obj && uri_obj.templates) {
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
            // laurel.verifyAuthentication() ;
            window.addEventListener("hashchange", laurel.handlerRoute, false);
        } else {
            console.log("Libreria ya definida")
        }
        
        const initLaurel = (e) => {
            laurel.url = vars.urlApi;
            laurel.loader = vars.loader;
            laurel.defaultComponents = vars.defaultComponents
            laurel.callDefaultComponents();
            laurel.handlerRoute();
            window.laurel = laurel;
        };

        window.addEventListener("load", initLaurel);

    });
})(window, document);