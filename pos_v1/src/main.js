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
    }
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

      return null != Array.selectObjectInArray(_itemList, barcodeStr, 'barcode');
    }
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
        if(Array.selectObjectInArray(_promotions[i].barcodes, itemBarcodeStr) != null) {
          //未来应从工厂获取促销对象，应含有此处暂时由new代替
          promotionList.push(new Promotion(_promotions[i].type,
            Mall.PromotionManager.PromotionTypeEnum.GoodNumSpecificGood,
            Infinity,
            function(itemClass){
              //parameter validation
              Util.Validate.paraNumValidate(arguments, 1);
              Util.Validate.nullValidate(arguments);
              //计算该品种商品未参加活动的商品数量
              var noDiscountCount = 0;
              for(var j in itemClass.items)
                if(itemClass.items[j].discount == 0)
                  noDiscountCount++;
              //计算赠送数量及更新品类价格信息
              var discountNum = Math.floor(noDiscountCount / 3);
              itemClass.discount += discountNum;
              itemClass.price -= itemClass.itemInfo.price * itemClass.discount;
              for(var j = 0; j < discountNum; j++) {
                if(j >= itemClass.items.length)
                  throw "Promotion price calculation error";
                if(itemClass.items[j].discount != 0) {
                  discountNum++;
                  continue;
                }
                itemClass.items[j].discount = itemClass.itemInfo.price;
                itemClass.items[j].price -= itemClass.items[j].discount;
              }
            }
          ));
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
        var itemClass = shoppingList[i];
        //get all promotion of the item
        var promotionList = this.getPromotionListofAnItem(i);

        //遍历所有促销，更新价格。PS：没有促销优先级的情况下，直接遍历促销活动，有优先级应先排序促销活动，再进行遍历。
        for(var j in promotionList) {
          var promotion = promotionList[j];
          switch(promotion.type) {
            case Mall.PromotionManager.PromotionTypeEnum.GoodNumSpecificGood:
              //该类型促销计算参数为itemClass
              promotion.countPrice(itemClass);
              break;
            default:
              throw "Promotion type error";
          }
        }
        sumPrice += itemClass.price;
        sumDiscount += itemClass.originPrice - itemClass.price;
      }
      shoppingCart.setSumPrice(sumPrice);
      shoppingCart.setSumDiscount(sumDiscount);
    }
  };
  return publicReturn;
})();

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

//promotion type enumeration
Mall.PromotionManager.PromotionTypeEnum = {
  //整体价格条件
  EntiretyPercentEntirety     :0x00010001,  //整体折扣
  EntiretyOffEntirety         :0x00010002,  //整体满减
  //整体价格条件赠折
  EntiretyOffSpecificGood     :0x00020001,  //整体满赠/折指定物品，非指定的或品类制定的应给出选择商品用户接口
  //品类价格条件
  ClassPercentClass           :0x00030001,  //品类折扣
  ClassOffClass               :0x00030002,  //品类满减
  //品类价格条件赠折
  ClassOffSpecificGood        :0x00040001,  //品类满赠/折指定物品，非指定的或品类制定的应给出选择商品用户接口
  //单类价格条件
  GoodPricePercentGood        :0x00050001,
  GoodPriceOffGood            :0x00050002,
  //单类价格条件增折
  GoodPriceSpecificGood       :0x00060001,
  //单类数量条件
  GoodNumPercentGood          :0x00070001,
  GoodNumOffGood              :0x00070002,
  //单类数量条件增折
  GoodNumSpecificGood         :0x00080001
};

//Promotion class
function Promotion(promotionStr, promotionType, promotionPriority, countPriceCallBack) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 4);
  Util.Validate.nullValidate(arguments);
  Util.Validate.classValidate(countPriceCallBack, Function);

  //#public property:
  this.name = promotionStr;
  this.type = promotionType;
  this.priority = promotionPriority;
  //#public method:
  this.countPrice = countPriceCallBack; //parameter is a itemClass in ShoppingCart
}


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

//Invertory class
function Inventory(shoppingCart) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 1);
  Util.Validate.nullValidate(arguments);
  Util.Validate.classValidate(shoppingCart, ShoppingCart);

  //private field
  var _shoppingCart = shoppingCart;
  var _shopName = '没钱赚商店';
  var _outputStr = '';

  //public method
  this.printTitle = function() {
    _outputStr += '***<' + _shopName + '>购物清单***\n';
  };

  this.printDivider = function() {
    _outputStr += '----------------------\n';
  };

  this.printEndLine = function() {
    _outputStr += '**********************';
  };

  this.printPromotionTitle = function() {
    _outputStr += '挥泪赠送商品：\n';
  };

  this.printItemPart = function() {
    var shoppingList = _shoppingCart.getShoppingList();
    for(var i in shoppingList) {
      var itemClass = shoppingList[i];
      _outputStr +=
        '名称：' + itemClass.itemInfo.name +
        '，数量：' + itemClass.items.length + itemClass.itemInfo.unit +
        '，单价：' + itemClass.itemInfo.price.toFixed(2) +
        '(元)，小计：' + itemClass.price.toFixed(2) + '(元)\n';
    }
  };

  this.printPromotionPart = function() {
    var shoppingList = _shoppingCart.getShoppingList();
    for(var i in shoppingList) {
      var itemClass = shoppingList[i];
      if(itemClass.discount > 0)
        _outputStr +=
          '名称：' + itemClass.itemInfo.name +
          '，数量：' + itemClass.discount + itemClass.itemInfo.unit + '\n';
    }
  };

  this.printSummationPart = function() {
    _outputStr += '总计：' + _shoppingCart.getSumPrice().toFixed(2) + '(元)\n';
    _outputStr += '节省：' + _shoppingCart.getSumDiscount().toFixed(2) + '(元)\n';
  };

  this.getOutput = function() {
    return _outputStr;
  };
}

//output
function printInventory(barcodeList) {
  //parameter validation
  Util.Validate.paraNumValidate(arguments, 1);
  Util.Validate.nullValidate(arguments);

  Mall.ShoppingManager.initShoppingCart(barcodeList);
  var inventory = new Inventory(Mall.ShoppingManager.getCurrentShoppingCart());

  inventory.printTitle();
  inventory.printItemPart();
  inventory.printDivider();
  inventory.printPromotionTitle();
  inventory.printPromotionPart();
  inventory.printDivider();
  inventory.printSummationPart();
  inventory.printEndLine();

  console.log(inventory.getOutput());
  //statistics
}
