import React, { useEffect, useState } from "react";
import styles from "./Weather.module.css";
import weatherIcon from "./images/weatherIcon.png";
import clearSky from "./images/clearSky.webp";
import cloudsSky from "./images/cloudsSky.png";
import rainSky from "./images/rainSky.webp";
import snowSky from "./images/snowSky.png";
import { Link } from "react-router-dom";


export default function Weather() {

    let weatherMap = new Map();
    weatherMap.set("Clear", clearSky);
    weatherMap.set("Clouds", cloudsSky);
    weatherMap.set("Rain", rainSky);
    weatherMap.set("Snow", snowSky);

    let [zipCode, setZipCode] = useState("");
    let [geoPressed, setGeoPressed] = useState(false);
    let [directions, setDirections] = useState({north: false, east: false, south: false, west: false});
    let [todaysHourly, setTodaysHourly] = useState([]);
    let [weatherSearched, setWeatherSearched] = useState(false);
    let [occupied, setOccupied] = useState(false);
    let [todaysWeather, setTodaysWeather] = useState([]);
    let [timeStampBoxes, setTimeStampBoxes] = useState([]);
    let [logger, setLogger] = useState(false);
    let [timeChanger, setTimeChanger] = useState(false);
    let [numOfTimes, setNumOfTimes] = useState([]);
    let [highestDeg, setHighestDeg] = useState([]);
    let [lowestDeg, setLowestDeg] = useState([]);
    let [mainIcon, setMainIcon] = useState([]);
    let [numOfDays, setNumOfDays] = useState(0);
    let [iconGlow, setIconGlow] = useState(false);
    let [citySearch, setCitySearch] = useState("");
    let [geoSearch, setGeoSearch] = useState({lat: "", lon: ""});
    let [loading, setLoading] = useState(false);
    let [searchStatus, setSearchStatus] = useState(false);
    let [data, setData] = useState({city: "", temp: "", feelsLike: "", time: "", date: "",
    humidity: "", minTemp: "", maxTemp: "", iconCode: "", condition: "", desc: "", deg: "",
    gust: "", windSpeed: ""
    });
    let apiKey = "5e4ab0144101ace842740e2e03326b7d";

    let daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currentDate = new Date();
    let dateUse = new Date();
    currentDate = currentDate.toString().split(" ");
    let currentDay = currentDate[0];

    // Converting the current month to a numeric value 
    let currentMonth = currentDate[1];

    switch(currentMonth) {
        case "Jan": currentMonth = "01";
        break;
        case "Feb": currentMonth = "02";
        break;
        case "Mar": currentMonth = "03";
        break;
        case "Apr": currentMonth = "04";
        break;
        case "May": currentMonth = "05";
        break;
        case "Jun": currentMonth = "06";
        break;
        case "Jul": currentMonth = "07";
        break;
        case "Aug": currentMonth = "08";
        break;
        case "Sep": currentMonth = "09";
        break;
        case "Oct": currentMonth = "10";
        break;
        case "Nov": currentMonth = "11";
        break;
        case "Dec": currentMonth = "12";
        break;
        default: currentMonth = "Error!!";
        break;
    }
    currentDate = currentDate[3] + "-" + currentMonth + "-" + currentDate[2]; 


    useEffect(() => {
        document.body.style.height = "1700px";
        document.body.classList.add(styles.default);

        return () => {
            document.body.classList.remove(styles.default);
        };
    }, []);


    useEffect(() => {

        let timeArray = [];
        let mainTimeArray = [];
        let counterTracker = [];
        let tempTracker = [];
        let iconTracker = [];

        if(numOfTimes.length > 0) {
            for(let i = 0; i < numOfTimes.length; i++) {
                for(let j = 0; j < numOfTimes[i].times.length; j++) {
                    let time = numOfTimes[i].times[j];
                    if(time === 0) {
                        time = "12 AM";
                    }
                    else if(time < 12) {
                        time = time + " AM";
                    }
                    else if(time >= 12) {
                        if(time === 12) {
                            time = time + " PM";
                        }
                        else {
                            time = (time - 12) + " PM";
                        }
                    }
                    timeArray.push(time);
                }
                mainTimeArray.push(timeArray);
                timeArray = [];
                counterTracker.push(numOfTimes[i].counter);
                tempTracker.push(numOfTimes[i].temps);
                iconTracker.push(numOfTimes[i].icons);
            }
            setNumOfTimes([]);
                for(let i = 0; i < numOfTimes.length; i++) {
                    setNumOfTimes(prevTimes => {
                        let newTimes = [...prevTimes, {counter: counterTracker[i], times: mainTimeArray[i], temps: tempTracker, icons: iconTracker[i]}];
                        return newTimes;
                    });
                }
        }
    }, [timeChanger]);


    // Used to log out stuff during testing
    useEffect(() => {

    }, [logger]);


    useEffect(() => {

        let timeStamps = [];

                    if(todaysWeather.length > 0) {
                        for(let i = 0; i < todaysWeather[0].counter; i++) {
                            timeStamps.push(
                                <div key={i} className="space-y-2 flex flex-col items-center text-white font-semibold text-shadow-black text-xl border-2 border-white p-4">
                                    <p>{todaysHourly[0].times[i]}</p>
                                    <img className="w-14" src={weatherMap.get(todaysHourly[0].icons[i])} />
                                    <p>{todaysHourly[0].temps[i]}&deg;</p>
                                </div>
                            );
                        }
                        setTimeStampBoxes(timeStamps);
                    }

    }, [todaysWeather]);


    useEffect(() => {
        if(geoSearch.lat !== "" && geoSearch.lon !== "") {
            handleWeatherSearch(geoSearch, "geoSearch");
        }
    }, [geoPressed]);


    // Main function that makes all the API Calls to fetch the weather data
    function handleWeatherSearch(searchInput, searchOption) {

            setZipCode("");
            setDirections({north: false, east: false, south: false, west: false});
            setGeoSearch({lat: "", lon: ""});
            setGeoPressed(false);
            setTodaysHourly([]);
            setOccupied(false);
            setWeatherSearched(true);
            setTodaysWeather([]);
            setNumOfTimes([]);
            setHighestDeg([]);
            setLowestDeg([]);
            setMainIcon([]);
            setNumOfDays(0);
            setLoading(true);
            // 5 Day / 3 Hour Forecast Data API Call URLs
            let weatherSearch;
            if(searchOption === "citySearch") {
                weatherSearch = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&appid=${apiKey}`);
            }
            else if(searchOption === "geoSearch") {
                weatherSearch = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchInput.lat}&units=imperial&lon=${searchInput.lon}&appid=${apiKey}`);
            }
            else if(searchOption === "zipSearch") {
                weatherSearch = fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${searchInput}&units=imperial&appid=${apiKey}`);
            }

                weatherSearch.then(response => {
                    if(response.ok) {
                        return response.json();
                    }
                })

                .then(response => {                    
                    // Fetching and storing weather data for later uses!!
                    let dt = response.list[0].dt_txt.split(" ");
                    let date = dt[0];
                    let time = dt[1].split(":")[0];
                    let feelsLike = response.list[0].main.feels_like;
                    let temp = response.list[0].main.temp;
                    let humidity = response.list[0].main.humidity;
                    let minTemp = response.list[0].main.temp_min;
                    let maxTemp = response.list[0].main.temp_max;
                    let iconCode = response.list[0].weather[0].icon;
                    let condition = response.list[0].weather[0].main;
                    let desc = response.list[0].weather[0].description;
                    let deg = response.list[0].wind.deg;
                    let gust = response.list[0].wind.gust;
                    let windSpeed = response.list[0].wind.speed;
                    let nextDay = new Date();
                    nextDay.setDate(nextDay.getDate() + 1);
                    let nextDay2 = new Date();
                    nextDay2.setDate(nextDay2.getDate() + 1);
                    let counter = 0;
                    let timesTracker = [];
                    let genTracker = [];
                    let tempTracker3 = [];
                    let iconTracker = [];
                    let currentDayCounter = 0; 
                    let currentDayIcon;
                    let initialized3 = false;
                    let lowestTemp2;
                    let initialized4 = false;
                    let highestTemp2;
                    let weatherIcon;
                    // for todays weather
                    let timesTracker2 = [];
                    let iconTracker2 = [];
                    let tempTracker4 = [];

                    // Obtains the times, weather icons, and temperatures for every 3 hours.
                    // Specifically for TODAY

                    for(let i = 0; i < response.list.length; i++) {
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);
                        let currentDay = currentDate.split("-")[2];
                        currentDay = Number(currentDay);

                        if(apiDate === currentDay) {
                            let time = response.list[i].dt_txt;
                            time = time.split(" ")[1].split(":")[0];
                            time = Number(time);
                            
                            if(time < 12) {
                                if(time === 0) {
                                    time = "12 AM";
                                }
                                else {
                                    time = time + " AM";
                                }
                            }

                            else if(time >= 12) {
                                if(time === 12) {
                                    time = "12 PM";
                                }
                                else {
                                    time = time - 12;
                                    time = time + " PM";
                                }
                            }

                            let icon = response.list[i].weather[0].main;
                            let temp = response.list[i].main.temp;

                            timesTracker2.push(time);
                            iconTracker2.push(icon);
                            tempTracker4.push(temp);

                        }
                    }

                    setTodaysHourly(prevHourly => {
                        let newHourly = [...prevHourly, {times: timesTracker2, temps: tempTracker4, icons: iconTracker2}];
                        return newHourly;
                    });


                    // Gets the highest Temperature for TODAY
                    for(let i = 0; i < response.list.length; i++) {
                        let currentDay = currentDate.split("-")[2];
                        currentDay = Number(currentDay);
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);
                        let temp = response.list[i].main.temp_max;

                        if(apiDate === currentDay) {
                            if(initialized4 === false) {
                                highestTemp2 = response.list[i].main.temp_max;
                                weatherIcon = response.list[i].weather[0].main;
                                initialized4 = true;
                            }
                            else if(temp > highestTemp2) {
                                highestTemp2 = temp;
                            }
                        }
                    }

                    // Gets the lowest Temperature for TODAY
                    for(let i = 0; i < response.list.length; i++) {
                        let currentDay = currentDate.split("-")[2];
                        currentDay = Number(currentDay);
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);
                        let temp = response.list[i].main.temp_min;

                        if(apiDate === currentDay) {
                            currentDayCounter++;
                            if(initialized3 === false) {
                                lowestTemp2 = response.list[i].main.temp_min;
                                initialized3 = true;
                            }
                            else if(temp < lowestTemp2) {
                                lowestTemp2 = temp;
                            }
                        }
                    }

                    if(currentDayCounter > 0) {

                        setTodaysWeather(prevWeather => {
                            let newWeather = [...prevWeather, {low: lowestTemp2, high: highestTemp2, counter: currentDayCounter, icon: weatherIcon}];
                            return newWeather;
                        });

                    }


                    // gets the number of "times", temperatures and weather icons for each day + every 3 hours
                    for(let i = 0; i < response.list.length; i++) {
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);

                        if(apiDate !== nextDay2.getDate() && apiDate !== Number(currentDate.split("-")[2])) {
                            genTracker.push({counter: counter, times: timesTracker, temps: tempTracker3, icons: iconTracker});
                            counter = 0;
                            timesTracker = [];
                            tempTracker3 = [];
                            iconTracker = [];
                            nextDay2.setDate(nextDay2.getDate() + 1);
                        }

                        if(apiDate === nextDay2.getDate()) {
                            counter++;
                            let time2 = response.list[i].dt_txt.split(" ")[1].split(":")[0];
                            time2 = Number(time2);
                            timesTracker.push(time2);
                            let temp = response.list[i].main.temp;
                            tempTracker3.push(temp);
                            let icon = response.list[i].weather[0].main;
                            iconTracker.push(icon);
                        }
                    }

                    genTracker.push({counter: counter, times: timesTracker, temps: tempTracker3, icons: iconTracker});


                    setNumOfTimes(prevTimes => {
                        let newTimes = [...prevTimes, ...genTracker];
                        return newTimes;
                    });

                    setTimeChanger(!timeChanger);

                    // Gets the weather icon for each day
                    for(let i = 0; i < response.list.length; i++) {
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);

                        if(apiDate === nextDay.getDate()) {
                            let icon = response.list[i].weather[0].main;
                            setMainIcon(prevIcons => {
                                let newIcons = [...prevIcons, icon];
                                return newIcons;
                            });
                            nextDay.setDate(nextDay.getDate() + 1);
                        }
                    }

                    // Gets the lowest temperatures of each day

                    let currentDate2 = new Date();
                    let newDate = new Date();
                    newDate.setDate(newDate.getDate() + 1);
                    let initialized = false;
                    let lowestTemp;
                    let tempTracker = [];

                    for(let i = 0; i < response.list.length; i++) {
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);
                        let temp = response.list[i].main.temp_min;
                        
                        if(apiDate !== newDate.getDate() && apiDate !== currentDate2.getDate()) {
                            tempTracker.push(lowestTemp);
                            newDate.setDate(newDate.getDate() + 1);
                            initialized = false;
                        }

                        if(apiDate === newDate.getDate()) {
                            if(initialized === false) {
                                lowestTemp = response.list[i].main.temp_min;
                                initialized = true;
                            }
                            else {
                                if(temp < lowestTemp) {
                                    lowestTemp = temp;
                                }
                            }
                        }
                    }

                    tempTracker.push(lowestTemp);

                    setLowestDeg(prevDeg => {
                        let newDeg = [...prevDeg, ...tempTracker];
                        return newDeg;
                    });

                    // Gets the highest temperatures of each day

                    let currentDate3 = new Date();
                    let newDate2 = new Date();
                    newDate2.setDate(newDate2.getDate() + 1);
                    let initialized2 = false;
                    let highestTemp;
                    let tempTracker2 = [];

                    for(let i = 0; i < response.list.length; i++) {
                        let apiDate = response.list[i].dt_txt.split(" ");
                        apiDate = apiDate[0].split("-")[2];
                        apiDate = Number(apiDate);
                        let temp = response.list[i].main.temp_max;

                        if(apiDate !== newDate2.getDate() && apiDate !== currentDate3.getDate()) {
                            tempTracker2.push(highestTemp);
                            newDate2.setDate(newDate2.getDate() + 1);
                            initialized2 = false;
                        }
                        
                        if(apiDate === newDate2.getDate()) {
                            if(initialized2 === false) {
                                highestTemp = response.list[i].main.temp_max;
                                initialized2 = true;
                            }
                            else {
                                if(temp > highestTemp) {
                                    highestTemp = temp;
                                }
                            }
                        }
                    }

                    tempTracker2.push(highestTemp);

                    setHighestDeg(prevDeg => {
                        let newDeg = [...prevDeg, ...tempTracker2];
                        return newDeg;
                    });


                    // Checks the number of days available for weather forecast data
                    for(let i = 0; i < response.list.length; i++) {

                        if(i === 0) {
                            if(response.list[0].dt_txt.split(" ")[0] !== currentDate) {
                                setNumOfDays(prevNum => {
                                    let newNum = prevNum;
                                    newNum++;
                                    return newNum;
                                });
                            }
                        }
                        else {
                            if(response.list[i].dt_txt.split(" ")[0] !== response.list[i - 1].dt_txt.split(" ")[0]) {
                                setNumOfDays(prevNum => {
                                    let newNum = prevNum;
                                    newNum++;
                                    return newNum;
                                });
                            }
                        }
                    }


                    // converts time to numeric value + AM or PM
                    if(time < 12) {
                        if(time === "00") {
                            time = "12 AM";
                        }
                        else {
                            time = time[1] + " AM";
                        }
                    }
                    else if(time >= 12) {
                        if(time === "12") {
                            time = "12 PM";
                        }
                        else {
                            time = time - 12;
                            time = time + " PM";
                        }
                    }


                    // capitalize the first letter of each word for the user input
                    let newSearchInput;
                    if(searchOption === "citySearch") {
                        newSearchInput = searchInput.split(" ").map(currentVal => {
                        return currentVal.charAt(0).toUpperCase() + currentVal.slice(1);
                        });
                    }

                    setData(prevData => {
                        let newData = prevData;
                        // city name for data
                        if(searchOption === "citySearch") {
                            newData.city = newSearchInput.join(" ");
                        }
                        else if(searchOption === "geoSearch") {
                            if(response.city.name === "") {
                                newData.city = <span className="text-red-300 text-shadow-black">Unknown City</span>
                            }
                            else {
                                newData.city = response.city.name;
                            }
                        }
                        else if(searchOption === "zipSearch") {
                            newData.city = response.city.name;
                        }

                        // closest date and time for weather forecast
                        newData.date = date;
                        newData.time = time;
                        // stores what the temperature feels like
                        newData.feelsLike = feelsLike;
                        // stores the current temperature
                        newData.temp = temp;
                        // stores humidity level
                        newData.humidity = humidity;
                        // stores the minimum temperature
                        newData.minTemp = minTemp;
                        // stores the maximum temperature
                        newData.maxTemp = maxTemp;
                        // stores the weather description
                        newData.desc = desc;
                        // stores the weather condition
                        newData.condition = condition;
                        // stores the weather icon code
                        newData.iconCode = iconCode;
                        // stores the wind direction in degrees
                        newData.deg = deg;
                        // stores the maximum wind gust speed in miles per hour (mph)
                        newData.gust = gust;
                        // stores the wind speed in miles per hour (mph)
                        newData.windSpeed = windSpeed;

                        return newData;
                    });

                    setLoading(false);
                    // Search Status keeps track of whether the weather search button has been clicked 
                    setSearchStatus(true);
                    // Resets City Search
                    setCitySearch("");
                })

                .catch(error => {
                    console.error("Warning: " + error);
                    alert("Please input something valid.");
                    setLoading(false);
                    setWeatherSearched(false);
                });
        
    }


    function handleChange(e) {

        if(e.target.id === "citySearch") {
            setCitySearch(e.target.value);
        }
        else if(e.target.id === "geoLat") {
            setGeoSearch(prevSearch => {
                let newSearch = {lat: e.target.value, lon: prevSearch.lon};
                return newSearch;
            });
        }
        else if(e.target.id === "geoLon") {
            setGeoSearch(prevSearch => {
                let newSearch = {lat: prevSearch.lat, lon: e.target.value};
                return newSearch;
            });
        }
        else if(e.target.id === "zipSearch") {
            setZipCode(e.target.value);
        }

        if(e.key === "Enter" || e.target.id === "geoSearch") {

            if(e.target.id === "citySearch") {
                handleWeatherSearch(citySearch, "citySearch");
            }

            else if(e.target.id === "geoLat" || e.target.id === "geoSearch") {

                if(directions.south === true) {
                    if(geoSearch.lat !== "" && geoSearch.lon !== "") {
                        setGeoSearch(prevGeo => {
                            let newGeo = {lat: -prevGeo.lat, lon: prevGeo.lon};
                            return newGeo;
                        });
                    }
                }

                if(directions.west === true) {
                    if(geoSearch.lon !== "" && geoSearch.lat !== "") {
                        setGeoSearch(prevGeo => {
                            let newGeo = {lat: prevGeo.lat, lon: -prevGeo.lon};
                            return newGeo;
                        });
                    }
                }

                if(geoSearch.lat !== "" && geoSearch.lon !== "") {
                    if( (directions.north === false && directions.south === false ) || ( directions.east === false && directions.west === false ) ) {
                        alert("Please select one from each category (north/south) and (east/west)");
                    }
                    else {
                        setGeoPressed(true);
                    }
                }
                else {
                    alert(" Make sure both of the boxes are filled! ");
                }

            }

            else if(e.target.id === "geoLon" || e.target.id === "geoSearch") {

                if(directions.south === true) {
                    if(geoSearch.lat !== "" && geoSearch.lon !== "") {
                        setGeoSearch(prevGeo => {
                            let newGeo = {lat: -prevGeo.lat, lon: prevGeo.lon};
                            return newGeo;
                        });
                    }
                }

                if(directions.west === true) {
                    if(geoSearch.lon !== "" && geoSearch.lat !== "") {
                        setGeoSearch(prevGeo => {
                            let newGeo = {lat: prevGeo.lat, lon: -prevGeo.lon};
                            return newGeo;
                        });
                    }
                }

                if(geoSearch.lat !== "" && geoSearch.lon !== "") {
                    if( (directions.north === false && directions.south === false ) || ( directions.east === false && directions.west === false ) ) {
                        alert("Please select one from each category (north/south) and (east/west)");
                    }
                    else {
                        setGeoPressed(true);
                    }
                }
                else {
                    alert(" Make sure both of the boxes are filled! ");
                }
            }
            else if(e.target.id === "zipSearch") {
                handleWeatherSearch(zipCode, "zipSearch");
            }
        }
    }


    // A function that creates bar colors for a variety of temperature ranges

    function handleTempBarColors(low, high) {

        if(low < 32) {
            low = "from-blue-600";
        }
        else if(low >= 32 && low < 59) {
            low = "from-blue-300";
        }
        else if(low >= 59 && low < 68) {
            low = "from-green-400";
        }
        else if(low >= 68 && low < 77) {
            low = "from-yellow-200";
        }
        else if(low >= 77 && low < 86) {
            low = "from-orange-400";
        }
        else if(low >= 86) {
            low = "from-red-500";
        }


        if(high < 32) {
            high = "to-blue-600";
        }
        else if(high >= 32 && high < 59) {
            high = "to-blue-300";
        }
        else if(high >= 59 && high < 68) {
            high = "to-green-400";
        }
        else if(high >= 68 && high < 77) {
            high = "to-yellow-200";
        }
        else if(high >= 77 && high < 86) {
            high = "to-orange-400";
        }
        else if(high >= 86) {
            high = "to-red-500";
        }

        return { low, high };
    }

    function handleTodaysWeather() {
        let timeStamps = [];

        if(todaysWeather.length > 0) {
            for(let i = 0; i < todaysWeather[0].counter; i++) {
                timeStamps.push(
                    <div key={i} className="space-y-2 flex flex-col items-center text-white font-semibold text-shadow-black text-xl border-2 border-white p-4">
                        <p>{todaysHourly[0].times[i]}</p>
                        <img className="w-14" src={weatherMap.get(todaysHourly[0].icons[i])} />
                        <p>{todaysHourly[0].temps[i]}&deg;</p>
                    </div>
                );
            }
        }
        setTimeStampBoxes(timeStamps);
    }


    // Creates containers for each time stamp of the day
    function handleTimeStamps(key) {
        setOccupied(true);
        let timeStamps = [];

        for(let i = 0; i < numOfTimes[key].counter; i++) {

            timeStamps.push(
                <div key={i} className="space-y-2 flex flex-col items-center text-white font-semibold text-shadow-black text-xl border-2 border-white p-4">
                    <p>{numOfTimes[key].times[i]}</p>
                    <img className="w-14" src={weatherMap.get(numOfTimes[key].icons[i])} />
                    <p>{numOfTimes[key].temps[key][i]}&deg;</p>
                </div>
            );
        }

        setTimeStampBoxes(timeStamps);

    }

    let weatherBoxes = [];

    // Creates containers for each day of the weather forecast
    for(let i = 0; i < numOfDays; i++) {
        dateUse.setDate(dateUse.getDate() + 1);
        let barColor;
        let barColor2;

        // creates bar colors for temperature bars
        if(lowestDeg[i] < 32) {
            barColor = "from-blue-600";
        }
        else if(lowestDeg[i] >= 32 && lowestDeg[i] < 59) {
            barColor = "from-blue-300";
        }
        else if(lowestDeg[i] >= 59 && lowestDeg[i] < 68) {
            barColor = "from-green-400";
        }
        else if(lowestDeg[i] >= 68 && lowestDeg[i] < 77) {
            barColor = "from-yellow-200";
        }
        else if(lowestDeg[i] >= 77 && lowestDeg[i] < 86) {
            barColor = "from-orange-400";
        }
        else if(lowestDeg[i] >= 86) {
            barColor = "from-red-500";
        }


        if(highestDeg[i] < 32) {
            barColor2 = "to-blue-600";
        }
        else if(highestDeg[i] >= 32 && highestDeg[i] < 59) {
            barColor2 = "to-blue-300";
        }
        else if(highestDeg[i] >= 59 && highestDeg[i] < 68) {
            barColor2 = "to-green-400";
        }
        else if(highestDeg[i] >= 68 && highestDeg[i] < 77) {
            barColor2 = "to-yellow-200";
        }
        else if(highestDeg[i] >= 77 && highestDeg[i] < 86) {
            barColor2 = "to-orange-400";
        }
        else if(highestDeg[i] >= 86) {
            barColor2 = "to-red-500";
        }

        weatherBoxes.push( <div onClick={() => handleTimeStamps(i)} key={i} className="py-2 mb-5 flex flex-row items-center px-5 font-bold text-xl border-4 border-white cursor-pointer">
        <p className="text-black font-bold">{daysOfTheWeek[dateUse.getDay()]}</p>
        <img className="w-12 mx-12 scale-125" src={weatherMap.get(mainIcon[i])} />
        <p className="text-black font-bold">{lowestDeg[i]}&deg;</p>
        <div className={`mx-5 w-60 h-5 rounded-full bg-gradient-to-r ${barColor} ${barColor2}`}></div>
        <p className="text-black font-bold">{highestDeg[i]}&deg;</p>
    </div> );
    }

    let todaysLow = null;
    let todaysHigh = null;

    if(todaysWeather.length > 0) {
        todaysLow = todaysWeather[0].low;
        todaysHigh = todaysWeather[0].high;
        let updatedTemps = handleTempBarColors(todaysLow, todaysHigh);
        todaysLow = updatedTemps.low;
        todaysHigh = updatedTemps.high;
    }


    function handleDirections(e) {

        if(e.target.textContent === "North") {
            setDirections(prevDir => {
                let newDir = {north: true, east: prevDir.east, south: false, west: prevDir.west};
                return newDir;
            });
        }
        else if(e.target.textContent === "East") {
            setDirections(prevDir => {
                let newDir = {north: prevDir.north, east: true, south: prevDir.south, west: false};
                return newDir;
            });
        }
        else if(e.target.textContent === "South") {
            setDirections(prevDir => {
                let newDir = {north: false, east: prevDir.east, south: true, west: prevDir.west};
                return newDir;
            });
        }
        else if(e.target.textContent === "West") {
            setDirections(prevDir => {
                let newDir = {north: prevDir.north, east: false, south: prevDir.south, west: true};
                return newDir;
            });
        }
    }

    // Presentational Part
    return (
        <>
            <nav className="mt-10">
                <Link className="inline-block duration-300 transition-transform hover:scale-125 bg-blue-400 text-xl p-4 ml-10 font-bold text-shadow-white" to="/">Home Page</Link>
            </nav>

            <h1 onMouseEnter={() => setIconGlow(true)} onMouseLeave={() => setIconGlow(false)} className="py-5 shadow-cyan-500 shadow-lg bg-gradient-to-r from-white/50 to-gray-400/50 rounded-full mt-5 text-4xl text-center text-blue-500 text-shadow-black">
                Weather Forecast 
                <img className={`ml-5 w-10 inline-block ${iconGlow === true? "shadow-[0px_0px_5px_10px]" : ""} transition-shadow duration-300 shadow-cyan-300 bg-blue-500`} src={weatherIcon} />
            </h1>

            {/* 3 columns Main Container */}
            <div className="grid grid-cols-3 mt-10">
                {/* 1/3 Columns -- Left Column -- Weather Search Options */}
                <div className="col-span-1">

                    <div className="flex flex-col bg-white bg-opacity-50 h-[1000px]">

                        <label className="font-bold text-xl border-dashed border-4 border-white p-4 my-3" htmlFor="citySearch">Search By City</label>
                        <input onKeyUp={handleChange} onChange={handleChange} value={citySearch} className="text-xl border-4 border-green-900 p-4 my-3" id="citySearch" placeholder="Input City Name"/>
                        <button onClick={() => handleWeatherSearch(citySearch, "citySearch")} className="border-4 border-black bg-gray-400 py-3 hover:bg-gray-200 duration-300 font-bold text-xl">Search Weather</button>
                      
                        <label className="font-bold text-xl border-dashed border-4 border-white p-4 my-3" htmlFor="geoLat">Search By Geographic Coordinates <br /> <span className="text-red-500 text-shadow-black">&#10071;Please input POSITIVE values ONLY&#10071;</span> <br /> Maximum Latitude: 90 <br /> Maximum Longitude: 180</label>
                        <div className="flex flex-row space-x-4 border-4">
                            <input onKeyUp={handleChange} value={geoSearch.lat} onChange={handleChange} id="geoLat" className="text-xl border-4 border-green-900 p-4 my-3" placeholder="Input Latitude" />
                            <button className={`${directions.north === true ? "bg-green-500" : "bg-black"} text-white font-bold text-xl my-3 p-4 ${directions.north === true ? "" : "hover:bg-gray-600"} transition-colors duration-300`} onClick={handleDirections}>North</button>
                            <button className={`${directions.south === true ? "bg-green-500" : "bg-black"} text-white font-bold text-xl my-3 p-4 ${directions.south === true ? "" : "hover:bg-gray-600"} transition-colors duration-300`} onClick={handleDirections}>South</button>
                        </div>

                        <div className="flex flex-row space-x-4 border-4">
                            <input onKeyUp={handleChange} value={geoSearch.lon} onChange={handleChange} id="geoLon" className="text-xl border-4 border-green-900 p-4 my-3" placeholder="Input Longitude" />
                            <button className={`${directions.east === true ? "bg-green-500" : "bg-white"} text-black font-bold text-xl my-3 p-4 ${directions.east === true ? "" : "hover:bg-gray-300"} transition-colors duration-300`} onClick={handleDirections}>East</button>
                            <button className={`${directions.west === true ? "bg-green-500" : "bg-white"} text-black font-bold text-xl my-3 p-4 ${directions.west === true ? "" : "hover:bg-gray-300"} transition-colors duration-300`} onClick={handleDirections}>West</button>
                        </div>

                        <button id="geoSearch" onClick={handleChange} className="border-4 border-black bg-gray-400 py-3 hover:bg-gray-200 duration-300 font-bold text-xl">Search Weather</button>

                        <label className="font-bold text-xl border-dashed border-4 border-white p-4 my-3" htmlFor="zipSearch">Search By Zip Code (US Locations Only)</label>
                        <input onKeyUp={handleChange} onChange={handleChange} value={zipCode} id="zipSearch" className="text-xl border-4 border-green-900 p-4 my-3" placeholder="Input Zip Code" />
                        <button onClick={() => handleWeatherSearch(zipCode, "zipSearch")} className="border-4 border-black bg-gray-400 py-3 hover:bg-gray-200 duration-300 font-bold text-xl">Search Weather</button>

                    </div>

                </div>
                {/* Right Container -- Weather Data -- takes up 2/3 of the width */}
                <main className="bg-white col-span-2 px-5 flex flex-col bg-opacity-50 h-[1400px]">
                    
                    <h2 className="shadow-yellow-400 shadow-lg bg-orange-300 rounded-full mb-5 w-full text-center text-3xl text-yellow-600 text-shadow-black mt-5">&darr; &darr; Weather Data &darr; &darr;</h2>
                    <p className="mb-5 w-full text-center text-5xl mt-5 font-bold text-yellow-400">{loading === true? "Loading..." : ""}</p>
                    
                    <div className="flex flex-row border-8 border-white rounded-lg border-dashed">

                        {/* Left Container -- 1/3 width */}
                        <div className="bg-white w-1/3 p-4 space-y-4 bg-opacity-50">
                            { (weatherSearched === true) && (loading === false) ? (
                                <>
                                 <h3 className="text-white font-bold text-2xl text-shadow-black">{loading === false && searchStatus === true? (
                                <>
                                    City: <span className="text-black text-shadow-white ml-5">{data.city}</span>
                                </>
                            ) : ""}</h3>
                            <p className="text-white font-bold text-2xl text-shadow-black">{loading === false && searchStatus === true? (
                                <>
                                    <span className="text-blue-800 text-shadow-white leading-[2.5rem]">Closest Time and Date Available for weather forecast &darr; &darr; &darr; &darr; &darr; </span>
                                    <br />
                                    <br />
                                    Closest Time: 
                                    <span className="text-black text-shadow-white ml-5 inline-block mb-5"> {data.time} </span>
                                    Closest Date: 
                                    <br />
                                    <span className="text-black text-shadow-white inline-block my-2"> {data.date} </span>
                                    <br />
                                    <span className="mr-4 inline-block my-3">Feels Like: </span> <span className="text-black text-shadow-white"> {data.feelsLike} &deg; F </span>
                                    <br />
                                    &#127777; Temperature: 
                                    <br />
                                    <span className="text-black text-shadow-white inline-block my-3">{data.temp} &deg; F</span>
                                    <br />
                                    &#127777; Minimum Temperature: 
                                    <br />
                                    <span className="text-black text-shadow-white inline-block my-3"> {data.minTemp} &deg; F </span>
                                    <br />
                                    &#127777; Maximum Temperature: 
                                    <br />
                                    <span className="text-black text-shadow-white inline-block my-3"> {data.maxTemp} &deg; F </span>
                                    <br />
                                    &#128167; Humidity Level: <span className="text-black text-shadow-white ml-1">{data.humidity} %</span>
                                    <img className="inline-block w-20" src={`http://openweathermap.org/img/wn/${data.iconCode}.png`} />
                                    <span className="text-black text-shadow-white"> {data.desc} </span>
                                    <br />
                                    Condition: <span className="text-black text-shadow-white ml-5 my-3 inline-block">{data.condition}</span>
                                    <br />
                                    Wind Direction: <span className="ml-5 text-black text-shadow-white my-5 inline-block">{data.deg} &deg; &#127787; </span>
                                    <br />
                                    Max Wind Gust Speed: 
                                    <br />
                                    <span className="text-black text-shadow-white inline-block my-5">{data.gust} Miles Per Hour &#127788; </span>
                                    <br />
                                    Normal Wind Speed:
                                    <br />
                                    <span className="text-black text-shadow-white inline-block my-5">{data.windSpeed} Miles Per Hour &#127744; </span>
                                </>

                                ) : ""}</p>
                                </>
                                 ) : "" }

                            </div>

                        {/* Right Container -- 2/3 width */}
                        <div className="bg-white w-2/3 bg-opacity-50">
                            {/* Container for weather time and temperature */}
                            <div className="flex flex-row space-x-10 px-5 py-5 border-white border-4 overflow-auto">
                                {todaysWeather.length > 0 ? todaysWeather[0].counter === 0 ? " No more weather forecast data for today! " : occupied === false ? timeStampBoxes : "" : occupied === true? "" : (weatherSearched === true) && (loading === false) ? <p className="text-red-500 text-shadow-black text-2xl font-bold mx-auto"><span className="text-4xl">&#9888;</span> No more weather forecast data for today! <span className="text-4xl">&#9888;</span></p> : <p className="font-bold text-xl text-white text-shadow-black">Please search for the weather to get weather forecast information! <span className="text-2xl ml-5">&#128513;</span></p>}
                                {occupied === true? timeStampBoxes : ""}
                                
                            </div>
                            {/* Line separator */}
                            <hr className="border-8 border-white shadow-[0px_0px_5px_0px] shadow-white" />
                            
                            {/* X-Day Weather Forecast */}
                            <div className="flex flex-col text-white my-5">

                                {todaysWeather.length > 0 ? 
                                    <div onClick={handleTodaysWeather} className="py-2 mb-5 flex flex-row items-center px-5 font-bold text-xl border-4 border-white cursor-pointer">
                                        <p className="text-black font-bold">Today</p>
                                        <img className="w-12 mx-14 scale-125" src={weatherMap.get(todaysWeather[0].icon)} />
                                        <p className="text-black font-bold">{todaysWeather[0].low}&deg;</p>
                                        <div className={`mx-5 w-60 h-5 rounded-full bg-gradient-to-r ${todaysLow} ${todaysHigh}`}></div>
                                        <p className="text-black font-bold">{todaysWeather[0].high}&deg;</p>
                                    </div> : ""}

                                {weatherBoxes}

                            </div>
                        </div>

                    </div>
                
                </main>

            </div>
        </>
    );
}


