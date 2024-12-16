import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";


function App() {
    return (
        <Router>
            <Routes>
                {/* Route for posts list */}
                <Route path="/" element={<Home/>}/>
                {/* Route for individual post */}
                <Route path="/post/:id" element={<PostPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
