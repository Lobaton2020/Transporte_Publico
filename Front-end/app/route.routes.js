(function(window, document) {
    lob.getId('vista').enrutar()
        .ruta("/", ["app/views/init.html"], null, null)
        .ruta("/error404", ["app/views/templates/error404.html"], null, null)
        .ruta("/login", ["app/views/auth/login.html"], null, null)
        .ruta("/user/list", ["app/views/user/list.html"], "user", () => {

        })
        .ruta("/user/create", ["app/views/user/create.html"], "user", function() {
            lob.getCtrl().listRoles();
        })
        .ruta("/bus/list", ["app/views/bus/list.html"], null, null)
        .ruta("/links", ["app/views/links/create.html", "app/views/links/list.html"], 'link', null);

})(window, document);