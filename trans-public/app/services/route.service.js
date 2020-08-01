import vars from "../libs/vars.js";

export default {
    url: vars.urlApi,
    get: async function(id) {
        return fetch(this.url + `route/get/${id}`)
            .then(response => response.json())
            .then(result => result);
    },
    all: async function() {
        return fetch(this.url + `route/all`)
            .then(response => response.json())
            .then(result => result);
    },
    create: async function(datos) {
        return fetch(this.url + "route/save", {
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
    }

};