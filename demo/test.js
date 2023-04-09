// 计算数组的差
function difference(array1, array2) {
  var result = []
  for (var i = 0; i < array1.length; i++) {
    var item = array1[i]
    if (array2.indexOf(item) === -1) {
      result.push(item)
    }
  }
  return result
}
