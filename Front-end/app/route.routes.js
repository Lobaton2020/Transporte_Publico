(function(window, document) {
    document.addEventListener("DOMContentLoaded", () => {
        
        if(!laurel.authentication){

            laurel.getBy('vista').router().showViewCustom("app/views/auth/login.html");
            return;
        }

            laurel.getBy('vista').router()
            .route("/", ["app/views/init.html"], null, null)
            .route("/error404", ["app/views/templates/error404.html"], null, null)
            .route("/login", ["app/views/auth/login.html"], null, null)
            .route("/user/list", ["app/views/user/list.html"], "user", () => {
                laurel.getController().list();
            })
            .route("/user/create", ["app/views/user/create.html"], "user", function() {
                laurel.getController().listRoles();
            })
            .route("/bus/list", ["app/views/bus/list.html"], null, null)
            .route("/links", ["app/views/links/create.html", "app/views/links/list.html"], 'link', null);
            
        
    });
})(window, document);