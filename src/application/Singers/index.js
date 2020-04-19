import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Horizen from '../../baseUI/horizen-item/index.js'
import { categoryTypes, alphaTypes } from '../../api/config.js'
import Scroll from '../../baseUI/scroll/index.js'
import LazyLoad, { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading/index.js'

import { NavContainer, ListContainer, List, ListItem } from './style.js'
import {
  changePageCount,
  changeIsLoading,
  changePullUpLoading,
  changePullDownLoading,
  getHotSingerList,
  refreshMoreHotSingerList,
  getSingerList,
  refreshMoreSingerList
} from './store/actionCreators.js'

function Singers (props) {
  let [category, setCategory] = useState('')
  let [alpha, setAlpha] = useState('')
  const { singerList, isLoading, pullUpLoading, pullDownLoading, pageCount } = props
  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props

  useEffect(() => {
    getHotSingerDispatch()
  }, [])


  let handleUpdateAlpha = val => {
    setAlpha(val)
    updateDispatch(category, val)
  }
  let handleUpdateCategory = val => {
    setCategory(val)
    updateDispatch(val, alpha)
  }
  let handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount)
  }
  let handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : []
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.accountId + "" + index}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('../../assets/singer.png')} alt="music" />}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }


  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title={"分类(默认热门):"}
          handleClick={handleUpdateCategory}
          oldVal={category}
        ></Horizen>
        <Horizen
          list={alphaTypes}
          title={"首字母:"}
          handleClick={handleUpdateAlpha}
          oldVal={alpha}
        ></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
        >
          {renderSingerList()}
        </Scroll>
        {isLoading ? <Loading show={isLoading}></Loading> : null}
      </ListContainer>
    </div>
  )
}

const mapStateToProps = state => ({
  singerList: state.getIn(['singers', 'singerList']),
  isLoading: state.getIn(['singers', 'isLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
})
const mapDispatchToProps = dispatch => {
  return {
    getHotSingerDispatch () {
      dispatch(getHotSingerList())
    },
    updateDispatch (category, alpha) {
      dispatch(changePageCount(0))
      dispatch(changeIsLoading(true))
      dispatch(getSingerList(category, alpha))
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch (category, alpha, hot, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count + 1))
      if (hot) {
        dispatch(refreshMoreHotSingerList())
      } else {
        dispatch(refreshMoreSingerList(category, alpha))
      }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch (category, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(category, alpha))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))