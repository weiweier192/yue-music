import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getRankList } from './store/index.js'
import { filterIndex, filterIdx } from '../../api/utils.js'

import { renderRoutes } from 'react-router-config'
import {
  Container,
  List,
  ListItem,
  SongList
} from './style.js'
import Scroll from '../../baseUI/scroll/index.js'

function Rank (props) {
  const { rankList:list, loading } = props
  const { getRankListDataDispatch } = props
  // didMount时发送请求
  let rankList = list ? list.toJS() : []

  useEffect(() => {
    if (!rankList.length) {
      getRankListDataDispatch()
    }
  }, [])
  
  let globalStartIndex = filterIndex(rankList)
  let officialList = rankList.slice(0, globalStartIndex)
  let globalList = rankList.slice(globalStartIndex)

  const enterDetail = name => {
    const index = filterIdx(name)
    if(index === null) {
      alert('暂无数据！')
      return
    }
  }
  const renderSongList = list => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index + 1}.{item.first}-{item.second}</li>
          })
        }
      </SongList>
    ) : null
  }
  // 渲染榜单列表函数，传入global变量区分不同的布局方式
  const renderRankList = (list, global=false) => {
    return (
      <List globalRank={global}>
        {
          list.map(item => {
            return (
              <ListItem
                key={item.coverImgId}
                tracks={item.tracks}
                onClick={() => enterDetail(item.name)}
              >
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  <div className="decorate"></div>
                  <span className="update_frequency">{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }
  // 榜单数据未加载出来之前全部隐藏
  let displayStyle = loading ? { "display": "none" } : { "display": "" }
  return (
    <Container>
      <Scroll>
        <div>
          <h2 className="official" style={displayStyle}>官方榜</h2>
          {renderRankList(officialList)}
          <h2 className="global" style={displayStyle}>全球榜</h2>
          {renderRankList(globalList, true)}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  )
}

const mapStateToProps = state => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading'])
})
const mapDispatchToProps = dispatch => {
  return {
    getRankListDataDispatch () {
      dispatch(getRankList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))