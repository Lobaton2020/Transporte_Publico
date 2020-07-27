import vars from "../libs/vars.js";

export default {
    url: vars.urlApi,
    users: [],
    link: [],
    validate: async function(datos) {
        return fetch(this.url + "auth/login", {
                method: "post",
                body: datos
            })
            .then(response => response.json())
            .then(result => {
                if (result.response.type == "logged") {
                    return true;
                } else {
                    return false;
                }
            });
    },
    create: async function(datos) {
        return fetch(this.url + "user/save", {
                method: "post",
                body: datos
            })
            .then(response => response.json())
            .then(result => {
                if (result.response.type == "registered") {
                    return true;
                } else {
                    return false;
                }
            });
    },
    list: async function() {
        return fetch(this.url + "user/all")
            .then(response => response.json())
            .then(result => result);
    },
    listRoles: async function() {
        return fetch(this.url + "rol/all")
            .then(response => response.json())
            .then(result => result);
    }


};