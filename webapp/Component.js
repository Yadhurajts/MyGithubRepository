sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("tcs.fin.ap.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //like constructor of our component class
            //here we call the base class constructor super->constructor()
            sap.ui.core.UIComponent.prototype.init.apply(this);
            //Step 1: Get the router object from base class
            var oRouter = this.getRouter();
            //Step 2: We need to initialize the Router
            oRouter.initialize();
        },
        // createContent: function(){
            
        //     var oAppView = new sap.ui.view({
        //         id: "idAppView",
        //         viewName: "tcs.fin.ap.view.App",
        //         type: "XML"
        //     });

        //     //Create the objects of our newly created views
        //     var oView1 = new sap.ui.view({
        //         id: "idView1",
        //         viewName: "tcs.fin.ap.view.View1",
        //         type: "XML"
        //     });

        //     var oView2 = new sap.ui.view({
        //         id: "idView2",
        //         viewName: "tcs.fin.ap.view.View2",
        //         type: "XML"
        //     });

        //     //Obtain the Container object from Root view
        //     var oAppCon = oAppView.byId("appCon");

        //     //Add our views to the app container (Check Red Arrows in Diagram)
        //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);

        //     return oAppView;

        // },
        destroy: function(){

        }
    });
});