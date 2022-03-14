sap.ui.define([
    'tcs/fin/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("tcs.fin.ap.controller.View2", {
        //This is our app controller 😊
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            //Whenever we click a fruit, the route is changing
            //this change of route we need to handle via event
            //so here we attaching a event to a function
            //whenever route change, call my function herculis
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        },
        herculis: function (oEvent) {
            var fruitId = oEvent.getParameter("arguments").fruitId;
            var sPath = '/' + fruitId;
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    expand: 'To_Supplier'
                }
            });
            //debugger;
        },
        onNavNextRow: function (oEvent) {
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            MessageToast.show(sPath);
            //TODO: Implement level3 navigationt to another view Supplier

        },
        oSupplierPopup: null,
        oCityPopup: null,
        oField: null,
        onFilter: function () {

            //PBO when we create go_alv - IF go_alv IS NOT BOUND
            var that = this;
            if (!this.oSupplierPopup) {
                Fragment.load({
                    id: "supplier",
                    controller: this,
                    name: "tcs.fin.ap.fragments.popup"
                }).then(function (oDialog) {
                    //Inside the callbacks/promise functions we will not be able to access global variable this
                    //oSupplierPopup is the remote control of our fragment
                    that.oSupplierPopup = oDialog;
                    //We use remote control - object to set the title
                    that.oSupplierPopup.setTitle("Supplier Details");
                    //Authorize the access of fragment to the model using view
                    that.getView().addDependent(oDialog);
                    //Binding the items to the supplier entity of local json model using 4th syntax
                    //check the ManagedObject class in control hierarachy for the method
                    that.oSupplierPopup.bindAggregation("items", {
                        path: '/suppliers',
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{city}"
                        })
                    });
                    //Open popup
                    that.oSupplierPopup.open();
                });
            } else {
                this.oSupplierPopup.open();
            }

            //MessageToast.show("This functionality is under construction");
        },
        onF4Help: function (oEvent) {
            this.oField = oEvent.getSource();
            var that = this;
            if (!this.oCityPopup) {
                Fragment.load({
                    id: "city",
                    controller: this,
                    name: "tcs.fin.ap.fragments.popup"
                }).then(function (oDialog) {
                    that.oCityPopup = oDialog;
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.setTitle("Cities");
                    that.oCityPopup.setMultiSelect(false);
                    that.oCityPopup.bindAggregation("items", {
                        path: '/ProductSet',
                        template: new sap.m.DisplayListItem({
                            label: '{To_Supplier/COMPANY_NAME}',
                            value: '{To_Supplier/CITY}'
                        })
                    });
                    that.oCityPopup.open();
                })
            } else {
                this.oCityPopup.open();
            }
            //MessageToast.show("This functionality is under construction");
        },
        onItemSelect: function (oEvent) {
            var sId = oEvent.getSource().getId();
            if (sId.indexOf("city") !== -1) {
                //1: get the object of the selected item by user
                var oSelItem = oEvent.getParameter("selectedItem");
                //2: Get the value from the list item
                var sText = oSelItem.getLabel();
                //3: Change the value back
                this.oField.setValue(sText);
            } else {
                var aFilters = [];
                var aItems = oEvent.getParameter("selectedItems");
                for (let i = 0; i < aItems.length; i++) {
                    const element = aItems[i];
                    var oFilter = new Filter("name", FilterOperator.EQ, element.getLabel());
                    aFilters.push(oFilter);
                }
                var oFilterFinal = new Filter({
                    filters: aFilters,
                    and: false
                });
                this.getView().byId("idTab").getBinding("items").filter(oFilterFinal);

            }

        },
        onSave: function () {
            MessageBox.confirm("Do you want to save?", {
                title: "Confirmation for Save",
                onClose: function (status) {
                    if (status === "OK") {
                        MessageToast.show("Your order has been placed successfully!");
                    } else {
                        MessageBox.alert("Could not save");
                    }
                }
            });
        },
        onPrintSelect: function () {
            var oDD = this.getView().byId("mcb");
            var aItems = oDD.getSelectedItems();
            for (let i = 0; i < aItems.length; i++) {
                const element = aItems[i];
                console.log(element.getKey());
            }
        },
        onCancel: function () {
            MessageBox.error("Failed to save");
        },
        onBack: function () {
            //Go to the parent now -appCon object is obtained
            var oAppCon = this.getView().getParent();
            //Using the parent we go to child = navigate to another child
            oAppCon.to("idView1");
        }
    });
});