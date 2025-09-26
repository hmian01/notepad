import { Routes, Route, Link } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";

function Home() { return <h1>Home</h1>; }

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/signup">Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}




export default App
