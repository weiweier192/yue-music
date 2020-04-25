import React, { useRef, useState, useEffect, useImperativeHandle } from 'react'
import styled from 'styled-components'
import style from '../../assets/global-style.js'
import { prefixStyle } from '../../api/utils.js'

const Container = styled.div`
  .icon_wrapper {
    dislay: none;
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    transition: transform 1s cubic-dezier(.62, -0.1, .86, .57);
    transform: translate3d(0, 0, 0);
    >div {
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef()
  // 容器中有3个音符，也就是同时只能有3个音符下落
  const ICON_COUNT = 3
  const transform = prefixStyle("transform")
  // 原生DOM操作，返回一个DOM节点对象
  const createNode = txt => {
    const template = `<div class="icon_wrapper">${txt}</div>`
    let tempNode = document.createElement("div")
    tempNode.innerHTML = template
    return tempNode.firstChild
  }
  useEffect(() => {
    for(let i=0; i<ICON_COUNT; ++i) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`)
      // 添加3个音符
      iconsRef.current.appendChild(node)
    }
    // 类数组转换为数组，也可以用[...xxx]解构或 Array.from()
    let domArray = [].slice.call(iconsRef.current.children)
    domArray.forEach(item => {
      // item === icon_wrapper
      item.running = false
      item.addEventListener("transitionend", function() {
        this.style["display"] = "node"
        this.style[transform] = `translate3d(0, 0, 0)`
        this.running = false
        // icon == iconfont
        let icon = this.querySelector("div")
        icon.style[transform] = `translate3d(0, 0, 0)`
      }, false)
    })
  }, [])
  // 接下来是下落动画的处理逻辑
  const startAnimation = ({x, y}) => {
    for(let i=0; i<ICON_COUNT; ++i) {
      let domArray = [].slice.call(iconsRef.current.children)
      let item = domArray[i]
      // 选择一个空闲的元素来开始动画
      if(item.running === false) {
        item.style.left = x+"px"
        item.style.top = y+"px"
        item.style.display = "inline-block"
        setTimeout(() => {
          item.running = true
          item.style[transform] = `translate3d(0, 750px, 0)`
          let icon = item.querySelector("div")
          icon.style[transform] = `translate3d(-40px, 0, 0)`
        }, 20)
        break
      }
    }
  }
  // 将子组件内的方法提供给父组件调用
  useImperativeHandle(ref, () => {
    // 动画开始
    startAnimation
  })

  return (
    <Container ref={iconsRef}></Container>
  )
})

export default React.memo(MusicNote)