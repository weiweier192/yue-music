import axios from 'axios'

export const baseUrl = 'http://localhost:4000'

const request = axios.create({
  baseURL: baseUrl
})
request.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, '偷懒了')
  }
)

export {
  request
}