import "./index.css";
import { Routes, Route } from "react-router-dom";
import { Home, Public, Login } from "./pages/public";
import path from "./ultils/path";
import { Speaker,Event, DetailEvent } from "./components";
import FinalRegister from "./pages/guest/FinalRegister";
import { Admin } from "./pages/private";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.SPEAKER} element={<Speaker />} />
          <Route path={path.Event} element={<Event/>} />
          <Route path={path.DetailEvent} element={<DetailEvent/>} />
        </Route>
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.FinalRegister} element={<FinalRegister/>}/>
          <Route path={path.Admin} element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
