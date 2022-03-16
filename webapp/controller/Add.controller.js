sap.ui.define([
    'tcs/fin/ap/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function (BaseController, JSONModel, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("tcs.fin.ap1.controller.Add", {
        //This is our app controller 😊
        onInit: function () {
            var oModel = new JSONModel();
            oModel.setData({
                "productData": {
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "DESCRIPTION": "",
                    "SUPPLIER_ID": "0100000046",
                    "SUPPLIER_NAME": "SAP",
                    "TAX_TARIF_CODE": "1 ",
                    "MEASURE_UNIT": "EA",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "USD",
                    "DIM_UNIT": "CM"
                },
                "SUPPLIER_NAME": ""
            });
            this.getView().setModel(oModel, "local");
            this.oLocalModel = oModel;
        },
        onSave: function () {
            //Get the payload from local model
            var payload = this.oLocalModel.getProperty("/productData");
            //Validate the data
            if (payload.PRODUCT_ID === "" || payload.NAME === "") {
                MessageBox.error("Input validation failed");
                return;
            }
            //Get the access of OData model
            var oDataModel = this.getView().getModel();
            //Fire the OData create request on ProductSet with our payload
            if (this.mode === 'create') {
                oDataModel.create("/ProductSet", payload, {
                    //Handle the response using callbacks- Success
                    success: function () {
                        MessageToast.show("Succesfully created Product");
                    },
                    //Handle the response using callbacks- Error
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                })
            } else {
                //here we need to update the data by its key
                var { PRODUCT_ID } = payload;
                var sPath = "/ProductSet('" + PRODUCT_ID + "')";
                oDataModel.update(sPath, payload, {
                    //Handle the response using callbacks- Success
                    success: function () {
                        MessageToast.show("Succesfully updated Product");
                    },
                    //Handle the response using callbacks- Error
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                })
            }
        },
        onClear: function () {
            this.oLocalModel.setProperty("/productData", {
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Notebooks",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000046",
                "SUPPLIER_NAME": "SAP",
                "TAX_TARIF_CODE": "1 ",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "USD",
                "DIM_UNIT": "CM"
            });
            this.setMode('create');
        },
        oField: null,
        oSupplierPopup: null,
        onF4Supplier: function (oEvent) {
            this.oField = oEvent.getSource();
            var that = this;
            if (!this.oSupplierPopup) {
                Fragment.load({
                    id: "supplier",
                    controller: this,
                    name: "tcs.fin.ap.fragments.popup",
                    type: "XML"
                }).then(function (oDialog) {
                    that.oSupplierPopup = oDialog;
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.setTitle("Supplier");
                    that.oSupplierPopup.setMultiSelect(false);
                    that.oSupplierPopup.bindAggregation("items", {
                        path: '/SupplierSet',
                        template: new sap.m.DisplayListItem({
                            label: '{BP_ID}',
                            value: '{COMPANY_NAME}'
                        })
                    });
                    that.oSupplierPopup.open();
                })
            } else {
                this.oSupplierPopup.open();
            }
        },
        onItemSelect: function (oEvent) {
            var sId = oEvent.getSource().getId();
            if (sId.indexOf("supplier") !== -1) {
                //1: get the object of the selected item by user
                var oSelItem = oEvent.getParameter("selectedItem");
                //2: Get the value from the list item
                var sText = oSelItem.getLabel();
                var sSupplierName = oSelItem.getValue();
                //3: Change the value back
                this.oField.setValue(sText);
                this.oLocalModel.setProperty("/SUPPLIER_NAME", sSupplierName);
            }
        },
        mode: 'create',
        setMode: function (sMode) {
            this.mode = sMode;
            if (this.mode === 'create') {
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("name").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
            } else {
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("name").setEnabled(false);
                this.getView().byId("idDelete").setEnabled(true);
            }
        },
        onSubmit: function (oEvent) {
            //Step1: Read the value entered by the user in input field
            var sValue = oEvent.getParameter("value");
            //Step2: Get the OData model object
            var oDataModel = this.getView().getModel();
            //Step3: Prepare the end point
            var sPath = "/ProductSet('" + sValue.toUpperCase() + "')";
            //Step4: Make the GET call- Single product data
            var that = this;
            oDataModel.read(sPath, {
                //Step5: Handle the response - Success
                success: function (data) {
                    that.oLocalModel.setProperty("/productData", data);
                    that.setMode('update');
                },
                //Step5: Handle the response - Error
                error: function (oError) {
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    that.onClear();
                    that.setMode('create');
                }
            });
        },
        onLoadExp: function () {
            //Step1: Read the product Category from drop down
            var sCategory = this.oLocalModel.getProperty("/productData/CATEGORY");
            //Step2: Get the oData model object
            var oDataModel = this.getView().getModel();
            this.getView().setBusy(true);
            //Step3: call the Function import - callFunction API in model
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct", {
                urlParameters: {
                    I_CATEGORY: sCategory
                },
                //Step4: Handle the response
                success: function (data) {
                    that.oLocalModel.setProperty("/productData", data);
                    that.setMode('update');
                    that.getView().setBusy(false);
                },
                //Step4: Handle the response
                error: function (oError) {
                    MessageBox.error("An error occuired");
                    that.getView().setBusy(false);
                }
            });


        },
        onDelete: function () {
            //Step1: Ask a confirmation
            MessageBox.confirm("Do you want to delete this product?", {
                onClose: this.onConfirmDelete.bind(this)
            });

        },
        onConfirmDelete: function (stats) {
            if (stats === "OK") {
                //Step1: Get the oData model object
                var oDataModel = this.getView().getModel();
                //Step2: Fire delete request for the product id
                var { PRODUCT_ID } = this.oLocalModel.getProperty("/productData");
                var sPath = "/ProductSet('" + PRODUCT_ID + "')";
                //Step3: Trigger Delete request
                var that = this;
                oDataModel.remove(sPath, {
                    success: function () {
                        MessageToast.show("Delete has been done");
                        that.onClear();
                    },
                    error: function () {

                    }
                })
            }
        }
    });
});