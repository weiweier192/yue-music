import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
// JS 的帧动画插件
import animations from 'create-keyframe-animation'
import { getName } from '../../../api/utils.js'
import {
  NormalPlayerContainer,
  Top,
  Middle,
  CDWrapper,
  Bottom,
  Operators
} from './style.js'
import { prefixStyle } from '../../../api/utils.js'

function NormalPlayer (props) {
  const normalPlayerRef = useRef()
  const cdWrapperRef = useRef()

  const { song, fullScreen } = props
  const { toggleFullScreen } = props

  const transform = prefixStyle("transform")
  // 计算偏移的辅助函数
  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    // 两个圆心得横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    return {
      x, y, scale
    }
  }
  // 启用帧动画
  const enter = () => {
    normalPlayerRef.current.style.display = "block"
    // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
    const { x, y, scale } = _getPosAndScale()
    let animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    }
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    })
    animations.runAnimation(cdWrapperRef.current, "move")
  }
  // 进入后解绑帧动画
  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current
    animations.unregisterAnimation("move")
    cdWrapperDom.style.animation = ""
  }
  // 离开
  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = "all .4s"
    const { x, y, scale } = _getPosAndScale()
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }
  // 离开后
  const afterLeave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ""
    cdWrapperDom.style[transform] = ""
    // 一定要注意把normalPlayer这个DOM隐藏掉。因CSSTransition只是把动画执行一遍
    // 不置为none现在全屏播放器页面还是存在
    normalPlayerRef.current.style.display = "none"
  }

  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer
        ref={normalPlayerRef}
      >
        <div className="background">
          <img
            src={song.al.picUrl + "?param=300x300"}
            width="100%"
            height="100%"
            alt="歌图"
          />
        </div>
        <div className="background layer"></div>
        <Top>
          <div className="top">
            <div className="back" onClick={() => toggleFullScreen(false)}>
              <i className="iconfont">&#xe662;</i>
            </div>
            <h2 className="title">{song.name}</h2>
            <h2 className="subtitle">{getName(song.ar)}</h2>
          </div>
        </Top>
        <Middle ref={cdWrapperRef}>
          <CDWrapper>
            <div className="cd">
              <img className="image play" src={song.al.picUrl + "?param=400x400"} alt="背图" />
            </div>
          </CDWrapper>
        </Middle>
        <Bottom className="bottom">
          <Operators>
            <div className="icon">
              <i className="iconfont">&#xe625;</i>
            </div>
            <div className="icon">
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon">
              <i className="iconfont icon-center">&#xe723;</i>
            </div>
            <div className="icon">
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon">
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(NormalPlayer)