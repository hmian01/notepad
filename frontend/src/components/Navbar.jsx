import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar(){

    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/");
    };


    return (
        <nav className="flex justify-between items-center p-4 bg-black shadow-md">
            
            <Link to="/">
            <h1 className="text-2xl font-bold">
                <span className="text-indigo-500">Note</span>
                <span className="text-pink-500">Pad</span>
            </h1>
            </Link>

            <div className="flex items-center space-x-6 mx-10">
                {user ? (
                    <>
                        <div className="flex items-center space-x-4 pr-6 border-r border-gray-700">
                            {location.pathname !== "/dashboard" && 
                                (<Link to="/dashboard" className="text-white hover:text-indigo-400">Dashboard</Link>
                            )}
                            {location.pathname !== "/create" && 
                                (<Link to="/create" className="text-white hover:text-indigo-400">Create</Link>
                            )}
                            
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-blue-500 mr-4">Welcome, {user.name}</span>
                            <button onClick={handleLogout} className="px-3 py-1 bg-red-500 rounded hover:bg-red-600">Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/signup" className="text-white hover:text-indigo-400">Sign Up</Link>
                        <Link to="/signin" className="text-white hover:text-indigo-400">Sign In</Link>
                    </>

                )}

            </div>
            

        </nav>
    );
}