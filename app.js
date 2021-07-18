const express = require('express')
const request = require('request')
const https = require('https')
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html")
})

app.post("/", function(req,res){
    // console.log("POST recieved!!");

    const query = req.body.cityName
    const apiKey = "9a84c6a1b731a10a764aec343e7c80ab"
    const units = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`

    https.get(url, function(response){
        console.log(response.statusCode)
        if (response.statusCode === 200){
            response.on("data", function(data){
                const weatherData = JSON.parse(data)
                // console.log(weatherData);
                
                const temp = weatherData.main.temp
                const desc = weatherData.weather[0].description
                const icon = weatherData.weather[0].icon
                const imgURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"
                const maxT = weatherData.main.temp_max
                const minT = weatherData.main.temp_min
                const pressure = weatherData.main.pressure
                const humidity = weatherData.main.humidity
                const windS = weatherData.wind.speed
    
                
    
                res.send(`
                        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
                        <style>
                        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');
    
                        body{
                            font-family: 'Montserrat', sans-serif;
                            background-image: linear-gradient(#eecda3, yellow);
                        }
                        
                        span{
                            text-decoration: underline;
                            color: rgb(31, 29, 29);
                        }
                        
                        i{
                            font-size: 4em;
                        }
                        
                        
                        
                        .bdr{
                            padding-right: 83px;
                            border-right: 1px solid black;
                        }
                        
                        .myfa{
                            display: block;
                            margin: auto;
                            width: 34%;
                            font-weight: normal;
                        }
                        
                        .container{
                            width: 55%;
                            margin: 11% auto 0px;
                        }
                        
                        .f-container{
                            width: 71%;
                            margin: 30px auto 0px;
                            padding: 6px;
                            display: flex;
                            justify-content: space-around;
                        }
                        h3{
                            text-align: center;
                        }
                        .btn{
                            padding:6px;
                            background-color: orange;
                            color: white;
                            font-family: 'Montserrat', sans-serif;
                            border: 1px solid black;
                            margin-left: 16%;
                            margin-top: 50px;
                            font-size: 1.5em;
                            border-radius: 15px;
                            outline: none;
                            cursor: pointer;
                        }
                        </style>
    
    
    
                        <!-- HTML Starts -->
    
    
    
                        <div class="container">
                        <h1>The Temperature in <span>${query}</span> is ${temp} &#176;C</h1>
                        <h1>The Weather is currently ${desc}</h1>
                        <img src="${imgURL}" alt="IMAGE Loading Error">
                    </div>
                    <div class="f-container">
                        <div class="item bdr">
                            <i class="fas fa-temperature-high myfa"></i>
                            <p>Max Temp.</p>
                            <h3>${maxT} &#176;C</h3>
                        </div>
                        <div class="item bdr">
                            <i class="fas fa-temperature-low myfa"></i>
                            <p>Min Temp</p>
                            <h3>${minT} &#176;C</h3>
                        </div>
                        <div class="item bdr">
                            <i class="fal fa-humidity myfa"></i>
                            <p>Humidity</p>
                            <h3>${humidity} %</h3>
                        </div>
                        <div class="item bdr">
                            <i class="fas fa-arrow-down myfa"></i>
                            <p>Pressure</p>
                            <h3>${pressure} hpa</h3>
                        </div>
                        <div class="item">
                            <i class="fas fa-wind myfa"></i>
                            <p>Wind Speed</p>
                            <h3>${windS} m/s</h3>
                        </div>
                        <!-- <i class="fas fa-wind"></i> -->
                    </div>
                    <div class="t-container">
                        <form action="/redirect" method="POST">
                            <button class="btn">Search for another City</button>
                        </form>
                    </div>
                    
    
                    `)
                    })
        } else {
            res.send(`
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');
                    h1,h2{
                        font-family: 'Montserrat', sans-serif;
                        text-align: center;
                    }
                    span{
                        color: red;
                    }
                    .fas{
                        font-size: 5em;
                        display: block;
                        margin: auto;
                        width: 8%
                    }
                    .btn{
                        padding:10px;
                        background-color: orange;
                        color: white;
                        font-family: 'Montserrat', sans-serif;
                        border: 1px solid black;
                        font-size: 1.5em;
                        border-radius: 15px;
                        outline: none;
                        cursor: pointer;
                        display: block;
                        width: 14%;
                        margin: 27px auto;
                    }
                </style>
                <h1>Ooooops, No Results found for <span>${query}</span></h1>
                <h2>Try again by searching a different City</h2>
                <i class="fas fa-exclamation-triangle"></i>

                <form action="/redirect" method="POST">
                    <button class="btn">Get Me Back!!</button>
                </form>
            `)
        }
        
    })
}) 

app.post("/redirect", function(req,res){
    res.redirect("/")
})

    
app.listen(process.env.PORT || "3000", ()=> {
    console.log("Port ready to serve at 3000")
})