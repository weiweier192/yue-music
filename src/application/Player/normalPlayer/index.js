import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { getName } from '../../../api/utils.js'
import {
  NormalPlayerContainer,
  Top,
  Middle,
  CDWrapper,
  Bottom,
  Operators
} from './style.js'

function NormalPlayer (props) {
  const normalPlayerRef = useRef()
  const cdWrapperRef = useRef()

  const { song, fullScreen } = props
  const { toggleFullScreen } = props
  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
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
            <div className="back">
              <i className="iconfont">&#xe662;</i>
            </div>
            <h2 className="title">{song.name}</h2>
            <h2 className="subtitle">{getName(song.ar)}</h2>
          </div>
        </Top>
        <Middle
          ref={cdWrapperRef}
        >
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