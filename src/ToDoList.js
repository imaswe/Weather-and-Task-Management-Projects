import React, { useEffect, useState } from "react";
import styles from "./ToDoList.module.css";
import { useLocation, Link } from "react-router-dom";


export default function ToDoList() {

    // State variable declarations
    let [selections, setSelections] = useState({school: false, work: false, personal: false, todaysTasks: false, tomorrowsTasks: false, deadlineYes: false, deadlineNo: false, timeAM: false, timePM: false});
    let [task, setTask] = useState("");
    let [taskList, setTaskList] = useState([]);
    let [taskList2, setTaskList2] = useState([]);
    let [time, setTime] = useState("");
    let [taskReqPass, setTaskReqPass] = useState(false);
    let [taskProgress, setTaskProgress] = useState([]);
    let [taskProgress2, setTaskProgress2] = useState([]);
    let [todaysIncomplete, setTodaysIncomplete] = useState([]);
    let [todaysInProg, setTodaysInProg] = useState([]);
    let [todaysComplete, setTodaysComplete] = useState([]);
    let [tomorrowsIncomplete, setTomorrowsIncomplete] = useState([]);
    let [tomorrowsInProg, setTomorrowsInProg] = useState([]);
    let [tomorrowsComplete, setTomorrowsComplete] = useState([]);


    // Component Defaults
    useEffect(() => {
        document.body.classList.add(styles.default);
        document.body.style.height = "2000px";
        document.body.style.color = "red";


        return () => {
            document.body.classList.remove(styles.default);
            document.body.style.color = "";
            document.body.style.height = "";
        };

    }, []);


    // Local storage retriever
    useEffect(() => {
        // localStorage.clear();
        let todaysTasks = localStorage.getItem("todaysTasks");
        let taskProgress = localStorage.getItem("taskProgress");
        let tomorrowsTasks = localStorage.getItem("tomorrowsTasks");
        let taskProgress2 = localStorage.getItem("taskProgress2");

        todaysTasks = JSON.parse(todaysTasks);
        taskProgress = JSON.parse(taskProgress);
        tomorrowsTasks = JSON.parse(tomorrowsTasks);
        taskProgress2 = JSON.parse(taskProgress2);


        if(todaysTasks !== null) {
            setTaskList(todaysTasks);
        }

        if(taskProgress !== null) {
            setTaskProgress(taskProgress);
        }

        if(tomorrowsTasks !== null) {
            setTaskList2(tomorrowsTasks);
        }

        if(taskProgress2 !== null) {
            setTaskProgress2(taskProgress2);
        }

    }, []);


    useEffect(() => {
        if(taskReqPass === true) {
            handleSubmit();
        }
    }, [taskReqPass]);


    useEffect(() => {

        if(taskList.length > 0) {
            localStorage.setItem("todaysTasks", JSON.stringify(taskList));
        }

        else if(taskList.length === 0) {
            localStorage.removeItem("todaysTasks");
        }


    }, [taskList]);


    useEffect(() => {

        if(taskProgress.length > 0) {
            localStorage.setItem("taskProgress", JSON.stringify(taskProgress));

            let incompleteArray = [];
            let inProgArray = [];
            let completedArray = [];

            taskProgress.map((value, index) => {
                if(value.incomplete) {
                    incompleteArray.push(index);
                }
            });

            taskProgress.map((value, index) => {
                if(value.inProg) {
                    inProgArray.push(index);
                }
            });

            taskProgress.map((value, index) => {
                if(value.complete) {
                    completedArray.push(index);
                }
            });
        
            setTodaysIncomplete(incompleteArray);
            setTodaysComplete(completedArray);
            setTodaysInProg(inProgArray);

        }
        else if(taskProgress.length === 0) {
            localStorage.removeItem("taskProgress");
        }


    }, [taskProgress]);


    useEffect(() => {

        if(taskList2.length > 0) {
            localStorage.setItem("tomorrowsTasks", JSON.stringify(taskList2));
        }

        else if(taskList2.length === 0) {
            localStorage.removeItem("tomorrowsTasks");
        }

    }, [taskList2]);


    useEffect(() => {

        if(taskProgress2.length > 0) {
            localStorage.setItem("taskProgress2", JSON.stringify(taskProgress2));

            let incompleteArray = [];
            let inProgArray = [];
            let completedArray = [];

            taskProgress2.map((value, index) => {
                if(value.incomplete) {
                    incompleteArray.push(index);
                }
            });

            taskProgress2.map((value, index) => {
                if(value.inProg) {
                    inProgArray.push(index);
                }
            });

            taskProgress2.map((value, index) => {
                if(value.complete) {
                    completedArray.push(index);
                }
            });
        
            setTomorrowsIncomplete(incompleteArray);
            setTomorrowsComplete(completedArray);
            setTomorrowsInProg(inProgArray);

        }
        else if(taskProgress2.length === 0) {
            localStorage.removeItem("taskProgress2");
        }

    }, [taskProgress2]);


    // Function that ensures you don't select more than 1 option for each button section
    function handleSelections(e) {

        switch(e.target.textContent) {
            case "School": setSelections(prevSelections => {
                let newSelections = {...prevSelections, school: true, work: false, personal: false};
                return newSelections;
            });
            break;

            case "Work": setSelections(prevSelections => {
                let newSelections = {...prevSelections, school: false, work: true, personal: false};
                return newSelections;
            });
            break;

            case "Personal": setSelections(prev => {
                let newS = {...prev, school: false, work: false, personal: true};
                return newS;
            });
            break;

            case "Todays Tasks": setSelections(prev => {
                let newS = {...prev, todaysTasks: true, tomorrowsTasks: false};
                return newS;
            });
            break;

            case "Tomorrows Tasks": setSelections(prev => {
                let newS = {...prev, todaysTasks: false, tomorrowsTasks: true};
                return newS;
            });
            break;

            case "YES": setSelections(prev => {
                let newS = {...prev, deadlineYes: true, deadlineNo: false};
                return newS;
            });
            break;

            case "NO": setSelections(prev => {
                let newS = {...prev, deadlineYes: false, deadlineNo: true};
                return newS;
            });
            break;

            case "AM": setSelections(prev => {
                let newS = {...prev, timeAM: true, timePM: false};
                return newS;
            });
            break;

            case "PM": setSelections(prev => {
                let newS = {...prev, timeAM: false, timePM: true};
                return newS;
            });
            break;

            default: console.log("Test failed");
            break;

        }
    }

    // Function to check if any required buttons were not selected and also makes sure that all input fields are filled
    function taskReqChecker() {
        let tracker = false;
        let btnTracker = false;

        if(task.trim() !== "") {
            if(selections.school || selections.work || selections.personal) {
                if(selections.todaysTasks || selections.tomorrowsTasks) {
                    if(selections.deadlineYes || selections.deadlineNo) {
                        if(selections.deadlineYes === true) {
                            if(time.trim() !== "") {
                                let hour = Number(time.split(":")[0]);
                                let minute = Number(time.split(":")[1]);

                                if(typeof Number(time) === "number") {
                                    if(Number(time) >= 1 && Number(time) <= 12) {
                                        tracker = true;
                                        setTaskReqPass(true);
                                    }
                                }

                                if(time.split(":").length === 2) {

                                    if(time.split(":")[1].length === 2) {

                                        if((hour >= 1 && hour <= 12) && (minute >= 0 && minute <= 59)) {
                                            if(selections.timeAM || selections.timePM) {
                                                if(minute === 0) {
                                                    time = hour;
                                                }
                                                else {
                                                    time = hour + ":" + time.split(":")[1];
                                                }
                                                tracker = true;
                                                setTaskReqPass(true);
                                                setTime(time);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if(selections.deadlineNo === true) {
                            tracker = true;
                            setTaskReqPass(true);
                        }
                        if(selections.timeAM || selections.timePM) {
                            btnTracker = true;
                        }
                    }
                }
            }
        }

        if(tracker === false) {
            if(time.trim() !== "" && btnTracker === true) {
                alert("Please enter the time in the appropriate format");
            }
            else {
                alert("Make sure you fill everything out and select all appropriate buttons!");
            }
        }
    }


    function handleRemoveAllTasks(e) {

        if(e.target.id === "removeTDY") {
            setTaskList([]);
            setTaskProgress([]);   
        }
        else if(e.target.id === "removeTMR") {
            setTaskList2([]);
            setTaskProgress2([]);
        }
    }


    function handleSubmit() {
        setTaskReqPass(false);

        if(selections.todaysTasks === true) {

            task = task.charAt(0).toUpperCase() + task.slice(1);

            let newTask = {
                tracker: taskList.length,
                category: selections.school === true ? "School" : selections.work === true ? "Work" : "Personal",
                task: task,
                deadline: selections.deadlineYes === true ? selections.timeAM === true ? time + " AM" : selections.timePM === true ? time + " PM" : "This will never display :)" : "No Deadline"
            };


            setTaskList(prevList => {
                let newList = [...prevList, newTask];
                return newList;
            });


            setTaskProgress(prevProg => {
                let newProg = [...prevProg, {complete: false, inProg: false, incomplete: true}];
                return newProg;
            });                        


            setSelections(prevS => {
                let newS = {school: false, work: false, personal: false, todaysTasks: false, tomorrowsTasks: false, deadlineYes: false, deadlineNo: false, timeAM: false, timePM: false};
                return newS;
            });


            setTask("");
            setTime("");

        }

        else if(selections.tomorrowsTasks === true) {

            task = task.charAt(0).toUpperCase() + task.slice(1);

            let newTask = {
                tracker: taskList2.length,
                category: selections.school === true ? "School" : selections.work === true ? "Work" : "Personal",
                task: task,
                deadline: selections.deadlineYes === true ? selections.timeAM === true ? time + " AM" : selections.timePM === true ? time + " PM" : "This will never display :)" : "No Deadline"
            };


            setTaskList2(prevList => {
                let newList = [...prevList, newTask];
                return newList;
            });


            setTaskProgress2(prevProg => {
                let newProg = [...prevProg, {complete: false, inProg: false, incomplete: true}];
                return newProg;
            });                        


            setSelections(prevS => {
                let newS = {school: false, work: false, personal: false, todaysTasks: false, tomorrowsTasks: false, deadlineYes: false, deadlineNo: false, timeAM: false, timePM: false};
                return newS;
            });


            setTask("");
            setTime("");

        }

    }


    function handleProgressChange(e) {

        let taskID = e.target.parentElement.parentElement.getAttribute("tracker");

        if(e.target.textContent === "Completed") {
            setTaskProgress(prevProg => {
                let newProg = [...prevProg];
                newProg[taskID].complete = true;
                newProg[taskID].incomplete = false;
                newProg[taskID].inProg = false;

                return newProg;
            });

        }
        else if(e.target.textContent === "Incomplete") {
            setTaskProgress(prevProg => {
                let newProg = [...prevProg];
                newProg[taskID].complete = false;
                newProg[taskID].incomplete = true;
                newProg[taskID].inProg = false;

                return newProg;
            });
        }
        else if(e.target.textContent === "In Progress") {
            setTaskProgress(prevProg => {
                let newProg = [...prevProg];
                newProg[taskID].complete = false;
                newProg[taskID].incomplete = false;
                newProg[taskID].inProg = true;

                return newProg;
            });
        }
    }


    function handleProgressChange2(e) {

        let taskID = e.target.parentElement.parentElement.getAttribute("tracker");

        if(e.target.textContent === "Completed") {
            setTaskProgress2(prevProg => {
                let newProg = [...prevProg];
                newProg[taskID].complete = true;
                newProg[taskID].incomplete = false;
                newProg[taskID].inProg = false;

                return newProg;
            });

        }
        else if(e.target.textContent === "Incomplete") {
            setTaskProgress2(prevProg => {
                let newProg = [...prevProg];
                newProg[taskID].complete = false;
                newProg[taskID].incomplete = true;
                newProg[taskID].inProg = false;

                return newProg;
            });
        }
        else if(e.target.textContent === "In Progress") {
            setTaskProgress2(prevProg => {
                let newProg = [...prevProg];
                newProg[taskID].complete = false;
                newProg[taskID].incomplete = false;
                newProg[taskID].inProg = true;

                return newProg;
            });
        }
    }


    function handleChange(e) {
        if(e.target.id === "taskInput") {
            setTask(e.target.value);
        }
        else if(e.target.id === "timeInput") {
            setTime(e.target.value);
        }
    }


    function handleTaskRemove(e) {
        let removedIndex = e.target.parentElement.parentElement.getAttribute("tracker");
        removedIndex = Number(removedIndex);

        setTaskList(prevList => {

            let newList = [...prevList];
            let newList2 = newList.filter((currentVal, index) => {
                return index !== removedIndex;
            });
            return newList2;
        });

        setTaskProgress(prevProg => {
            let newProg = [...prevProg];
            let newProg2 = newProg.filter((currentVal, index) => {
                return index !== removedIndex;
            });
            return newProg2;
        });
        
    }


    function handleTaskRemove2(e) {
        let removedIndex = e.target.parentElement.parentElement.getAttribute("tracker");
        removedIndex = Number(removedIndex);

        setTaskList2(prevList => {

            let newList = [...prevList];
            let newList2 = newList.filter((currentVal, index) => {
                return index !== removedIndex;
            });
            return newList2;
        });

        setTaskProgress2(prevProg => {
            let newProg = [...prevProg];
            let newProg2 = newProg.filter((currentVal, index) => {
                return index !== removedIndex;
            });
            return newProg2;
        });
        
    }


    // Presentational Part
    return (
        <>
            <nav className="">
                <Link className="bg-green-300 mt-8 ml-12 inline-block text-xl p-3 font-bold hover:scale-125 transition-transform rounded-xl" to="/">Home Page</Link>
            </nav>


            <h1 className="text-center font-bold text-4xl">Task Manager</h1>


            {/* Main Container */}
            <div className="flex flex-row gap-10 mt-5">
                {/* First Column Container */}
                <div className="flex flex-col border-red-800 border-4 w-1/3">
                    {/* First Container within the First Column Container */}
                    <div className="flex flex-col gap-5 py-5 bg-red-900 border-4 h-[900px]">
                        <h2 className="text-3xl text-center text-shadow-black bg-black rounded-lg">Add Tasks</h2>
                        <input id="taskInput" value={task} onChange={handleChange} className="text-2xl p-2 w-10/12 mx-auto border-2 border-red-600 rounded-lg text-black" placeholder="Enter Task: " />
                        <p className="text-center font-bold text-xl text-shadow-black">Select 1 from 3 below</p>
                        
                        <div className="flex flex-row gap-7 mx-auto">
                            <button onClick={handleSelections} className={`bg-green-300 font-bold p-3 text-shadow-black text-2xl rounded-lg hover:bg-opacity-70 border-4 ${selections.school === true ? "border-black" : "border-green-300"}`}>School</button>
                            <button onClick={handleSelections} className={`bg-green-300 font-bold p-3 text-shadow-black text-2xl rounded-lg hover:bg-opacity-70 border-4 ${selections.work === true ? "border-black" : "border-green-300"}`}>Work</button>
                            <button onClick={handleSelections} className={`bg-green-300 font-bold p-3 text-shadow-black text-2xl rounded-lg hover:bg-opacity-70 border-4 ${selections.personal === true ? "border-black" : "border-green-300"}`}>Personal</button>
                        </div>
                        
                        <p className="text-center font-bold text-xl text-shadow-black">ADD TO (Select 1 from the 2 below) </p>
                        <button onClick={handleSelections} className={`bg-yellow-300 font-bold text-2xl text-shadow-black p-3 rounded-lg hover:bg-opacity-70 border-4 ${selections.todaysTasks === true ? "border-black" : "border-yellow-300"}`}>Todays Tasks</button>
                        <button onClick={handleSelections} className={`bg-yellow-300 font-bold text-2xl text-shadow-black p-3 rounded-lg hover:bg-opacity-70 border-4 ${selections.tomorrowsTasks === true ? "border-black" : "border-yellow-300"}`}>Tomorrows Tasks</button>
                        <div className="flex flex-row gap-5">
                            <p className="text-3xl p-3 text-shadow-black">Deadline?</p>
                            <button onClick={handleSelections} className={`bg-blue-400 font-bold text-xl p-3 w-1/4 text-shadow-black rounded-xl hover:bg-opacity-70 border-4 ${selections.deadlineYes === true ? "border-black" : "border-blue-400"}`}>YES</button>
                            <button onClick={handleSelections} className={`bg-blue-400 font-bold text-xl p-3 w-1/4 text-shadow-black rounded-xl hover:bg-opacity-70 border-4 ${selections.deadlineNo === true ? "border-black" : "border-blue-400"}`}>NO</button>
                        </div>
                        <p className="font-bold text-shadow-black text-2xl text-center">Please fill out if you selected "YES" (Examples of appropriate formats: 3, 5:30, 6:05)</p>
                        <div className="flex flex-row gap-5">
                            <input id="timeInput" onChange={handleChange} value={time} className="w-1/2 p-2 text-black text-xl rounded-lg border-red-500 border-2" placeholder="Enter Time" />
                            <button onClick={handleSelections} className={`bg-orange-400 w-1/3 rounded-lg text-xl font-bold text-shadow-black hover:bg-opacity-70 border-4 ${selections.timeAM === true ? "border-black" : "border-orange-400"}`}>AM</button>
                            <button onClick={handleSelections} className={`bg-orange-400 w-1/3 rounded-lg text-xl font-bold text-shadow-black hover:bg-opacity-70 border-4 ${selections.timePM === true ? "border-black" : "border-orange-400"}`}>PM</button>
                        </div>
                        <button onClick={taskReqChecker} className="bg-green-300 font-bold text-2xl w-5/12 mx-auto p-4 text-shadow-white rounded-xl hover:bg-opacity-80 active:bg-opacity-100">Submit</button>
                    </div>
                </div>

                {/* Second Column Container */}
                <div className="flex flex-col border-red-800 border-4 w-1/3">
                    {/* First Container within the second column container */}
                    <div className="flex flex-col py-5 border-4 px-7 gap-7 overflow-auto h-[900px] bg-red-900">
                        <h2 className="text-3xl font-bold text-center"> &#x2728; Todays Tasks &#x2728; </h2>
                        {taskList.length > 0 ? <button id="removeTDY" onClick={handleRemoveAllTasks} className="bg-gradient-to-t from-red-400 to-orange-500 rounded-xl p-4 text-2xl font-bold text-shadow-white text-black hover:border-2">Remove All Tasks</button> : ""}
                        <ul className="">
                            {taskList.length === 0 ? <p className="text-3xl font-bold text-shadow-black">No tasks have been added yet!</p> : ""}
                            {/* Tasks in progress */}
                            {taskList.map((value, index) => {
                                if(todaysInProg.includes(index)) {
                                    return (
                                        <li tracker={index} className={`transition-colors duration-300 ${taskProgress[index].incomplete ? "bg-red-400" : taskProgress[index].complete ? "bg-green-400" : "bg-yellow-400"}  mb-8 rounded-lg p-4 flex flex-col text-2xl`} key={index}>
                                            <h3 className="text-center mb-5 font-bold text-shadow-black text-3xl text-blue-400">Task {index + 1}</h3>
                                            <span className="text-purple-700 font-bold text-shadow-black">Status: <span className={`ml-8 ${taskProgress[index].incomplete ? "text-red-700" : taskProgress[index].complete ? "text-green-700" : "text-yellow-700"}`}>{taskProgress[index].incomplete ? "Incomplete" : taskProgress[index].complete ? "Complete" : "In Progress"}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Category: <span className="ml-8 text-black text-shadow-white"> {value.category} </span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Task: <span className="ml-5 text-black text-shadow-white">{value.task}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Deadline: <span className="ml-5 text-black text-shadow-white"> {value.deadline} </span></span>
                                            <br />
    
                                            <div className="flex flex-col gap-5">
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-red-700 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Incomplete</button>
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-green-700 rounded-xl hover:shadow-lg hover:border-2 shadow-green-600 text-green-500">Completed</button>
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-yellow-700 rounded-xl text-yellow-500 hover:shadow-lg hover:border-2 shadow-yellow-600">In Progress</button>
                                                <button onClick={handleTaskRemove} className="font-bold text-shadow-black bg-gradient-to-r from-red-500 to-red-900 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Remove Task</button>
                                            </div>
    
                                        </li>
                                    );
                                }

                            })}

                            {/* Tasks that are incomplete */}
                            {taskList.map((value, index) => {
                                if(todaysIncomplete.includes(index)) {
                                    return (
                                        <li tracker={index} className={`transition-colors duration-300 ${taskProgress[index].incomplete ? "bg-red-400" : taskProgress[index].complete ? "bg-green-400" : "bg-yellow-400"}  mb-8 rounded-lg p-4 flex flex-col text-2xl`} key={index}>
                                            <h3 className="text-center mb-5 font-bold text-shadow-black text-3xl text-blue-400">Task {index + 1}</h3>
                                            <span className="text-purple-700 font-bold text-shadow-black">Status: <span className={`ml-8 ${taskProgress[index].incomplete ? "text-red-700" : taskProgress[index].complete ? "text-green-700" : "text-yellow-700"}`}>{taskProgress[index].incomplete ? "Incomplete" : taskProgress[index].complete ? "Complete" : "In Progress"}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Category: <span className="ml-8 text-black text-shadow-white"> {value.category} </span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Task: <span className="ml-5 text-black text-shadow-white">{value.task}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Deadline: <span className="ml-5 text-black text-shadow-white"> {value.deadline} </span></span>
                                            <br />
    
                                            <div className="flex flex-col gap-5">
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-red-700 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Incomplete</button>
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-green-700 rounded-xl hover:shadow-lg hover:border-2 shadow-green-600 text-green-500">Completed</button>
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-yellow-700 rounded-xl text-yellow-500 hover:shadow-lg hover:border-2 shadow-yellow-600">In Progress</button>
                                                <button onClick={handleTaskRemove} className="font-bold text-shadow-black bg-gradient-to-r from-red-500 to-red-900 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Remove Task</button>
                                            </div>
    
                                        </li>
                                    );
                                }

                            })}


                            {/* Tasks that are complete */}
                            {taskList.map((value, index) => {
                                if(todaysComplete.includes(index)) {
                                    return (
                                        <li tracker={index} className={`transition-colors duration-300 ${taskProgress[index].incomplete ? "bg-red-400" : taskProgress[index].complete ? "bg-green-400" : "bg-yellow-400"}  mb-8 rounded-lg p-4 flex flex-col text-2xl`} key={index}>
                                            <h3 className="text-center mb-5 font-bold text-shadow-black text-3xl text-blue-400">Task {index + 1}</h3>
                                            <span className="text-purple-700 font-bold text-shadow-black">Status: <span className={`ml-8 ${taskProgress[index].incomplete ? "text-red-700" : taskProgress[index].complete ? "text-green-700" : "text-yellow-700"}`}>{taskProgress[index].incomplete ? "Incomplete" : taskProgress[index].complete ? "Complete" : "In Progress"}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Category: <span className="ml-8 text-black text-shadow-white"> {value.category} </span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Task: <span className="ml-5 text-black text-shadow-white">{value.task}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Deadline: <span className="ml-5 text-black text-shadow-white"> {value.deadline} </span></span>
                                            <br />
    
                                            <div className="flex flex-col gap-5">
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-red-700 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Incomplete</button>
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-green-700 rounded-xl hover:shadow-lg hover:border-2 shadow-green-600 text-green-500">Completed</button>
                                                <button onClick={handleProgressChange} className="font-bold text-shadow-black bg-yellow-700 rounded-xl text-yellow-500 hover:shadow-lg hover:border-2 shadow-yellow-600">In Progress</button>
                                                <button onClick={handleTaskRemove} className="font-bold text-shadow-black bg-gradient-to-r from-red-500 to-red-900 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Remove Task</button>
                                            </div>
    
                                        </li>
                                    );
                                }

                            })}

                        </ul>
                    </div>
                </div>

                {/* Third Column Container */}
                <div className="flex flex-col border-red-800 border-4 w-1/3">
                    {/* First Container within the third column container */}
                    <div className="flex flex-col border-4 px-7 gap-7 py-5 overflow-auto h-[900px] bg-red-900">
                        <h2 className="text-3xl font-bold text-center"> &#x2728; Tomorrows Tasks &#x2728; </h2>
                        {taskList2.length > 0 ? <button id="removeTMR" onClick={handleRemoveAllTasks} className="bg-gradient-to-t from-red-400 to-orange-500 rounded-xl p-4 text-2xl font-bold text-shadow-white text-black hover:border-2">Remove All Tasks</button> : ""}
                        <ul className="">
                            {taskList2.length === 0 ? <p className="text-3xl font-bold text-shadow-black">No tasks have been added yet!</p> : ""}
                            {/* Tasks that are in progress */}
                            {taskList2.map((value, index) => {
                                if(tomorrowsInProg.includes(index)) {
                                    return (
                                        <li tracker={index} className={`transition-colors duration-300 ${taskProgress2[index].incomplete ? "bg-red-400" : taskProgress2[index].complete ? "bg-green-400" : "bg-yellow-400"}  mb-8 rounded-lg p-4 flex flex-col text-2xl`} key={index}>
                                            <h3 className="text-center mb-5 font-bold text-shadow-black text-3xl text-blue-400">Task {index + 1}</h3>
                                            <span className="text-purple-700 font-bold text-shadow-black">Status: <span className={`ml-8 ${taskProgress2[index].incomplete ? "text-red-700" : taskProgress2[index].complete ? "text-green-700" : "text-yellow-700"}`}>{taskProgress2[index].incomplete ? "Incomplete" : taskProgress2[index].complete ? "Complete" : "In Progress"}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Category: <span className="ml-8 text-black text-shadow-white"> {value.category} </span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Task: <span className="ml-5 text-black text-shadow-white">{value.task}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Deadline: <span className="ml-5 text-black text-shadow-white"> {value.deadline} </span></span>
                                            <br />
    
                                            <div className="flex flex-col gap-5">
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-red-700 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Incomplete</button>
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-green-700 rounded-xl hover:shadow-lg hover:border-2 shadow-green-600 text-green-500">Completed</button>
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-yellow-700 rounded-xl text-yellow-500 hover:shadow-lg hover:border-2 shadow-yellow-600">In Progress</button>
                                                <button onClick={handleTaskRemove2} className="font-bold text-shadow-black bg-gradient-to-r from-red-500 to-red-900 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Remove Task</button>
                                            </div>
    
                                        </li>
                                    );
                                }
                            })}

                            {/* Tasks that are incomplete */}
                            {taskList2.map((value, index) => {
                                if(tomorrowsIncomplete.includes(index)) {
                                    return (
                                        <li tracker={index} className={`transition-colors duration-300 ${taskProgress2[index].incomplete ? "bg-red-400" : taskProgress2[index].complete ? "bg-green-400" : "bg-yellow-400"}  mb-8 rounded-lg p-4 flex flex-col text-2xl`} key={index}>
                                            <h3 className="text-center mb-5 font-bold text-shadow-black text-3xl text-blue-400">Task {index + 1}</h3>
                                            <span className="text-purple-700 font-bold text-shadow-black">Status: <span className={`ml-8 ${taskProgress2[index].incomplete ? "text-red-700" : taskProgress2[index].complete ? "text-green-700" : "text-yellow-700"}`}>{taskProgress2[index].incomplete ? "Incomplete" : taskProgress2[index].complete ? "Complete" : "In Progress"}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Category: <span className="ml-8 text-black text-shadow-white"> {value.category} </span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Task: <span className="ml-5 text-black text-shadow-white">{value.task}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Deadline: <span className="ml-5 text-black text-shadow-white"> {value.deadline} </span></span>
                                            <br />
    
                                            <div className="flex flex-col gap-5">
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-red-700 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Incomplete</button>
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-green-700 rounded-xl hover:shadow-lg hover:border-2 shadow-green-600 text-green-500">Completed</button>
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-yellow-700 rounded-xl text-yellow-500 hover:shadow-lg hover:border-2 shadow-yellow-600">In Progress</button>
                                                <button onClick={handleTaskRemove2} className="font-bold text-shadow-black bg-gradient-to-r from-red-500 to-red-900 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Remove Task</button>
                                            </div>
    
                                        </li>
                                    );

                                }
                            })}

                            {/* Tasks that are complete */}
                            {taskList2.map((value, index) => {
                                if(tomorrowsComplete.includes(index)) {
                                    return (
                                        <li tracker={index} className={`transition-colors duration-300 ${taskProgress2[index].incomplete ? "bg-red-400" : taskProgress2[index].complete ? "bg-green-400" : "bg-yellow-400"}  mb-8 rounded-lg p-4 flex flex-col text-2xl`} key={index}>
                                            <h3 className="text-center mb-5 font-bold text-shadow-black text-3xl text-blue-400">Task {index + 1}</h3>
                                            <span className="text-purple-700 font-bold text-shadow-black">Status: <span className={`ml-8 ${taskProgress2[index].incomplete ? "text-red-700" : taskProgress2[index].complete ? "text-green-700" : "text-yellow-700"}`}>{taskProgress2[index].incomplete ? "Incomplete" : taskProgress2[index].complete ? "Complete" : "In Progress"}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Category: <span className="ml-8 text-black text-shadow-white"> {value.category} </span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Task: <span className="ml-5 text-black text-shadow-white">{value.task}</span></span>
                                            <br />
                                            <span className="font-bold text-shadow-black">Deadline: <span className="ml-5 text-black text-shadow-white"> {value.deadline} </span></span>
                                            <br />
    
                                            <div className="flex flex-col gap-5">
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-red-700 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Incomplete</button>
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-green-700 rounded-xl hover:shadow-lg hover:border-2 shadow-green-600 text-green-500">Completed</button>
                                                <button onClick={handleProgressChange2} className="font-bold text-shadow-black bg-yellow-700 rounded-xl text-yellow-500 hover:shadow-lg hover:border-2 shadow-yellow-600">In Progress</button>
                                                <button onClick={handleTaskRemove2} className="font-bold text-shadow-black bg-gradient-to-r from-red-500 to-red-900 rounded-xl hover:shadow-lg hover:border-2 shadow-red-600">Remove Task</button>
                                            </div>
                                        </li>
                                    );

                                }
                            })}
                        </ul>
                    </div>
                </div>

            </div>

        </>
    );
}


