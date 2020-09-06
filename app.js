//NPM requirements
var bodyParser           = require('body-parser'),
    express              = require('express'),
    MethodOverride       = require('method-override'),
    expressSanitizer     = require('express-sanitizer');
    mongoose             = require('mongoose'),
    app                  = express();

var port = 3000;

//Connection to Local DataServer
mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true, useUnifiedTopology: true });

//Setting Block
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(MethodOverride('_method'));


//Mongoose ModeL Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//Index Page
app.get('/', function(req, res) {
    res.redirect("/blogs");
});

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("Error!!");
        } else {
            res.render("index", { blogs: blogs })
        }
    });
});

//New Route
app.get('/blogs/new', function(req, res) {
    res.render("new");
});

//Create Route 
app.post('/blogs', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //Create blog 
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    })

});

//Show Blogs Route
app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', { blog: foundBlog });

        }
    });
});

//Edit Route
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', { blog: foundBlog });
        }
    });
});

//Update Route
app.put('/blogs/:id', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

//Delete Route
app.delete('/blogs/:id', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("show");
        } else {
            res.redirect('/blogs/');
        }
    });
});


// Listen and Run at the server
//app.listen(process.env.PORT, process.env.IP);

//Listen and Run at Local Server
app.listen(port, function() {
    console.log("App Started at localhost:3000");
});