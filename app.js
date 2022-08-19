const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const url = process.env.wiki_Url

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

mongoose.connect(url, {useNewUrlParser: true})
const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.get("/articles", function(req,res){
    Article.find((err, foundArticles)=>{
        if(err){
            res.send(err)
        }else{
            res.send(foundArticles)

        }
        

    })
})

app.post("/articles", (req,res)=>{
   
   const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
   })
   newArticle.save((err)=>{
    if(err){
        console.log(err)
    }else{
        res.send("successfully added new article")
    }
   })
    

} )


app.listen(3000, ()=>{
    console.log('server started on port 3000')
})