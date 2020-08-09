import vars from "../libs/vars.js";

export default {
    url: vars.urlApi,
    optionsRequest: function(data) {
        return {
            method: "POST",
            body: data
        }
    },

    validate: async function(datos) {
        const response = await fetch(this.url + "auth/login", this.optionsRequest(datos));
        const result = await response.json();
        return result.response.type == "logged" ? true : false;
    },
    create: async function(datos) {
        const response = await fetch(this.url + "user/save", this.optionsRequest(datos));
        const result = await response.json();
        return result.response.type == "registered" ? true : result.response.type;
    },
    update: async function(datos, id) {

        const response = await fetch(this.url + `user/update/text/${id}`, this.optionsRequest(datos));
        const result = await response.json();
        return result.response.type == "updated" ? true : result.response.type;
    },
    get: async function(id) {
        const response = await fetch(this.url + `user/get/${id}`);
        const result = await response.json();
        return result;
    },
    see: async function() {
        const response = await fetch(this.url + `auth/see`);
        const result = await response.json();
        return result;
    },
    drivers: async function(name) {
        const response = await fetch(this.url + `user/drivers/${name}`);
        const result = await response.json();
        return result;
    },
    users: async function(name) {
        const response = await fetch(this.url + `user/users/${name}`);
        const result = await response.json();
        return result;
    },
    list: async function() {
        const response = await fetch(this.url + "user/all");
        const result = await response.json();
        return result;
    },
    listRoles: async function() {
        const response = await fetch(this.url + "rol/all");
        const result = await response.json();
        return result;
    },
    logout: async function() {
        const response = await fetch(this.url + "auth/logout");
        const result = await response.json();
        return result;
    }


};