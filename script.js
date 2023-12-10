const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");
const submitBtn = inputPart.querySelector("#submitBtn");

let api;

inputField.addEventListener("keyup", e =>{
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != "yo"){
        requestApi(inputField.value);
    }
});
submitBtn.addEventListener("click", () => {
    if (inputField.value !== "yo") {
        requestApi(inputField.value);
    }
});

// Add an event listener for the Enter key on the input field
inputField.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && inputField.value !== "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser does not support geolocation API");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=39578674d82cbd6b439c3e0669d3d9a2`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=39578674d82cbd6b439c3e0669d3d9a2`;
    fetchData();
}

function onError(error){
    // if any error occurs while getting user location, show it in infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting API response and parsing it into a JavaScript object
    // calling weatherDetails function with the API result as an argument
    fetch(api)
        .then(res => res.json())
        .then(result => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info){
    if(info.cod == "404"){ // if the entered city name is not valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} is not a valid city name`;
    }else{
        // getting required properties value from the weather information
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        // using custom weather icon based on the id provided by the API
        if(id == 800){
            wIcon.src = "clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "rain.svg";
        }
        
        // updating the weather information in the UI
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
