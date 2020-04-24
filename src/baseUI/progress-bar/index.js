import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import style from '../../assets/global-style.js'
import { prefixStyle } from '../../api/utils.js'

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 2px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 6px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`

function ProgressBar (props) {
  const progressBar = useRef()
  const progress = useRef()
  const progressBtn = useRef()
  const [touch, setTouch] = useState({})

  const { percent } = props
  const { percentChange } = props

  const transform = prefixStyle("transform")
  const progressBtnWidth = 12

  // 监听percent
  useEffect(() => {
    if(percent>=0 && percent <=1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth-progressBtnWidth
      const offsetWidth = percent*barWidth
      progress.current.style.width = `${offsetWidth}px`
      progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  }, [percent])

  // 当进度改变后，我们需要执行父组件传过来的回调函数
  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth - progressBtnWidth
    const curPercent = progress.current.clientWidth / barWidth // 新的进度计算
    percentChange(curPercent) // 将新的进度传给回调函数并执行
  }

  // 处理进度条的偏移
  const _offset = offsetWidth => {
    progress.current.style.width = `${offsetWidth}px`
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }
  // 处理滑动事件的逻辑
  const progressTouchStart = e => {
    const startTouch = {}
    startTouch.initiated = true // 表示滑动开始
    startTouch.startX = e.touches[0].pageX // 滑动开始时横向坐标
    startTouch.left = progress.current.clientWidth // 当前progress的长度
    setTouch(startTouch)
  }
  const progressTouchMove = e => {
    if (!touch.initiated) return
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const barWidth = progressBar.current.clientWidth - progressBtnWidth
    // min 返回零个或更多个数值的最小值
    // max 返回一组数中的最大值
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth)
    _offset(offsetWidth)
  }
  const progressTouchEnd = e => {
    const endTouch = JSON.parse(JSON.stringify(touch))
    endTouch.initiated = false
    setTouch(endTouch)
    // 滑动完成后
    _changePercent()
  }
  /**
   * 1. 通过按钮的点击事件onTouchStart,
   *    获取当前按钮的X轴坐标和当前progress的长度
   * 2. 通过按钮的移动事件onTouchMove,
   *    获取当前按钮移动的距离,和按钮可移动的最大距离
   *    通过当前按钮的移动距离和可移动最大距离，
   *    选取小的距离作为按钮和滚动条的移动距离,使用 Math.max/Math.min
   * 3. 通过按钮的离开事件onTouchEnd,停止onTouchMove监听
   */

  // 滚动条点击事件
  const progressClick = e => {
    // getBoundingClientRect()返回一个DOM在浏览器中的位置以及自己的属性
    const rect = progressBar.current.getBoundingClientRect()
    if (e.pageX > rect.right || e.pageX < rect.left) return // 边界处理
    const barWidth = progressBar.current.clientWidth - progressBtnWidth
    const offsetWidth = Math.min(e.pageX - rect.left, barWidth)
    _offset(offsetWidth)
    // 点击后
    _changePercent()
  }
  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default React.memo(ProgressBar)