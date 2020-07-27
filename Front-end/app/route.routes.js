(function(window, document) {
    lob.getId('vista').enrutar()
        .ruta("/", ["app/views/init.html"], null, null)
        .ruta("/error404", ["app/views/templates/error404.html"], null, null)
        // auth
        .ruta("/login", ["app/views/auth/login.html"], null, null)
        // user
        .ruta("/user/up", ["app/views/user/update.html"], null, null)
        .ruta("/user/upda", ["app/views/user/updateimage.html"], null, null)
        .ruta("/user/update", ["app/views/user/updatepass.html"], null, null)
        .ruta("/user/list", ["app/views/user/list.html"], "user", () => {})
        .ruta("/user/create", ["app/views/user/create.html"], "user", function() {
            lob.getCtrl().listRoles();
        })
        //bus
        .ruta("/bus/create", ["app/views/bus/register.html"], null, null)
        .ruta("/bus/list", ["app/views/bus/list.html"], null, null)
        //contract
        .ruta("/contract/list", ["app/views/contract/renew.html"], null, null)
        .ruta("/contract/create", ["app/views/contract/save.html"], null, null)
        // .ruta("/contract/create", ["app/views/contract/register.html"], null, null)
        

        //route
        .ruta("/route/create", ["app/views/route/save.html"], null, null)
        .ruta("/route/list", ["app/views/route/update.html"], null, null)
        //routebus
        .ruta("/routebus/list", ["app/views/routebus/save.html"], null, null)
        .ruta("/routebus/create", ["app/views/routebus/update.html"], null, null)

})(window, document);
