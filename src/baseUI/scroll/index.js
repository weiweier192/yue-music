import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import Loading from '../loading/index.js'
import Loading2 from '../loading-v2/index.js'
import { debounce } from '../../api/utils.js'

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`
const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 30px;
  margin: auto;
  z-index: 100;
`

const Scroll = forwardRef((props, ref) => {
  // better-scroll 实例对象
  const [bScroll, setBScroll] = useState()
  // 指向初始化bs实例需要的DOM元素
  const scrollContainerRef = useRef()
  const { direction, click, refresh, bounceTop, bounceBottom } = props
  const { pullUp, pullDown, onScroll, pullUpLoading, pullDownLoading } = props

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])
  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown])

  // 创建better-scroll实例
  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
  }, [])
  // 每次重新渲染都要刷新实例，防止无法滑动
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })
  // 給实例绑定 scroll 事件
  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', (scroll) => {
      // console.log('scroll', scroll) // {x: 0, y: -270.84}
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])
  // 进行上拉到底的判断，调用上拉刷新函数
  useEffect(() => {
    if (!bScroll || !pullUp) return
    bScroll.on('scrollEnd', () => {
      // 判断是否滑动到底部了
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUpDebounce, pullUp, bScroll])
  // 进行下拉判断，调用下拉刷新函数
  useEffect(() => {
    if (!bScroll || !pullDown) return
    bScroll.on('touchEnd', (pos) => {
      // 判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [pullDownDebounce, pullDown, bScroll])
  
  useImperativeHandle(ref, () => ({
    refresh () {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getScroll () {
      if (bScroll) {
        return bScroll
      }
    }
  }))
  const PullUpdisplayStyle = pullUpLoading ? { display: '' } : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' }
  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={PullDowndisplayStyle}><Loading2></Loading2></PullDownLoading>
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,// 是否支持向上吸顶
  bounceBottom: PropTypes.bool// 是否支持向上吸顶
}

export default Scroll