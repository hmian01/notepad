import { Routes, Route, Link } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function Home() { return <h1>Home</h1>; }

function App() {
  return (
    <>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}


export default App;
