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
                    return result.response.type;
                }
            });
    },
    update: async function(datos, id) {
        return fetch(this.url + `user/update/text/${id}`, {
                method: "post",
                body: datos
            })
            .then(response => response.json())
            .then(result => {
                if (result.response.type == "updated") {
                    return true;
                } else {
                    return result.response.type;
                }
            });
    },
    get: async function(id) {
        return fetch(this.url + `user/get/${id}`)
            .then(response => response.json())
            .then(result => result);
    },
    see: async function() {
        return fetch(this.url + `auth/see`)
            .then(response => response.json())
            .then(result => result);
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
    },
    logout: async function() {
        return fetch(this.url + "auth/logout")
            .then(response => response.json())
            .then(result => result);
    }


};