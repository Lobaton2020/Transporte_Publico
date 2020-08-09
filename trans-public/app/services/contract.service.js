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
        const response = await fetch(this.url + "contract/save", this.optionsRequest(datos));
        const result = await response.json();
        return result.response.type == "registered" ? true : result.response.type;
    },
    update: async function(datos) {

        const response = await fetch(this.url + `contract/renew`, this.optionsRequest(datos));
        const result = await response.json();
        return result.response.type == "updated" ? true : result.response.type;
    },
    get: async function() {
        return fetch(this.url + `bus/exists`)
            .then(response => response.json())
            .then(result => result);
    },
    all: async function() {
        return fetch(this.url + `contract/all`)
            .then(response => response.json())
            .then(result => result);
    },
    list: async function() {
        return fetch(this.url + `contract/list`)
            .then(response => response.json())
            .then(result => result);
    }
};