//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

//output
function printInventory(barcodeList) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 1);
  Util.Validate.nullValidate(arguments);

  //not well here!
  Mall.ShoppingManager.initShoppingCart(barcodeList);

  var inventory = new Inventory(Mall.ShoppingManager.getCurrentShoppingCart());
  inventory.print();
}
