import React, { useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll/index.js'
import { Content } from './style.js'
import { forceCheck } from 'react-lazyload'

import { connect } from 'react-redux'
import * as actionTypes from './store/actionCreators.js'

import Loading from '../../baseUI/loading/index'
import { renderRoutes } from 'react-router-config'

function Recommend (props) {
  const { bannerList, recommendList, isLoading } = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props
  // 优化
  useEffect(() => {
    // 如果页面有数据，则不发请求
    // immutable数据的长度为size
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  return (
    <Content>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {isLoading ? <Loading></Loading> : null}
      {/* 将目前所在路由的下一层子路由加以渲染 */}
      {renderRoutes(props.route.routes)}
    </Content>
  )
}

// 映射redux全局的state到组件的props上
const mapStateToProps = state => ({
  // 不要在这里将数据toJS
  // 不然每次diff比对props时都是不一样的引用，导致不必要的重渲染，属于滥用immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  isLoading: state.getIn(['recommend', 'isLoading'])
})
const mapDispatchToProps = dispatch => {
  return {
    getBannerDataDispatch () {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch () {
      dispatch(actionTypes.getRecommendList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))