import React from "react";
// import { BrowserRouter as Router, Route, Routes, useLocation, Link } from "react-router-dom";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./mainPage";
import ToDoList from "./ToDoList";
import Weather from "./Weather";


function Linker() {

    return (
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/ToDoList" element={<ToDoList />} />
                {/* <Route path="/ToDoList" Component={ToDoList} /> */}
                <Route path="/Weather" element={<Weather />} />
            </Routes>
    );
}


export default function Main() {
    return (
        // <Router basename="/Weather-and-Task-Management-Projects">
        <Router>
            <Linker />
        </Router>
    );
}
