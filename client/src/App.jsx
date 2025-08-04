import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";//login.jsx 
import Register from "./components/auth/Register";
import Home from "./components/HomeOld";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
