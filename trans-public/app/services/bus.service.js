import vars from "../libs/vars.js";
export default {
    url: vars.urlApi,
    create: async function(datos) {
        return fetch(this.url + "bus/save", {
                method: "post",
                body: datos
            })
            .then(response => response.json())
            .then(result => {
                if (result.response.type == "registered") {
                    return true;
                } else {
                    return result.response.type.trim();
                }
            });
    },
    list: async function() {
        return fetch(this.url + "bus/all")
            .then(response => response.json())
            .then(result => result);
    },
};