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
  return <div>
    {
      routeData.map((t, i) => {
        return <div>
            <h2>{t.title}</h2>
            <div  className='df fww'>
            {
              t.children.map(e => <NavCom 
                key={i}
                path={e.path}
                imgUrl={e.img}
                desc={e.desc}/>)
            }
            </div>
          </div>
      })
    }
  </div>
}

export default function() {
  return <div>
    <Routes>
      <Route path="/" element={<Home/>}/>
    {
      routeData.map(e => e.children).reduce((r, c) => [...r, ...c]).map((e, i) => {
        return <Route 
          key={i}
          path={e.path}
          element={e.ele}/>
      })
    }
    </Routes>
  </div>
}