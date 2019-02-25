const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const exphbs = require('express-handlebars')
const bodyParser=require('body-parser')
//require('dotenv').config()
const cloudinary = require('cloudinary')
const Blog =require('./models/Blog')
const ENV=require('dotenv');

ENV.config();

const app= express();

require('./config/cloudinary')

console.log(process.env.CLOUD_NAME)

mongoose.connect("mongodb://localhost/cloud",{useNewUrlParser:true})

// on connect //
mongoose.connection.on('connected',()=>{
    console.log("coonected to server")
})

// on connection error //
mongoose.connection.on('err',()=>{
    console.log("Db error"+err)
})

// multer //
const multer = require('multer')

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
      cb(new Error('File is not supported'), false)
      return
    }

    cb(null, true)
  }
})



// engine setup for handlebars //
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
  })
  
  app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs', {
      blogs
    })
  })
  
  // form data will come here //

  app.post('/create_blog', upload.single('image'), async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path)
    const blog = new Blog()
    blog.title = req.body.title
    blog.imageUrl = result.secure_url
    await blog.save()
    res.send({
      message: 'Blog is Created',
      result
    })
  })
  
  // it wiill show about us info //
  app.get('/about', (req, res) => {
    res.render('about')
  })


 // displlay images //
 app.get('/images', async (req,res)=>{
  const blogs =  await Blog.find({})
  res.render('images', {
    blogs
  })
 })

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("sever run on port "+port)
})