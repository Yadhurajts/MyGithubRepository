sap.ui.define([
    'tcs/fin/ap/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("tcs.fin.ap1.controller.View1", {
        //This is our app controller 😊
        onInit: function () {
            //Get the object of Component.js and from there get the object of Router
            this.oRouter = this.getOwnerComponent().getRouter();

        },
        onItemSelect: function (oEvent) {
            //Step 1: The item on which user does selection
            var oListItem = oEvent.getParameter("listItem");
            //Step 2: Get the path of this item - the path of the element = /fruits/index
            var sPath = oListItem.getBindingContextPath();
            //Step 3: Get The View2 Object
            //var oView2 = this.getView().getParent().getPages()[1];
            //Obtain SPLIT APP Container object View -> Master Section -> Split App
            // var oAppCon = this.getView().getParent().getParent();
            // //Get the Child object which is inside detail section
            // var oView2 = oAppCon.getDetailPage("idView2");
            // //Step 4: Bind the path to view 2 object
            // oView2.bindElement(sPath);
            // console.log(sPath);
            //Navigate to View 2
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.onNext(sIndex);
        },
        onDelete: function (oEvent) {
            //TODO: Delete all selected items
            //Step 1: Get All the items selected by user
            var oList = this.getView().byId("idListFruit");
            var aItems = oList.getSelectedItems();
            //Step 2: Loop over them, access each item one by one
            for (let i = 0; i < aItems.length; i++) {
                const element = aItems[i];
                //Step 3: Get the list object and delete them
                oList.removeItem(element);
            }

        },
        onSearch: function (oEvent) {
            //Step 1: get the value which user searched on field
            var sValue = oEvent.getParameter("query");
            //Step 2: Create a filter object
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sValue);
            var oFilter2 = new Filter("type", FilterOperator.Contains, sValue);
            var oFilter = new Filter({
                filters: [oFilter1, oFilter2]
            });
            //Step 3: Use the filter object and inject the same to the list binding
            var oList = this.getView().byId("idListFruit");
            oList.getBinding("items").filter(oFilter1);
        },
        onItemDelete: function (oEvent) {
            //Step 1: get the item on which delete was fired
            var oItemToBeDeleted = oEvent.getParameter("listItem");
            //Step 2: get the list control object
            //var oList = this.getView().byId("idList");
            //If the control you need belongs to same event, we can write code which is ID independent
            var oList = oEvent.getSource();
            //Step 3: delete the item from list control
            oList.removeItem(oItemToBeDeleted);
        },
        onNext: function (sIndex) {
            //Next we will use Router object to navigate
            this.oRouter.navTo("detail", {
                fruitId: sIndex
            });

            //Go to the parent now -appCon object is obtained
            //var oAppCon = this.getView().getParent();
            //Using the parent we go to child = navigate to another child
            ///oAppCon.to("idView2");
        },
        onAdd: function () {
            this.oRouter.navTo("add");
        }
    });
});