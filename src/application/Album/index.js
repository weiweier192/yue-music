import React, { useState, useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Container } from './style.js'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index.js'
import Scroll from '../../baseUI/scroll/index.js'
import { TopDesc, Menu } from './style.js'
import { getCount, isEmptyObject } from '../../api/utils.js'
import style from '../../assets/global-style.js'
import { changeEnterLoading, getAlbumList } from './store/actionCreators.js'
import Loading from '../../baseUI/loading/index.js'
import SongsList from '../SongsList/index.js'

function Album (props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState('歌单')
  const [isMarquee, setIsMarquee] = useState(false)

  const { currentAlbum: currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props

  const id = props.match.params.id

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  let currentAlbum = currentAlbumImmutable.size && currentAlbumImmutable.toJS()

  const headerEl = useRef()

  // 优化: 将传给子组件的函数用 useCallback 包裹，这是useCallback的常用场景
  const handleBack = useCallback(() => {
    setShowStatus(false)
  })
  const HEADER_HEIGHT = 45
  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current
    // 划过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"]
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ""
      headerDom.style.opacity = 1
      setTitle('歌单')
      setIsMarquee(false)
    }
  }, [currentAlbum])

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10}万</span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
                评论
              </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
                点赞
              </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
                收藏
              </div>
        <div>
          <i className="iconfont">&#xe606;</i>
                更多
              </div>
      </Menu>
    )
  }

  return (
    // 在退出动画执行结束时跳转路由
    // onExited={props.history.goBack}
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header
          title={title}
          handleClick={handleBack}
          ref={headerEl}
          isMarquee={isMarquee}>
        </Header>
        {/* <Scroll bounceTop={false}> */}
        {!isEmptyObject(currentAlbum) ?
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {/* {renderSongList()} */}
              <SongsList
                collectCount={getCount(currentAlbum.subscribedCount)}
                showCollect={true}
                songs={currentAlbum.tracks}>
              </SongsList>
            </div>
          </Scroll>
          : null
        }
        {enterLoading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition >
  )
}

const mapStateToProps = state => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch (id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))