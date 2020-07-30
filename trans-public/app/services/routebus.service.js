import vars from "../libs/vars.js";

export default {
    url: vars.urlApi,
    get: async function() {
        return fetch(this.url + `bus/exists`)
            .then(response => response.json())
            .then(result => result);
    },
    all: async function() {
        return fetch(this.url + `routebus/all`)
            .then(response => response.json())
            .then(result => result);
    }

};