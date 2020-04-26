import React, { useState, useCallback, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Container, ImgWrapper, CollectButton, BgLayer, SongListWrapper } from './style.js'
import Header from '../../baseUI/header/index.js'
import Scroll from '../../baseUI/scroll/index.js'
import SongsList from '../SongsList/index.js'
import { HEADER_HEIGHT } from '../../api/config.js'
import { changeEnterLoading, getSingerInfo } from './store/actionCreators.js'
import Loading from '../../baseUI/loading/index.js'
import MusicNote from '../../baseUI/music-note/index.js'

function Singer (props) {
  const [showStatus, setShowStatus] = useState(true)
  const collectButton = useRef()
  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  // 图片初始高度
  const initialHeight = useRef(0)
  // 音符坠落动画
  const musicNoteRef = useRef()

  const { artist: immutableArtist, songs: immutableSongs, loading } = props
  const { getSingerDataDispatch } = props

  const artist = immutableArtist.size && immutableArtist.toJS()
  const songs = immutableSongs.size && immutableSongs.toJS()

  // 开启音符坠落动画
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }
  // 往上偏移的尺寸，漏出圆角
  const OFFSET = 5
  useEffect(() => {
    const id = props.match.params.id
    getSingerDataDispatch(id)

    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h
    // 将遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh()
  }, [])
  // console.log(props.match.params.id)
  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback((pos) => {
    // 图片的高度
    let height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT
    // 指滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height)
    // console.log(minScrollY, newY, height, percent)

    // 1.处理往下拉的情况，效果：图片放大，按钮跟着偏移
    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;

    } else if (newY >= minScrollY) {
      // 2.往上滑动，但是遮罩还没超过 Header 部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      // 保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = "75%"
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      // 按钮跟着移动且渐渐变透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      buttonDOM.style["opacity"] = `${1 - percent * 2}`

    } else if (newY < minScrollY) {
      // 3.往上滑动，但是遮罩超过 Header 部分
      // console.log(HEADER_HEIGHT - OFFSET)
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      // 防止溢出的歌单内容遮住 Header
      headerDOM.style.zIndex = 100
      // 此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 88
    }
  }, [])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly1"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header ref={header} title={"头部"} handleClick={handleBack}></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer} className="bg"></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        {loading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  artist: state.getIn(["singerInfo", "artist"]),
  songs: state.getIn(["singerInfo", "songsOfArtist"]),
  loading: state.getIn(["singerInfo", "loading"])
})
const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch (id) {
      dispatch(changeEnterLoading(true))
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer))