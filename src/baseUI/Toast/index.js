import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
import style from '../../assets/global-style.js'

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  &.drop-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active {
    opacity: 1;
    transition: all .3s;
    transform: translate3d(0, 0, 0);
  }
  &.drop-exit-active {
    opacity: 0;
    transition: all .1s;
    transform: translate3d(0, 100%, 0);
  }
  .text {
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: ${style["font-size-l"]};
  }
`

// 外面组件需要拿到此函数组件的ref，因此用forwardRef
const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false)
  const [timer, setTimer] = useState('')
  const { text } = props
  // 将函数组件ref的方法，用useImperativeHandle提供给父组件
  useImperativeHandle(ref, () => ({
    show () {
      // 作防抖处理
      if (timer) clearTimeout(timer)
      setShow(true)
      setTimer(setTimeout(() => {
        setShow(false)
      }, 2600))
    }
  }))
  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="drop"
      unmountOnExit
    >
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  )
})

export default React.memo(Toast)