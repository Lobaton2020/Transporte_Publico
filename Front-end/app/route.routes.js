(function(window, document) {
    lob.getId('vista').enrutar()
        .ruta("/", ["app/views/init.html"], null, null)
        .ruta("/login", ["app/views/auth/login.html"], null, null)
        .ruta("/user/list", ["app/views/user/list.html"], "user", function() {
            lob.getCtrl().list();
        })
        .ruta("/error404", ["app/views/templates/error404.html"], null, null)
        // rutas de los links
        .ruta("/bus/create", ["app/views/bus/list.html"], null, null)
        .ruta("/links", ["app/views/links/create.html", "app/views/links/list.html"], 'link', function() {
            lob.getCtrl().listar();
            lob.getId("form-tarea").noSubmit();
        });

})(window, document);