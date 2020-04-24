
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

export const getName = nameArr => {
  let nameStr = nameArr.length ? nameArr[0].name : '无'
  if (nameArr.length > 1) {
    for (let i = 1, len = nameArr.length; i < len; ++i) {
      nameStr += " / " + nameArr[i].name
    }
  }
  return nameStr
}

export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0

let elementStyle = document.createElement("div").style
let vender = (() => {
  // 先判断浏览器类型
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "Transform"
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
export function prefixStyle (style) {
  if (vender === false) return false
  if (vender === "standard") return style
  return vender + style.charAt(0).toUpperCase() + style.substr(1)
}

export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

// 转换歌曲播放时间
export const formatPlayTime = interval => {
  interval = interval | 0
  const minute = (interval / 60) | 0
  const second = (interval % 60).toString().padStart(2, "0")
  return `${minute}:${second}`
}

// 随机算法
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (arr) {
  let new_arr = []
  arr.forEach(item => {
    new_arr.push(item)
  })
  for (let i = 0, len = new_arr.length; i < len; ++i) {
    let j = getRandomInt(0, i)
    let t = new_arr[i]
    new_arr[i] = new_arr[j]
    new_arr[j] = t
  }
  return new_arr
}

// 找到当前歌曲的索引
export const findIndex = (song, list) => {
  return list.findIndex(item => {
    return song.id === item.id
  })
}