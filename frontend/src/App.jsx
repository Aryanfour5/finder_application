import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

function App() {
  return (
    <Router>
      <Navbar /> 
      <div style={{ minHeight: "calc(100vh - 120px)" }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
}

export default App;
