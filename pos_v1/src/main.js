//SanCoder 2014-10-29
//TW homework: Pos_v1

//deep clone
Object.clone = function(obj) {
  var objClone = {};
  if(typeof obj !== "object")
    return obj;
  if(obj.constructor == Array)
    objClone = [];
  for(var i in obj) {
    objClone[i] = Object.clone(obj[i]);
  }
  return objClone;
};

//Select the object from an array.
//if parameters without key or key == null,
//this function treats the objectArray as an array,
//otherwise it treats the objectArray as an dictionary.
Array.selectObjectInArray = function(objectArray, value, key) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 2, 3);
  Util.Validate.nullValidate(objectArray, value);

  //overload the method
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
};

var Util = {};

//static class for validate
Util.Validate = (function(){
  //pravite:

  var publicReturn = {
    //public:
    //validate the parameter(s).
    //The number of parameters can be any value,
    //and if there is only one parameter, it is treated as a parameter array.
    nullValidate: function() {
      if(arguments.length == 1 && arguments[0].callee != null) {
        for(var i in arguments[0])
          if(arguments[0][i] == null)
            throw "NullValidate: Parameter cannot be null in function: " + /function\s+(\w+)/.exec(arguments.callee.caller)[1];
      }
      else {
        for(var i in arguments)
          if(arguments[i] == null)
            throw "NullValidate: Parameter cannot be null in function: " + /function\s+(\w+)/.exec(arguments.callee.caller)[1];
      }
    },
    //validate the number of parameters
    //The first parameter must be the 'arguments' object of the caller,
    //the second and the third parameters are the minimum and maximum of the expected parameter number of the caller.
    //if there is no upbound of the parameter number, make the maxNum = Infinity.
    //if use this method with two parameters, the second parameters would be treated as not only minNum but also maxNum.
    paraNumValidate: function(args, minNum, maxNum) {
      if(arguments.length != 3 && arguments.length != 2)
        throw "ParaNumValidate: Parameter number error in function: Util.Validate.paraNumValidate";
      this.nullValidate(arguments);
      if(arguments.length == 2)
        maxNum = minNum;
      if(minNum > maxNum)
        throw "ParaNumValidate: Parameter number error in function: Util.Validate.paraNumValidate";
      if(args.length < minNum || args.length > maxNum)
        throw "ParaNumValidate: Parameter number error in function: " + /function\s+(\w+)/.exec(arguments.callee.caller)[1];
    },
    //validate the class of the object
    classValidate: function(obj, expectClass) {
      this.paraNumValidate(arguments, 2);
      this.nullValidate(arguments);
      if(!(obj instanceof expectClass))
        throw "ClassValidate: The object is not an instance of the expect class in funciton: " + /function\s+(\w+)/.exec(arguments.callee.caller)[1];
    },
  };
  return publicReturn;
})();

var Mall = {};

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

      return null == Array.selectObjectInArray(_itemList, barcodeStr, 'barcode');
    },
  };
  return publicReturn;
})();

//static class for promotion manager
Mall.PromotionManager = (function(){
//pravite:
  var _promotions = loadPromotions();
  var publicReturn = {
    //#public method:
    getItemListOfAPromotion: function(promotionTypeStr) {
      //parameter validation
      Util.Validate.paraNumValidate(arguments, 1);
      Util.Validate.nullValidate(arguments);

      for(var i in _promotions) {
        var promotion = _promotions[i];
        if(promotion.type == promotionTypeStr)
          return promotion.barcodes;
      }

      throw "Wrong promotion type: " + promotionTypeStr;
    },

    getPromotionListofAnItem: function(itemBarcodeStr) {
      //parameter validation
      Util.Validate.paraNumValidate(arguments, 1);
      Util.Validate.nullValidate(arguments);
      if(!Mall.ItemManager.validateItemBarcode(itemBarcodeStr))
        return null;

      var promotionList = [];
      for(var i in _promotions) {
        if(Array.selectObjectInArray(_promotions[i].barcodes, itemBarcodeStr != null)) {
          promotionList.push(_promotions[i].type);
        }
      }

      return promotionList;
    },

    //Counting every item price and discount
    countPrice: function(shoppingCart) {
      //parameter validation
      Util.Validate.paraNumValidate(arguments, 1);
      Util.Validate.nullValidate(arguments);
      Util.Validate.classValidate(shoppingCart, ShoppingCart);

      var shoppingList = shoppingCart.getShoppingList();
      var sumPrice = 0;
      var sumDiscount = 0;
      for(var i in shoppingList) {
        var item = shoppingList[i];
        if(item.isDiscount)
          item.discount = Math.floor(item.count / 3);
        item.discountPrice = item.discount * item.itemInfo.price;
        item.price = item.count * item.itemInfo.price - item.discountPrice;
        sumPrice += item.price;
        sumDiscount += item.discountPrice;
      }
      shoppingCart.setSumPrice(sumPrice);
      shoppingCart.setSumDiscount(sumDiscount);
    },
  };
  return publicReturn;
})();

//ShoppingCart class
function ShoppingCart(barcodeList, discountItemArray) {

  //parameter validation
  Util.Validate.paraNumValidate(arguments, 2);
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
    for(var i in barcodeList) {
      var strArray = barcodeList[i].split('-');
      var item = Array.selectObjectInArray(_itemList, strArray[0], 'barcode');
      var count = strArray.length > 1 ? parseInt(strArray[1], 10) : 1;
      if(typeof(_shoppingList[item.barcode]) == "undefined") {
        _shoppingList[item.barcode] = {'itemInfo':item,
          'count':count,
          'discount':0,
          'price':0,
          'discountPrice':0,
          'isDiscount':Array.selectObjectInArray(discountItemArray, item.barcode) != null
        };
      }
      else {
        _shoppingList[item.barcode].count += count;
      }
    }
  }

  //#constructor logic:
  initialize();
  Mall.PromotionManager.countPrice(this);
}

//output
function printInventory(barcodeList) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 1);
  Util.Validate.nullValidate(arguments);

  //initial output string
  var outputStr = '';

  //initial discountList
  var discountList = Mall.PromotionManager.getItemListOfAPromotion('BUY_TWO_GET_ONE_FREE');

  //initial shoppingList
  var shoppingCart = new ShoppingCart(barcodeList, discountList);
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
