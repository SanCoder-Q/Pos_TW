//SanCoder 2014-10-27
//TW homework: Pos_v1

//Get a initial item list include count and whether is discounting.
function getInitialShoppingList(itemArray)
{
  var shopingList = new Array();
  for(var index in itemArray) {
    var item = itemArray[index];
    shopingList[item.barcode] = {'itemInfo':item,
      'count':0,
      'discount':0,
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
  return shopingList;
}

//Select the object from an array
function selectObjectInArray(objectArray, key, value) {
  for(var index in objectArray)
    if(objectArray[index][key] == value)
      return obj;
  return null;
}

//output
function printInventory(barcodeList) {
  //parameter validation
  var outputStr = '';
  var shoppingList = getInitialShoppingList(loadAllItems());
  var discountItemArray;
  var blocks = loadPromotions();
  for(var i in blocks) {
    if(blocks[i].type == 'BUY_TWO_GET_ONE_FREE') {
      discountItemArray = blocks[i].barcodes;
      break;
    }
  }

  outputStr += '***<没钱赚商店>购物清单***\n';
  //goods traversal, statistics count
  for(var i in barcodeList) {
    var barcodeStr = barcodeList[i];
    var strArray = barcodeStr.split('-');

    var barcodeStr = strArray[0];
    var item = shoppingList[barcodeStr];
    var num = strArray.length > 1 ? parseInt(strArray[1], 10) : 1;

    if(item == null)
      throw "Cannot find the item by barcode.";
    if(num <= 0)
      throw "Wrong item number.";

    item.count += num;
  }

  var sumPrice = 0;
  //count price
  for(var i in shoppingList) {
    var item = shoppingList[i];
    if(item.count <= 0)  continue;

    var price;
    if(item.isDiscount(discountItemArray))
      item.discount = Math.floor(item.count / 3);

    price = (item.count - item.discount) * item.itemInfo.price;
    sumPrice += price;
    outputStr += '名称：' + item.itemInfo.name + '，数量：' + item.count + item.itemInfo.unit + '，单价：' + item.itemInfo.price.toFixed(2) + '(元)，小计：' + price.toFixed(2) + '(元)\n';
  }

  outputStr += '----------------------\n挥泪赠送商品：\n';
  var discountPrice = 0;
  for(var i in discountItemArray) {
    item = shoppingList[discountItemArray[i]];
    if(item.discount <= 0)
      continue;
    discountPrice += item.discount * item.itemInfo.price;
    outputStr += '名称：' + item.itemInfo.name + '，数量：' + item.discount + item.itemInfo.unit + '\n';
  }

  outputStr += '----------------------\n';
  outputStr += '总计：' + sumPrice.toFixed(2) + '(元)\n';
  outputStr += '节省：' + discountPrice.toFixed(2) + '(元)\n';
  outputStr += '**********************';
  console.log(outputStr);
  //statistics
}
