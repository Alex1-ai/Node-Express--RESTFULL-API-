// requiring all the modules we installed

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

// creating a new app
const app = express()

// setting the template engine to ejs syntax
app.set('view engine', ejs);

//body parser for taking input from user
app.use(bodyParser.urlencoded({extended:true}))

// public directory to store static files
app.use(express.static("public"))


// setting up connection to the database
mongoose.connect("mongodb://localhost:27017/wikiDB")

// create a schema for the database
const articleSchema = {
    title: String,
    content: String
}


const Article = mongoose.model("Article",articleSchema)

/////////////////////////////////// REQUEST TARGETING ALL ARTICLES ////////////////////////////////////////

app.route('/articles')
.get(function(req,res){
    Article.find({},function(err,foundArticle){
        // console.log(foundArticle)
        if(!err){
            res.send(foundArticle)
        }else{
            res.send(err)
        }
        
    })
})
.post(function(req,res){
    // console.log(req.body.title)
    // console.log(req.body.content)

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new article")
        }else{
            res.send(err)
        }
    })
})
.delete(function(req,res){
    Article.deleteMany({}, function(err){
        if (!err){
            res.send("Successfully deleted")
        }else{
            res.send(err)
        }
    })
});



///////////////////////////////////////////// REQUEST TARGETING A SPECIFIC ARTICLE /////////////////////////////////
app.route('/articles/:articleTitle')
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}, function(err,foundArticle){
        if (foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No article matching that tile was found")
        }
    })

})
.put(function(req, res){

    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successful updated")
            }else{
                res.send(err)
            }
        }
    );
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.body.title},
        function(err){
            if(!err){
                res.send("Successfully deleted")
            }else{
                res.send(err)
            }
        }

    )
});

// ANOTHER WAY OF USING THE RESTAPI

// app.get('/articles', function(req,res){
//     Article.find({},function(err,foundArticle){
//         // console.log(foundArticle)
//         if(!err){
//             res.send(foundArticle)
//         }else{
//             res.send(err)
//         }
        
//     })
// })

// app.post('/articles', function(req,res){
//     // console.log(req.body.title)
//     // console.log(req.body.content)

//     const newArticle = new Article({
//         title:req.body.title,
//         content:req.body.content
//     })
//     newArticle.save(function(err){
//         if(!err){
//             res.send("Successfully added new article")
//         }else{
//             res.send(err)
//         }
//     })
// })



// app.delete('/articles', function(req,res){
//     Article.deleteMany({}, function(err){
//         if (!err){
//             res.send("Successfully deleted")
//         }else{
//             res.send(err)
//         }
//     })
// })
// app.get('/', function(req,res){
//     return res.send("Hello world")
// })


app.listen(3000,function(){
    console.log("Server started on 3000")
})