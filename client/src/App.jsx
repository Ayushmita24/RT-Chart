import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login"; // lowercase since your file is login.jsx
import Register from "./components/Register";
import Home from "./components/Home";

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
