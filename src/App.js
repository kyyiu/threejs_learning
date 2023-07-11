import { Routes, Route, Link } from "react-router-dom"
import routeData from './router'

function NavCom({path, imgUrl, desc, isShow}) {
  if (isShow === false) {
    return null;
  }
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
    {
      routeData.map((e, i) => {
        return <NavCom 
          key={i}
          path={e.path}
          imgUrl={e.img}
          desc={e.desc}/>
      })
    }
  </div>
}

export default function() {
  return <div>
    <Routes>
      <Route path="/" element={<Home/>}/>
    {
      routeData.map((e, i) => {
        return <Route 
          key={i}
          path={e.path}
          element={e.ele}/>
      })
    }
    </Routes>
  </div>
}