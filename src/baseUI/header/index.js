import React from 'react'
import styled from 'styled-components'
import style from '../../assets/global-style.js'
import PropTypes from 'prop-types'

const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  line-height: 40px;
  color: ${style["font-color-light"]};
  z-index: 100;
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  >h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
`
// 处理函数组件拿不到ref的问题，使用forwardRef
const Header = React.forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>&#xe655;</i>
      {isMarquee ? <marquee><h2>{title}</h2></marquee> : <h2>{title}</h2>}
    </HeaderContainer>
  )
})

Header.defaultProps = {
  handleClick: () => { },
  title: "标题",
  isMarquee: false
}
Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool
}

export default React.memo(Header)