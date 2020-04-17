import React, { useState } from 'react'
import Horizen from '../../baseUI/horizen-item/index.js'
import { categoryTypes, alphaTypes } from '../../api/config.js'
import { NavContainer } from './style.js'

function Singers (props) {
  let [category, setCategory] = useState('')
  let [alpha, setAlpha] = useState('')

  let handleUpdateAlpha = val => {
    setAlpha(val)
  }
  let handleUpdateCategory = val => {
    setCategory(val)
  }

  return (
    <NavContainer>
      <Horizen
        list={categoryTypes}
        title={"分类(默认热门):"}
        handleClick={handleUpdateCategory}
        oldVal={category}
      ></Horizen>
      <Horizen
        list={alphaTypes}
        title={"首字母:"}
        handleClick={handleUpdateAlpha}
        oldVal={alpha}
      ></Horizen>
    </NavContainer>
  )
}
export default React.memo(Singers)