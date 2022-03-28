var express = require('express'); 
var app = express(); 
const path = require("path");
const axios = require('axios');
const { render } = require('pug');
const URL = 'https://la1.api.riotgames.com'
const V = 'https://ddragon.leagueoflegends.com/realms/na.json'
const ApiKey = 'RGAPI-8dddf6d9-34f3-45fe-a2cb-8895a12b09fe'
const AUTH = '?api_key=' + ApiKey


let port = process.env.PORT || 8080

console.log("Server is running in port : " + port)

let name
let id
let version
let icon
let iconURL 
let account

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.render("home");
});

axios.get(V)
  .then((response) => {
    version=response.data.v
})


app.post("/me", function (req, response){
  var resp = req.body.me;
  if (resp != "") {
    axios.get(URL + '/lol/summoner/v4/summoners/by-name/' + resp + AUTH)
        .then((res) => {
          account = res.data.accountId
          id = res.data.id
          name = res.data.name
          icon = res.data.profileIconId
          iconURL = 'http://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + icon + '.png'
          response.render("profile", {name: name, level: res.data.summonerLevel, icon: iconURL, url: URL + '/lol/summoner/v4/summoners/by-name/' + name + AUTH});
        })
        .catch( (error) =>{
          response.render("errors", {code: error.response.status, text: error.response.statusText});
        })
    
  } else {
    response.render("errors", {code: "No User", text: "Ingresa un nombre de usuario"});
  }
});

app.get("/masteries", function (req, response){
  var resp = req.query.champ;
    axios.get('http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/champion.json')
        .then((res) => {
          response.render("masteries", {name: name, champs: res.data.data, version: version ,url: 'http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/champion.json'});
        })
        .catch( (error) =>{
          response.render("errors", {code: error.response.status, text: error.response.statusText});
        
        })
});

app.get("/mastery", function (req, response){
  var resp = req.query.champId;
  var champ = req.query.champ;
    axios.get(URL + '/lol/champion-mastery/v4/champion-masteries/by-summoner/' + id + '/by-champion/' + resp + AUTH)
        .then((res) => {
          response.render("mastery", {level: res.data.championLevel, champ:champ, version: version, points: res.data.championPoints, URL: URL + '/lol/champion-mastery/v4/champion-masteries/by-summoner/' + id + '/by-champion/' + resp + AUTH});
        })
        .catch( (error) =>{
          response.render("errors", {code: error.response.status, text: error.response.statusText});
        
        })
});

app.get("/rank", function (req, response){
    axios.get(URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH)
        .then((res) => {
          response.render("rank", {name: name, tier: res.data[0].tier, rank: res.data[0].rank, points: res.data[0].leaguePoints, wins:res.data[0].wins, losses: res.data[0].losses, icon: iconURL, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
        })
        .catch( (error) =>{
          response.render("errors", {code: error.response.status, text: error.response.statusText});
        
        })
});

app.get("/challengers", function (req, response){
  axios.get(URL + '/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5' + AUTH)
      .then((res) => {
        r=res.data
        response.render("challengers", {name:r.name, users: r.entries, version:version, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
      })
      .catch( (error) =>{
        response.render("errors", {code: error.response.status, text: error.response.statusText});
      
      })
});

app.get("/matches", function (req, response){
  axios.get(URL + '/lol/match/v4/matchlists/by-account/' + account + AUTH)
      .then((res) => {
        r=res.data
        response.render("match", {name:r.name, matches: r.matches, version:version, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
      })
      .catch( (error) =>{
        response.render("errors", {code: error.response.status, text: error.response.statusText});
      
      })
});

app.get("/posts", function (req, response){
  response.render("posts")
});

app.post("/masters", function (req, response){
  const queue = req.body.queue
  axios.get(URL + '/lol/league/v4/masterleagues/by-queue/' + queue + AUTH)
      .then((res) => {
        r=res.data
        response.render("challengers", {name:r.name, users: r.entries, version:version, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
      })
      .catch( (error) =>{
        response.render("errors", {code: error.response.status, text: error.response.statusText});
      
      })
  // response.end()
});

app.post("/grandmasters", function (req, response){
  const queue = req.body.queue
  axios.get(URL + '/lol/league/v4/grandmasterleagues/by-queue/' + queue + AUTH)
      .then((res) => {
        r=res.data
        response.render("challengers", {name:r.name, users: r.entries, version:version, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
      })
      .catch( (error) =>{
        response.render("errors", {code: error.response.status, text: error.response.statusText});
      
      })
  // response.end()
});

app.post("/leagues", function (req, response){
  const queue = req.body.queue
  const tier = req.body.tier
  const division = req.body.division
  axios.get(URL + '/lol/league/v4/entries/' + queue +'/' + tier + '/' + division + AUTH)
      .then((res) => {
        r=res.data
        response.render("leagues", {queue:queue, users: r, version:version, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
      })
      .catch( (error) =>{
        response.render("errors", {code: error.response.status, text: error.response.statusText});
      
      })
});

app.post("/exp", function (req, response){
  const queue = req.body.queue
  const tier = req.body.tier
  const division = req.body.division
  axios.get(URL + '/lol/league-exp/v4/entries/' + queue +'/' + tier + '/' + division + AUTH)
      .then((res) => {
        r=res.data
        response.render("leagues", {queue:queue, users: r, version:version, url:URL + '/lol/league/v4/entries/by-summoner/' + id + AUTH});
      })
      .catch( (error) =>{
        response.render("errors", {code: error.response.status, text: error.response.statusText});
      
      })
});

app.listen(port)
