//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

//Item class
function Item(itemInfo, itemID) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 2);
  Util.Validate.nullValidate(arguments);

  //#public property:
  this.itemID = itemID;
  this.itemInfo = itemInfo;
  this.originPrice = itemInfo.price;
  this.price = itemInfo.price;
  this.discount = 0;
  this.relatedPromotionList = [];
}
