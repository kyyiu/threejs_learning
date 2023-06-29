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
  return <div className='df fww'>
    <NavCom 
      path={"/basic"}
      imgUrl={require('./assets/img/react_logo.png')}
      desc="threejs基础使用"/>
    <NavCom 
      path={"/buffer_gem"}
      imgUrl={require('./assets/img/react_logo.png')}
      desc="bufferGem对象使用"/>
    <NavCom 
      path={"/basic_material"}
      imgUrl={require('./assets/img/react_logo.png')}
      desc="基础材质的使用"/>
    <NavCom 
      path={"/hdr"}
      imgUrl={require('./assets/img/react_logo.png')}
      desc="hdr文件使用，并生成3d球体全景效果"/>
    <NavCom 
      path={"/vr_house"}
      imgUrl={require('./assets/img/react_logo.png')}
      desc="使用图片生成3d全景效果"/>
  </div>
}

export default function() {
  return <div>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/hdr" element={<Hdr/>}></Route>
      <Route path="/vr_house" element={<VrHouse/>}></Route>
      <Route path="/basic" element={<Basic/>}></Route>
      <Route path="/buffer_gem" element={<BufferGem/>}></Route>
      <Route path="/basic_material" element={<BasicMaterial/>}></Route>
    </Routes>
  </div>
}