//SanCoder 2014-10-29
//TW homework: Pos_v1

var Util = {};

//static class for validate
Util.Validate = (function(){
  var publicReturn = {
    //public:
    //validate the parameter(s).
    //The number of parameters can be any value,
    //and if there is only one parameter, it is treated as a parameter array.
    nullValidate: function() {
      if(arguments.length == 1)
        for(var i in arguments[0])
          if(arguments[0][i] == null)
            throw "NullValidate: Parameter cannot be null in function:" + /function\s+(\w+)/.exec(arguments.callee.caller)[1];
      else
        for(var i in arguments)
          if(arguments[i] == null)
            throw "NullValidate: Parameter cannot be null in function:" + /function\s+(\w+)/.exec(arguments.callee.caller)[1];
    },
  };
  //pravite:

  return publicReturn;
})();

//ShoppingCart class
function ShoppingCart(itemArray, barcodeList, discountItemArray) {

  //parameter validation
  Util.Validate.nullValidate(arguments);

  //#private field:
  var _shoppingList = new Array(); //a dictionary with the barcode is the key
  var _sumPrice = 0;
  var _sumDiscount = 0;

  //#public method:
  this.getShoppingList = function(){ return _shoppingList; }; //it seem that there isn't a way to define a prototype method which can access the private member in JS. what a pity!
  this.getSumPrice = function(){ return formatMoney(_sumPrice); };
  this.getSumDiscount = function(){ return formatMoney(_sumDiscount); };

  //#private method:
  function formatMoney(price) {
    return Math.round(price * 100) / 100;
  }

  //initialize the _shoppingList
  function initialize() {
    //Initial the shoppingList
    for(var i in barcodeList) {
      var strArray = barcodeList[i].split('-');
      var item = selectObjectInArray(itemArray, strArray[0], 'barcode');
      var count = strArray.length > 1 ? parseInt(strArray[1], 10) : 1;
      if(typeof(_shoppingList[item.barcode]) == "undefined") {
        _shoppingList[item.barcode] = {'itemInfo':item,
          'count':count,
          'discount':0,
          'price':0,
          'discountPrice':0,
          'isDiscount':selectObjectInArray(discountItemArray, item.barcode) != null
        };
      }
      else {
        _shoppingList[item.barcode].count += count;
      }
    }
  }

  //Counting every item price and discount
  function countPrice() {
    for(var i in _shoppingList) {
      var item = _shoppingList[i];
      if(item.isDiscount)
        item.discount = Math.floor(item.count / 3);
      item.discountPrice = item.discount * item.itemInfo.price;
      item.price = item.count * item.itemInfo.price - item.discountPrice;
      _sumPrice += item.price;
      _sumDiscount += item.discountPrice;
    }
  }

  //Select the object from an array.
  //if parameters without key or key == null,
  //this function treats the objectArray as an array,
  //otherwise it treats the objectArray as an dictionary.
  function selectObjectInArray(objectArray, value, key) {
    //parameter validation
    Util.Validate.nullValidate(objectArray, value);

    if(arguments.length < 2 || arguments.length > 3)
      throw "Parameter error in function:" + /function\s+(\w+)/.exec(arguments.callee)[1];

    if(arguments.length == 2 || key == null) {
      for(var i in objectArray)
        if(objectArray[i] == value)
          return objectArray[i];
    }
    else{
      for(var i in objectArray)
        if(objectArray[i][key] == value)
          return objectArray[i];
    }
    return null;
  }

  //#constructor logic:
  initialize();
  countPrice();
}


//output
function printInventory(barcodeList) {
  //parameter validation
  Util.Validate.nullValidate(arguments);

  //initial output string
  var outputStr = '';

  //initial discountList
  var discountList;
  var blocks = loadPromotions();
  for(var i in blocks) {
    if(blocks[i].type == 'BUY_TWO_GET_ONE_FREE') {
      discountList = blocks[i].barcodes;
      break;
    }
  }

  //initial shoppingList
  var shoppingCart = new ShoppingCart(loadAllItems(), barcodeList, discountList);
  var shoppingList = shoppingCart.getShoppingList();

  outputStr += '***<没钱赚商店>购物清单***\n';

  //goods traversal, statistics count
  var discountStr = '----------------------\n挥泪赠送商品：\n';
  for(var i in shoppingList) {
    var item = shoppingList[i];
    outputStr += '名称：' + item.itemInfo.name + '，数量：' + item.count + item.itemInfo.unit + '，单价：' + item.itemInfo.price.toFixed(2) + '(元)，小计：' + item.price.toFixed(2) + '(元)\n';
    if(item.discount > 0)
      discountStr += '名称：' + item.itemInfo.name + '，数量：' + item.discount + item.itemInfo.unit + '\n';
  }

  outputStr += discountStr;
  outputStr += '----------------------\n';
  outputStr += '总计：' + shoppingCart.getSumPrice().toFixed(2) + '(元)\n';
  outputStr += '节省：' + shoppingCart.getSumDiscount().toFixed(2) + '(元)\n';
  outputStr += '**********************';
  console.log(outputStr);
  //statistics
}
