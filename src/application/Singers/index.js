import React, { useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import Horizen from '../../baseUI/horizen-item/index.js'
import { categoryTypes, alphaTypes } from '../../api/config.js'
import Scroll from '../../baseUI/scroll/index.js'
import LazyLoad, { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading/index.js'
import {renderRoutes} from 'react-router-config'

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
import { CategoryDataContext } from './data.js'
import { CHANGE_CATEGORY, CHANGE_ALPHA } from './data.js'

function Singers (props) {
  // let [category, setCategory] = useState('')
  // let [alpha, setAlpha] = useState('')
  const { data, dispatch } = useContext(CategoryDataContext)
  // 获取category和alpha的值
  const { category, alpha } = data.toJS()
  const { singerList, isLoading, pullUpLoading, pullDownLoading, pageCount } = props
  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props

  useEffect(() => {
    // 当歌手列表不为空时，就不发 Ajax 请求，
    // 同时能够记忆之前的分类，让分类和列表对应
    if (!singerList.size) {
      getHotSingerDispatch()
    }
  }, [])


  let handleUpdateAlpha = val => {
    // setAlpha(val)
    dispatch({ type: CHANGE_ALPHA, data: val })
    updateDispatch(category, val)
  }
  let handleUpdateCategory = val => {
    // setCategory(val)
    dispatch({ type: CHANGE_CATEGORY, data: val })
    updateDispatch(val, alpha)
  }
  let handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount)
  }
  let handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }

  const enterDetail = id => {
    props.history.push(`/singers/${id}`)
  }

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : []
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem onClick={() => enterDetail(item.id)} key={item.accountId + "" + index}>
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
      {renderRoutes(props.route.routes)}
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