import React from 'react'
import style from './Child.module.css'

export default function Child() {
  return (
    <div>
      child
      <ul>
        <li className={style.item}>123456</li>
        <li className={style.item}>7890</li>
        </ul>
    </div>
  )
}
