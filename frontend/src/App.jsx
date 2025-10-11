import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Create from "./pages/Create.jsx";
import Note from "./pages/Note.jsx";
import EditNote from "./pages/Edit.jsx";
import PublicNote from "./pages/PublicNote.jsx";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar/>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
        <Route path="/create" element={<ProtectedRoute> <Create/> </ProtectedRoute>}/>

        <Route path="/note/:id" element={<ProtectedRoute> <Note/> </ProtectedRoute>}/>
        <Route path="/note/:id/edit" element={<ProtectedRoute> <EditNote/> </ProtectedRoute>}/>

        <Route path="/public/:publicId" element={<PublicNote/>}/>

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}


export default App;
