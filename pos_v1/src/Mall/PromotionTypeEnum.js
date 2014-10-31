//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

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
