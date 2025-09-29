import { Routes, Route, Link } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";

function Home() { return <h1>Home</h1>; }

function App() {
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-black shadow-md">
        <Link to="/">
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-500">Note</span>
            <span className="text-pink-500">Pad</span>
          </h1>
        </Link>
        <div className="space-x-4 mx-10">
          <Link to="/signup" className="text-white hover:text-indigo-400">Sign Up</Link>
          <Link to="/signin" className="text-white hover:text-indigo-400">Sign In</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}


export default App;
