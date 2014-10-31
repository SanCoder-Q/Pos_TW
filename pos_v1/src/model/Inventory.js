//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

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
  this.getOutput = function() {
    return _outputStr;
  };

  this.print = function() {
    console.log(_outputStr);;
  };

  function printTitle() {
    _outputStr += '***<' + _shopName + '>购物清单***\n';
  }

  function printDivider() {
    _outputStr += '----------------------\n';
  }

  function printEndLine() {
    _outputStr += '**********************';
  }

  function printPromotionTitle() {
    _outputStr += '挥泪赠送商品：\n';
  }

  function printItemPart() {
    var shoppingList = _shoppingCart.getShoppingList();
    for(var i in shoppingList) {
      var itemClass = shoppingList[i];
      _outputStr +=
        '名称：' + itemClass.itemInfo.name +
        '，数量：' + itemClass.items.length + itemClass.itemInfo.unit +
        '，单价：' + itemClass.itemInfo.price.toFixed(2) +
        '(元)，小计：' + itemClass.price.toFixed(2) + '(元)\n';
    }
  }

  function printPromotionPart() {
    var shoppingList = _shoppingCart.getShoppingList();
    for(var i in shoppingList) {
      var itemClass = shoppingList[i];
      if(itemClass.discount > 0)
        _outputStr +=
          '名称：' + itemClass.itemInfo.name +
          '，数量：' + itemClass.discount + itemClass.itemInfo.unit + '\n';
    }
  }

  function printSummationPart() {
    _outputStr += '总计：' + _shoppingCart.getSumPrice().toFixed(2) + '(元)\n';
    _outputStr += '节省：' + _shoppingCart.getSumDiscount().toFixed(2) + '(元)\n';
  }

  function combine() {
    printTitle();
    printItemPart();
    printDivider();
    printPromotionTitle();
    printPromotionPart();
    printDivider();
    printSummationPart();
    printEndLine();
  }

  combine();
}
