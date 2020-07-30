(function(window, document) {

    document.addEventListener("DOMContentLoaded", () => {


        laurel.getBy('vista').router()
            .route("/", ["app/views/init.html"], null, null)
            .route("/error404", ["app/views/templates/error404.html"], null, null)
            .route("/auth/login", ["app/views/auth/login.html"], null, null)
            .route("/auth/logout", [], "user", function() {
                laurel.getController().logout();
            })
            // user
            .route("/conductor/bus", ["app/views/routebus/bus.html"], "routebus", function() {
                laurel.getController().getbus();
            })
            .route("/conductor/rutas", ["app/views/routebus/routes.html"], "routebus", function() {
                laurel.getController().listroutes();
            })
            .route("/user/list", ["app/views/user/list.html"], "user", function() {
                laurel.getController().list()
            })
            .route("/user/create", ["app/views/user/create.html"], "user", function() {
                laurel.getController().listRoles();
            })
            .route("/user/update", ["app/views/user/update.html"], null, null)
            //bus
            .route("/bus/create", ["app/views/bus/register.html"], null, null)
            .route("/bus/list", ["app/views/bus/list.html"], null, null)
            //contract
            .route("/contract/list", ["app/views/contract/renew.html"], null, null)
            .route("/contract/create", ["app/views/contract/save.html"], null, null)
            //route
            .route("/route/create", ["app/views/route/save.html"], null, null)
            .route("/route/list", ["app/views/route/update.html"], null, null)
            //routebus
    });



})(window, document);