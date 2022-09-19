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
 
/// ------------------Request targetting all articles -----------------------------///

app.route("/articles")
.get(function(req,res){
    Article.find((err, foundArticles)=>{
        if(err){
            res.send(err)
        }else{
            res.send(foundArticles)

        }
        

    })
})
.post((req,res)=>{
   
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
    

})
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err){
            res.send(err)

        }else{
            res.send("successfully deleted all articles")
        }
    })
    
});

// ----------------------Request Targetting specific article ------------------------//

app.route("/articles/:articleTitle")
.get((req,res)=>{

    Article.findOne({title:req.params.articleTitle}, (err, foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No Articles found"+err)
        }
    })

})

.put((req,res)=>{
    Article.updateMany(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        //{overwrite:true},
        function (err){
            if(!err){
                res.send("Successfully updated article")
                
            }else{
                res.send(err)
            }
            

        })
})
.patch((req,res)=>{
    Article.updateMany(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article")
            }else{
                res.send(err)
            }
        }

    )
})

.delete((req,res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted corresponding article")
            }else{
                res.send(err)
            }
        }
    )
})



app.listen(3000, ()=>{
    console.log('server started on port 3000')
})