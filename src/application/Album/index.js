import React, { useState } from 'react'
import { Container } from './style.js'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index.js'

function Album (props) {
  // console.log(props)
  const [showStatus, setShowStatus] = useState(true)
  const handleBack = () => {
    setShowStatus(false)
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
        <Header title={"返回"} handleClick={handleBack}></Header>
      </Container>
    </CSSTransition>
  )
}

export default React.memo(Album)