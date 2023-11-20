const express = require("express");
const path = require('path')
const app = express();

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const connectionDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const docRouter = require('./routes/docs')
 
app.use(express.static('public'));
//Template engine 
const User = require('./models/Users')
const Posts = require('./models/Post').Posts

app.set('views', path.join(__dirname, '/views'))
app.use(expressLayout);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectionDB();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', reason.stack || reason);
    
  });
  
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send('Internal Server Error');
});

//Routes
app.get('/', (req, res) => {
    res.render('auth/welcome');
});
const ensureAuthenticated = require('./config/auth');

 

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('main/dashboard', { name: req.user.name })
});

// 

app.get('/edit', async (req, res) => {
    const id = req.params.id;
   const users = await Posts.findById(id);
   res.render('main/updatUser', { title: "edit Page", users });
});

// delete 
app.delete('/deletePost/:postId', async (req, res) => {
  try {
    const deletedPost = await Posts.findByIdAndRemove(req.params.postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    } 

    // Optionally, you may want to remove the post reference from the user's files array
    await User.findByIdAndUpdate(
                  req.user._id,
                  { $pull: { files: deletedPost._id } },
                  { new: true }
              );
  res.redirect('/myfile')
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

app.get('/update/:postId', async (req, res) => {
    try {
      const post = await Posts.findById(req.params.postId);
      res.render('main/updatUser', { post });
    } catch (error) {
     
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/update/:postId', async (req, res) => {
    try {
      const { title, author, sum } = req.body;
  
      // Ensure that the required fields are present
      if (!title || !author || !sum) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Retrieve the current post to get the existing tags
      const currentPost = await Posts.findById(req.params.postId);
  
      // Check if tags property is present and not null before splitting
      const tags = req.body.tags.split(' ');
  
      await Posts.findByIdAndUpdate(
        req.params.postId,
        {
          title,
          author,
          sum,
          tags:tags,
        }
      );
  
      res.redirect('/myfile');
    } catch (error) {
      console.error('Error updating post:', error);
  
      // Log the error and provide a more detailed error response
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });
  
// 


app.get('/myfile', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch both public and private notes associated with the user
        const user = await User.findById(req.user._id).populate('files');
  
     
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        // Optionally, you can filter public and private files based on visibility
        const publicFiles = user.files.filter(file => file.visibility === 'public');
        const privateFiles = user.files.filter(file => file.visibility === 'private');
  
        res.render('main/myfile', {
            username: req.user.name,
            publicFiles: publicFiles,
            privateFiles: privateFiles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 
  

app.use('/qna', ensureAuthenticated, require('./routes/quesAndAns'))
app.use('/main', ensureAuthenticated, require('./routes/main'));
// app.use('/docs', ensureAuthenticated, docRouter);
app.use('/docs', docRouter);
app.use('/users', require('./routes/users'));
app.listen(PORT, () => console.log( `Server listen at port ${PORT}`));