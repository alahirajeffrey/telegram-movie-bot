const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const request = require("request")

const TOKEN = process.env.TOKEN
const OMDB_API_KEY = process.env.OMDB_API_KEY 

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, {polling: true})

bot.onText(/\/movie (.+)/,(message, match)=>{
    
    const chatId = message.chat.id
    const movieName = match[1]

    //make request to omdb api
    request(`https://www.omdbapi.com/?t=${movieName}&apikey=${OMDB_API_KEY}`, (error, response, body)=>{
        if(!error && response.statusCode == 200){
            bot.sendMessage(chatId, `Searching...`, {parse_mode:'Markdown'})
            .then((message)=>{
                const res= JSON.parse(body)

                //send movie info to user
                bot.sendPhoto(chatId, res.Poster, {caption: 
                    'Result: \nTitle: ' + res.Title + 
                    '\nRated: ' + res.Rated + 
                    '\nReleased: ' + res.Released + 
                    '\nGenre: ' + res.Genre +
                    '\nPlot: ' + res.Plot +
                    '\nRatings: ' + res.Ratings})
            })            
        }
    })
})

