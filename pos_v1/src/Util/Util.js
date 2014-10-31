//SanCoder 2014-10-31
//TW homework: Pos_v1
//Happy halloween!

//alert(document.currentScript.src);

var Util = {};

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
