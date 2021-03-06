import vars from "../libs/vars.js";

export default {
    url: vars.urlApi,
    optionsRequest: function(data) {
        return {
            method: "POST",
            body: data
        }
    },
    create: async function(datos) {
        const response = await fetch(this.url + "routebus/save", this.optionsRequest(datos));
        const result = await response.json();
        return result.response.type == "registered" ? true : result.response.type;
    },

    get: async function() {
        return fetch(this.url + `bus/exists`)
            .then(response => response.json())
            .then(result => result);
    },
    getRoutes: async function(value) {
        return fetch(this.url + `route/get/${value}`)
            .then(response => response.json())
            .then(result => result);
    },
    getBuses: async function(value) {
        return fetch(this.url + `bus/get/${value}`)
            .then(response => response.json())
            .then(result => result);
    },
    allByUser: async function() {
        return fetch(this.url + `routebus/byuser`)
            .then(response => response.json())
            .then(result => result);
    },
    all: async function() {
        return fetch(this.url + `routebus/all`)
            .then(response => response.json())
            .then(result => result);
    }
};