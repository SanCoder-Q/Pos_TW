//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

//static class for product manager
Mall.ItemManager = (function(){
  //pravite:
  var _itemList = loadAllItems();
  var publicReturn = {
    //public:
    getItemList: function(){
      return Object.clone(_itemList);
    },
    //validate whether the barcode exists
    validateItemBarcode: function(barcodeStr) {
      //parameter validation
      Util.Validate.paraNumValidate(arguments, 1);
      Util.Validate.nullValidate(arguments);

      return null != Array.selectObjectInArray(_itemList, barcodeStr, 'barcode');
    }
  };
  return publicReturn;
})();
