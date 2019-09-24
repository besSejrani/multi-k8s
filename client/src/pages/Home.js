import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo.svg";
import "../App.css";

const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>Fib Calculator</h1>

        <Link to="/calculator"> Calculator</Link>
      </header>
    </div>
  );
};

export default Home;
