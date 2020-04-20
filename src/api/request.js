import {request} from './config.js'

export const getBannerRequest = () => {
  return request.get('/banner')
}
export const getRecommendListRequest = () => {
  return request.get('/personalized')
}

export const getHotSingerListRequest = (count) => {
  return request.get(`/top/artists?offset=${count}`)
}
export const getSingerListRequest = (category, alpha, count) => {
  return request.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`)
}

export const getRankListRequest = () => {
  return request.get(`/toplist/detail`)
}