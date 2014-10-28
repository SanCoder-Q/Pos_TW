//SanCoder 2014-10-27
//TW homework: Pos_v1

//Select the object from an array
function selectObjectInArray(objectArray, key, value) {
  for(var index in objectArray)
    if(objectArray[index][key] == value)
      return objectArray[index];
  return null;
}

//Get a shopping list with the quantity purchased.
function getShoppingList(itemArray, barcodeList)
{
  var shopingList = new Array();
  for(var index in barcodeList) {
    var strArray = barcodeList[index].split('-');
    var item = selectObjectInArray(itemArray, 'barcode', strArray[0]);
    var count = strArray.length > 1 ? parseInt(strArray[1], 10) : 1;
    if(typeof(shopingList[item.barcode]) == "undefined") {
      shopingList[item.barcode] = {'itemInfo':item,
        'count':count,
        'discount':0,
        'price':0,
        'discountPrice':0,
        'isDiscount':function(discountItemArray) {
            for(var i in discountItemArray){
              if(discountItemArray[i] == this.itemInfo.barcode){
                return true;
              }
            }
            return false;
          }
        };
      }
      else {
        shopingList[item.barcode].count += count;
      }
  }
  return shopingList;
}



//output
function printInventory(barcodeList) {
  //parameter validation


  //initial output string
  var outputStr = '';

  //initial shoppingList
  var shoppingList = getShoppingList(loadAllItems(), barcodeList);

  //initial discountList
  var discountList;
  var blocks = loadPromotions();
  for(var i in blocks) {
    if(blocks[i].type == 'BUY_TWO_GET_ONE_FREE') {
      discountList = blocks[i].barcodes;
      break;
    }
  }

  outputStr += '***<没钱赚商店>购物清单***\n';

  //goods traversal, statistics count
  var sumPrice = 0;
  var discountPrice = 0;
  var discountStr = '----------------------\n挥泪赠送商品：\n';
  for(var i in shoppingList) {
    var item = shoppingList[i];
    if(item.isDiscount(discountList))
      item.discount = Math.floor(item.count / 3);
    item.discountPrice = item.discount * item.itemInfo.price;
    item.price = item.count * item.itemInfo.price - item.discountPrice;
    sumPrice += item.price;
    discountPrice += item.discountPrice;
    outputStr += '名称：' + item.itemInfo.name + '，数量：' + item.count + item.itemInfo.unit + '，单价：' + item.itemInfo.price.toFixed(2) + '(元)，小计：' + item.price.toFixed(2) + '(元)\n';
    if(item.discount > 0)
      discountStr += '名称：' + item.itemInfo.name + '，数量：' + item.discount + item.itemInfo.unit + '\n';
  }

  outputStr += discountStr;

  outputStr += '----------------------\n';
  outputStr += '总计：' + sumPrice.toFixed(2) + '(元)\n';
  outputStr += '节省：' + discountPrice.toFixed(2) + '(元)\n';
  outputStr += '**********************';
  console.log(outputStr);
  //statistics
}
