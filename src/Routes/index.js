import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home/Index";
import Employe from "../components/Employe/Index";
import Content from "../components/Content/Index";
import DetailUser from "../components/DetailUser/Index";
import Employes from "../components/Employes/Index";
import AddConges from "../components/AddConges/Index";


const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Content />} >
          <Route index path='/' element={<Home />} />
          <Route path='dashboard' element={<Home />} />
          <Route path='employes' element={<Employe />} >
            <Route index element={<Employes />} />
            <Route path='addConges' element={<AddConges />} />
          </Route>
          <Route path='employes/:id' element={<DetailUser />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default Root
