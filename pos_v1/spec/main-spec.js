describe('pos', function () {
    var allItems;
    var inputs;

    beforeEach(function () {
        allItems = loadAllItems();
        inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
    });

    it('Util.Validate.nullValidate_OneNull_Thrown', function(){
      expect(function(){Util.Validate.nullValidate(null);}).toThrow();
    });

    it('Util.Validate.nullValidate_OneUndifined_Thrown', function(){
      expect(function(){Util.Validate.nullValidate(undifined);}).toThrow();
    });

    it('Util.Validate.nullValidate_ThreeNull_Thrown', function(){
      expect(function(){Util.Validate.nullValidate(null,1,'test');}).toThrow();
    });

    it('Util.Validate.nullValidate_ArgumentsWithOneNullIn_Thrown', function(){
      expect(function(){
        var argsMock = [null,1,'test'];
        argMock.callee = this;
        Util.Validate.nullValidate(argsMock);
      }).toThrow();
    });

    it('Util.Validate.paraNumValidate_argsEqNull_Thrown', function(){
      expect(function(){Util.Validate.paraNumValidate(null,1,2);}).toThrow();
    });

    it('Util.Validate.paraNumValidate_CorrectPara_Thrown', function(){
      var argsMock = [null,1,'test'];
      expect(function(){Util.Validate.paraNumValidate(argsMock,3);}).not.toThrow();
      expect(function(){Util.Validate.paraNumValidate(argsMock,3,3);}).not.toThrow();
      expect(function(){Util.Validate.paraNumValidate(argsMock,3,Infinity);}).not.toThrow();
    });

    it('Util.Validate.paraNumValidate_WrongPara_Thrown', function(){
      var argsMock = [null,1,'test'];
      expect(function(){Util.Validate.paraNumValidate(argsMock,1,2);}).toThrow();
      expect(function(){Util.Validate.paraNumValidate(argsMock,3,2);}).toThrow();
      expect(function(){Util.Validate.paraNumValidate(argsMock,Infinity,2);}).toThrow();
      expect(function(){Util.Validate.paraNumValidate(argsMock,2);}).toThrow();
    });

    it('should print correct text', function () {

        spyOn(console, 'log');

        printInventory(inputs);

        var expectText =
            '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';

          expect(console.log).toHaveBeenCalledWith(expectText);
    });

});
