// const express = require("express");
// const app = express();
// const path = require("path");
// const router = express.Router();


// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// router.get("/", (req, res) => {
//   res.render("index");
// });

// router.get("/about", (req, res) => {
//   res.render("about", { title: "Hey", message: "Hello there!" });
// });

// app.use("/", router);
// app.listen(process.env.port || 8080);

// console.log("Running at Port 8080");

// app.post('/summoner', (req, res)=>{ 
//     var myText = req.body; //mytext is the name of your input box
//     res.send('Your Text:' + myText); 
// }); 

var express = require('express'); 
var app = express(); 
const path = require("path");
const axios = require('axios')
const URL = 'https://la1.api.riotgames.com'
const V = 'https://ddragon.leagueoflegends.com/realms/na.json'
const AUTH = '?api_key=RGAPI-40dc18be-d680-492f-87d4-7dff44064222'


let name
let id
let version

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

axios.get(V)
  .then((response) => {
    v=response.data.v
    console.log(v);
    res.send(response.data)

})


app.get("/me", function (req, response){
  var resp = req.query.me;
  if (resp != "") {
    axios.get(URL + '/lol/summoner/v4/summoners/by-name/' + resp + AUTH)
        .then((res) => {
          console.log(res.data)
          name = res.data.name
          response.render("profile", {name: name, level: res.data.summonerLevel, icon: res.data.profileIconId, url: URL + '/lol/summoner/v4/summoners/by-name/' + name + AUTH});
        })
    
  } else {
      response.send("Please provide us first name");
  }
});

app.get("/me", function (req, res){
  res.render("summoner");
});
app.listen(8080)