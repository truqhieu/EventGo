import React from 'react'
import {Outlet} from 'react-router-dom'
import { Navbar,Footer } from '../../components'
const Public = () => {
  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Public
