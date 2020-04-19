export const getCount = (count) =>{
  if(count < 0) return
  if(count < 10000) {
    return count
  } else if (Math.floor(count/10000) < 10000) {
    return Math.floor(count/1000)/10 + '万'
  } else {
    return Math.floor(count/10000000)/10 + '亿'
  }
}

export const debounce = (func, delay=300) => {
  let timer;
  return function (...args) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // console.log(this) undefined
      // func.apply(this, args)
      func(args)
      clearTimeout(timer)
    }, delay)
  }
}