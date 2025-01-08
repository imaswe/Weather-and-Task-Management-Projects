// updated part 1 code

function handleWeatherSearch(searchInput, searchOption) {

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
    // 5 Day / 3 Hour Forecast Data API Call URL
    let weatherSearch;
    if(searchOption === "citySearch") {
        weatherSearch = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&appid=${apiKey}`);
    }
    else if(searchOption === "geoSearch") {
        weatherSearch = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchInput.lat}&units=imperial&lon=${searchInput.lon}&appid=${apiKey}`);
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

                    console.log("Test 1 = " + time);
                    console.log("Test 2 = " + icon);
                    console.log("Test 3 = " + temp);

                    timesTracker2.push(time);
                    iconTracker2.push(icon);
                    tempTracker4.push(temp);

                }
            }

            setTodaysHourly(prevHourly => {
                let newHourly = [...prevHourly, {times: timesTracker2, temps: tempTracker4, icons: iconTracker2}];
                return newHourly;
            });


            for(let i = 0; i < response.list.length; i++) {
                console.log("date ---> " + response.list[i].dt_txt.split(" ")[0]);
            }

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

            console.log("Gen tracker length --- > " + genTracker.length);

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


            console.log("num of days: " + numOfDays);
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
                    console.log(time + " < ----- Time");
                }
            }

            console.log(response.city + " < ======= RESPONSE");


            // capitalize the first letter of each word for the user input
            let newSearchInput;
            if(searchOption === "citySearch") {
                newSearchInput = searchInput.split(" ").map(currentVal => {
                return currentVal.charAt(0).toUpperCase() + currentVal.slice(1);
                });
            }

            console.log(newSearchInput);

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
                console.log("CITY NAME = " + response.city.name);
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

