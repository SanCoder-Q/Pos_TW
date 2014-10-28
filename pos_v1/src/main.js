//SanCoder 2014-10-27
//TW homework: Pos_v1

//Select the object from an array.
//if parameters without key or key == null,
//this function treats the objectArray as an array,
//otherwise it treats the objectArray as an dictionary.
function selectObjectInArray(objectArray, value, key) {
  //parameter validation
  if(arguments.length < 2 || arguments.length > 3)
    throw "Parameter error in function:" + /function\s+(\w+)/.exec(arguments.callee)[1];

  if(arguments.length == 2 || key == null) {
    for(var index in objectArray)
      if(objectArray[index] == value)
        return objectArray[index];
  }
  else{
    for(var index in objectArray)
      if(objectArray[index][key] == value)
        return objectArray[index];
  }
  return null;
}

//Get a shopping list with the quantity purchased.
function getShoppingList(itemArray, barcodeList, discountItemArray)
{
  var shoppingList = new Array();

  //Initial the shoppingList
  for(var index in barcodeList) {
    var strArray = barcodeList[index].split('-');
    var item = selectObjectInArray(itemArray, strArray[0], 'barcode');
    var count = strArray.length > 1 ? parseInt(strArray[1], 10) : 1;
    if(typeof(shoppingList[item.barcode]) == "undefined") {
      shoppingList[item.barcode] = {'itemInfo':item,
        'count':count,
        'discount':0,
        'price':0,
        'discountPrice':0,
        'isDiscount':selectObjectInArray(discountItemArray, item.barcode) != null
      };
    }
    else {
      shoppingList[item.barcode].count += count;
    }
  }

  //Counting every item price and discount
  for(var index in shoppingList) {
    var item = shoppingList[index];
    if(item.isDiscount)
      item.discount = Math.floor(item.count / 3);
    item.discountPrice = item.discount * item.itemInfo.price;
    item.price = item.count * item.itemInfo.price - item.discountPrice;
  }

  return shoppingList;
}



//output
function printInventory(barcodeList) {
  //parameter validation


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
  var shoppingList = getShoppingList(loadAllItems(), barcodeList, discountList);

  outputStr += '***<没钱赚商店>购物清单***\n';

  //goods traversal, statistics count
  var sumPrice = 0;
  var sumDiscount = 0;
  var discountStr = '----------------------\n挥泪赠送商品：\n';
  for(var i in shoppingList) {
    var item = shoppingList[i];
    sumPrice += item.price;
    sumDiscount += item.discountPrice;
    outputStr += '名称：' + item.itemInfo.name + '，数量：' + item.count + item.itemInfo.unit + '，单价：' + item.itemInfo.price.toFixed(2) + '(元)，小计：' + item.price.toFixed(2) + '(元)\n';
    if(item.discount > 0)
      discountStr += '名称：' + item.itemInfo.name + '，数量：' + item.discount + item.itemInfo.unit + '\n';
  }

  outputStr += discountStr;

  outputStr += '----------------------\n';
  outputStr += '总计：' + sumPrice.toFixed(2) + '(元)\n';
  outputStr += '节省：' + sumDiscount.toFixed(2) + '(元)\n';
  outputStr += '**********************';
  console.log(outputStr);
  //statistics
}
