(function(window, document) {

    document.addEventListener("DOMContentLoaded", () => {

        laurel.getBy('vista').router()
            .route("/", ["app/views/init.html"], null, null)
            .route("/error404", ["app/views/templates/error404.html"], null, null)
            // auth
            .route("/auth/login", ["app/views/auth/login.html"], null, null)
            .route("/auth/logout", [], "user", function() {
                laurel.getController().logout();
            })
            // conductor
            .route("/conductor/bus", ["app/views/routebus/bus.html"], "routebus", function() {
                laurel.getController().getbus();
            })
            .route("/conductor/rutas", ["app/views/routebus/routes.html"], "routebus", function() {
                laurel.getController().listroutes();
            })
            // user
            .route("/user/list", ["app/views/user/list.html"], "user", function() {
                laurel.getController().list()
            })
            .route("/user/create", ["app/views/user/create.html"], "user", function() {
                laurel.getController().listRoles();
            })
            //bus
            .route("/bus/create", ["app/views/bus/create.html"], "bus", function() {
                laurel.getController().activeForm();
            })
            .route("/bus/list", ["app/views/bus/list.html"], "bus", function() {
                laurel.getController().list();
            })
            //route
            .route("/route/create", ["app/views/route/create.html"], "route", function() {
                laurel.getController().initForm();
            })
            .route("/route/list", ["app/views/route/list.html"], "route", function() {
                laurel.getController().list();
            })
            .route("/route/asign", ["app/views/routebus/create.html"], "routebus", function() {
                laurel.getController().initFormAsign();
            })
            .route("/route/asign/list", ["app/views/routebus/list.html"], "routebus", function() {
                laurel.getController().listRoutesUsers();
            })
            //contract
            .route("/contract/create", ["app/views/contract/create.html"], "contract", function() {
                laurel.getController().initForm();
            })
            .route("/contract/list", ["app/views/contract/list.html"], "contract", function() {
                laurel.getController().list();
            })
            .route("/employed/contract/see", ["app/views/contract/contracts.html"], "contract", function() {
                laurel.getController().enployedContract();
            })
    });



})(window, document);