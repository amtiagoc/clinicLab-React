import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Homepage from "./Components/Homepage"
import './App.css';
import Navbar from './Components/Navbar';
import Admin from "./Components/Admin";
import Users from "./Components/users";

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path = "/" element={<Homepage />}></Route>
                    <Route path = "/admin" element={<Admin />}></Route>
                    <Route path = "/users" element={<Users />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
