import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home/Index";
import Employe from "../components/Employe/Index";
import Content from "../components/Content/Index";
import DetailUser from "../components/DetailUser/Index";
import Employes from "../components/Employes/Index";
import AddConges from "../components/AddConges/Index";
import Conges from "../components/Conges/Index";
import Conge from "../components/Conge/Index";


const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Content />} >
          <Route index path='/' element={<Home />} />
          <Route path='dashboard' element={<Home />} />
          <Route path='employes' element={<Employe />} >
            <Route index element={<Employes />} />
          </Route>
          <Route path='employes/:id' element={<DetailUser />} />
          <Route path='conges' element={<Conge />} >
            <Route index element={<Conges />} />
            <Route path='addConges' element={<AddConges />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default Root
