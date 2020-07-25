const UserService = { // este objeto es usado como clase
    url: "http://localhost/Proyecto_Transporte_Publico/Back-end/",
    users: [],
    link: [],
    crear: function(datos) {

        return new Promise(function(resolve, reject) {

            if (datos.url !== "") {
                LinkService.links.push(datos);
                resolve(true);
            } else {
                resolve(false);
            }

        });
    },
    list: async function() {
        return fetch(this.url + "user/all")
            .then(response => response.json())
            .then(result => result);
    }

};



export { UserService }