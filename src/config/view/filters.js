import accounting from 'accounting'
const contains = (arr, str) => {
  // will implement object contains later
  if (_.isEmpty(arr) || _.isPlainObject(arr) || _.isNil(str)) {
    return false
  }

  if (_.isString(arr)) {
    arr = arr.split(',')
  } else if (_.isNumber(arr)) {
    arr = _.toString(arr)
  }

  return arrayContains(arr, str)
}

const insertFrag = (text, fragment, len) => {
  let rtn = ''
  for (let idx = 0; idx < text.length; idx += len) {
    rtn += text.substring(idx, idx + len) + fragment
  }

  showDebug([text, text.length, fragment, len, rtn])
  return rtn
}

export default env => {
  env.addFilter('contains', contains)
  env.addFilter('formatCurrency', num => accounting.formatMoney(num, ''))
  env.addFilter('insertFrag', insertFrag)
  env.addFilter('moment', (time, formatter) => {
    if (_.isNil(formatter)) {
      return moment(time).fromNow()
    } else {
      return moment(time).format(formatter)
    } 
  })

  env.addFilter('getFileName', (uuid) => {
    return _.last(_.split(uuid, '_'))
  })

  /**
   * 获取用户名称
   */
  env.addFilter('get_nickname', async(uid, callback) => {
    const data = await get_nickname(uid);
    callback(null, data);
  }, true);

  env.addFilter("in_Array", function (str, arr) {
    arr= arr||0;
    if (!think.isArray(arr)) {
      if(think.isNumber(arr)){
        arr = "'"+arr+"'";
      }
      arr = arr.split(",");
    }
    //console.log(arr);
    return in_array(str, arr);
  })
  /**
   * 数字转ip
   */
  env.addFilter("int2ip",function (int) {
    return _int2iP(int);
  })

  env.addFilter("test",function (string, reg) {
    return (new RegExp(reg)).test(string);
  })

  // todo: test
  env.addFilter("JSON",function (int) {
    return JSON.stringify(int);
  })
}
