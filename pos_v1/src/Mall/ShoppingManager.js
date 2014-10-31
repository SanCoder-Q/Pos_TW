//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

//static class for shopping manager
Mall.ShoppingManager = (function(){
  //pravite:
  var _currentShoppingCart = null;
  var publicReturn = {
    //public:
    initShoppingCart: function(barcodeList){
      //parameter validation
      Util.Validate.paraNumValidate(arguments, 1);
      Util.Validate.nullValidate(arguments);

      if(_currentShoppingCart == null)
        _currentShoppingCart = new ShoppingCart(barcodeList);
    },

    getCurrentShoppingCart: function(){
      return _currentShoppingCart;
    }
  };
  return publicReturn;
})();
