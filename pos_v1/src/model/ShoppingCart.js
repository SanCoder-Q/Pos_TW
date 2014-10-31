//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

//ShoppingCart class
function ShoppingCart(barcodeList) {

  //parameter validation
  Util.Validate.paraNumValidate(arguments, 1);
  Util.Validate.nullValidate(arguments);

  //#private field:
  var _itemList = Mall.ItemManager.getItemList();
  var _shoppingList = new Array(); //a dictionary with the barcode is the key
  var _sumPrice = 0;
  var _sumDiscount = 0;

  //#public method:
  this.getShoppingList = function(){ return _shoppingList; }; //it seem that there isn't a way to define a prototype method which can access the private member in JS. what a pity!
  this.getSumPrice = function(){ return formatMoney(_sumPrice); };
  this.setSumPrice = function(value){
    Util.Validate.nullValidate(value);
    _sumPrice = value;
  };
  this.getSumDiscount = function(){ return formatMoney(_sumDiscount); };
  this.setSumDiscount = function(value){
    Util.Validate.nullValidate(value);
    _sumDiscount = value;
  };

  //#private method:
  function formatMoney(price) {
    return Math.round(price * 100) / 100;
  }

  //initialize the _shoppingList
  function initialize() {
    //Initial the shoppingList
    var itemID = 0;
    for(var i in barcodeList) {
      var strArray = barcodeList[i].split('-');
      var itemInfo = Array.selectObjectInArray(_itemList, strArray[0], 'barcode');
      var count = strArray.length > 1 ? parseInt(strArray[1], 10) : 1;
      if(typeof(_shoppingList[itemInfo.barcode]) == "undefined") {
        _shoppingList[itemInfo.barcode] = {'itemInfo':itemInfo,
          'given':0,
          'originPrice':count * itemInfo.price,
          'price':count * itemInfo.price,
          'discount':0,
          'items':[],
        };
      }
      else {
        _shoppingList[itemInfo.barcode].price += itemInfo.price * count;
        _shoppingList[itemInfo.barcode].originPrice += itemInfo.price * count;
      }

      for(var j=0; j< count; j++) {
        var item = new Item(itemInfo, itemID);
        _shoppingList[itemInfo.barcode].items.push(item);
        itemID++;
      }
    }
  }

  //#constructor logic:
  initialize();
  Mall.PromotionManager.countPrice(this);
}
