import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToDoList from "./ToDoList";
import "./style.css";
import "./global.css";
import styles from "./mainPage.module.css";


export default function MainPage() {

    useEffect(() => {
        document.body.style.height = "100px";
        document.body.classList.add(styles.default);

        return () => {
            document.body.classList.remove(styles.default);
        };
    }, []);


    let link = useNavigate();
    // navigation between components
    function handleNavigation(e) {

        // different navigation components based on the text content 
        switch(e.target.textContent) {
            case "To Do List":
                console.log("To Do List");
                link("/ToDoList");
                break;
            case "Weather":
                console.log("Weather app!!");
                link("/Weather");
                break;
            default:
                console.log("GG");
                break;
        }

    }

    // Main Page Component 
    return (
            <>
                <h1 className="text-red-600 text-4xl text-center mt-7 text-shadow-black">Personal Dashboard</h1>
                <main className="w-1/3 grid grid-cols-2 gap-10 mx-auto mt-10">
                    <button onClick={handleNavigation} className="transition-transform duration-500 hover:scale-125 border-4 p-4 border-black font-bold text-xl text-shadow-white bg-gradient-to-r from-green-400 to-teal-200">To Do List</button>
                    <button onClick={handleNavigation} className="transition-transform duration-500 hover:scale-125 border-4 p-4 border-black font-bold text-xl text-shadow-white bg-gradient-to-r from-green-400 to-teal-200">Weather</button>
                </main>
            </>
    );
}

