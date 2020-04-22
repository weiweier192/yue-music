import styled, { keyframes } from 'styled-components'
import style from '../../../assets/global-style.js'

const rotate = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`
export const NormalPlayerContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 150;
  background: ${style["background-color"]};
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: .6;
    filter: blur(20px);
    &.layer {
      background: ${style["font-color-desc"]};
      opacity: .3;
      filter: none;
    }
  }
  &.normal-enter,
  &.normal-exit-done {
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
  &.normal-enter-active,
  &.normal-exit-active {
    .top, .bottom {
      transform: translate3d(0, 0, 0);
      transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
    opacity: 1;
    transition: all .4s;
  }
  &.normal-exit-active {
    opacity: 0;
  }
`
export const Top = styled.div`
  position: relative;
  margin-bottom: 25px;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      color: ${style["font-size-desc"]};
      font-weight: 700;
      transform: rotate(90deg);
    }
  }
  .title {
    width: 100%;
    padding-top: 10px;
    text-align: center;
    font-size: ${style["font-size-l"]};
    color: ${style["font-color-desc"]};
    ${style.noWrap()};
  }
  .subtitle {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc-v2"]};
    ${style.noWrap()};
  }
`
export const Middle = styled.div`
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  font-size: 0;
  overflow: hidden;
`
export const CDWrapper = styled.div`
  position: absolute;
  margin: auto;
  top: 10%;
  left: 0;
  right: 0;
  width: 80%;
  height: 80vw;
  .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    .image {
      position: absolute;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid rgba(255, 255, 255, 0.1);
    }
    .play {
      animation: ${rotate} 20s linear infinite;
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .playing_lyric {
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
    white-space: normal;
    text-align: center;
    color: rgba(255, 255, 255, .6);
  }
`
export const Bottom = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 50px;
`
export const Operators = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  justify-content: space-around;
  align-items: center;
  .icon {
    flex: 1;
    font-weight: 300;
    color: ${style["font-color-desc"]};
    text-align: center;
    &.disable {
      color: ${style["theme-color-shadow"]};
    }
    i {
      font-size: 30px;
      font-weight: 300;
      // color: ${style["theme-color"]};
    }
    i.icon-center {
      font-size: 40px;
    }
  }
`