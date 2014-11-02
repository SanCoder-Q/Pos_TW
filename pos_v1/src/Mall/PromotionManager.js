//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

//static class for promotion manager
Mall.PromotionManager = (function(){
//pravite:
  var _promotions = loadPromotions();
  var publicReturn = {
    //#public method:
    getBarcodeListOfAPromotion: function(promotionTypeStr) {
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

    getPromotionListofABarcode: function(itemBarcodeStr) {
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
        var promotionList = this.getPromotionListofABarcode(i);

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
