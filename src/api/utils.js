import { RankTypes } from './config.js'

export const getCount = (count) => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

export const debounce = (func, delay = 300) => {
  let timer;
  return function (...args) {
    if (timer) {
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

export const filterIndex = rankList => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks && (rankList[i].tracks.length && !rankList[i + 1].tracks.length)) {
      return i + 1
    }
  }
}

export const filterIdx = name => {
  for (let key in RankTypes) {
    if (RankTypes[key] === name) return key
  }
  return null
}