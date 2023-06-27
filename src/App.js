import Basic from './practice/basic'
import BufferGem from './practice/bufferGem'
import BasicMaterial from './practice/material/basic'
import VrHouse from './practice/vr_house/vrHouse'
import Hdr from './practice/vr_house/hdr'


import { Routes, Route, Link } from "react-router-dom"

function NavCom({path, imgUrl, desc}) {
  return <div className='df fdc img_size'>
    <Link to={path}>
      <div className='tac'>
        <img className='w100' src={imgUrl}/>
        <div>{desc}</div>
      </div>
    </Link>
  </div>
}

function Home() {
  return <div >
    <NavCom 
      path={"/hdr"}
      imgUrl={require('./assets/img/react_logo.png')}
      desc="hdr"/>
  </div>
}

export default function() {
  return <div>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/hdr" element={<Hdr/>}></Route>
    </Routes>
  </div>
}