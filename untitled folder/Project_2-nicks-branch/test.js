const realNumberArray = [4, 5.6, -9.8, 3.14, 42, 6, 8.34];
                
const squareList = function(arr){
  "use strict";
    var new_array = [];
  for(let i=0;i<realNumberArray.length;i++){

      if(realNumberArray[i]>0 && Number.isInteger(realNumberArray[i])){
          new_array.push(realNumberArray[i]*realNumberArray[i]);
          console.log(new_array);
      }

  }
  return new_array;
};


const squaredIntegers = squareList(realNumberArray);
console.log(squareList);
