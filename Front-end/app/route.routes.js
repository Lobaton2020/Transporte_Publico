(function(window, document) {

    document.addEventListener("DOMContentLoaded", () => {
        
        // console.log(laurel);
        // laurel.getBy('vista').router().showViewCustom("app/views/bus/list.html","user");
        // setTimeout(() => {
        //     if(!laurel.authentication){
        //         laurel.getBy('vista').router().showViewCustom("app/views/auth/login.html","user");
        //         return;
        //     }
        //     }, 1000);

        laurel.getBy('vista').router()
            .route("/", ["app/views/init.html"], null, null)
            .route("/error404", ["app/views/templates/error404.html"], null, null)
            .route("/inicio", ["app/views/init.html"], null, null)
            // user
            .route("/user/list", ["app/views/user/list.html"], "user", ()=>{laurel.getController().list()})
            .route("/user/create", ["app/views/user/create.html"], "user", function() {
                laurel.getController().listRoles();
            })
            .route("/user/list", ["app/views/user/list.html"], "user", () => {})
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
            .route("/routebus/list", ["app/views/routebus/save.html"], null, null)
            .route("/routebus/create", ["app/views/routebus/update.html"], null, null)            
            .route("/auth/login", ["app/views/auth/login.html"], null, null)
            });
        

        
    })(window, document);

