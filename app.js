const express = require('express');
const app = express();
const cors = require('cors');

const multer = require('multer');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
})

const upload = multer({ storage: storage }).single('preview_image');

const authRoutes = require('./api/auth/routes');
const homepageRoutes = require('./api/homepage/routes')

const PORT = 8000;
const TOKEN_SECRET = 'e4193e393dd4735fa17c18de1c5069b82ec7593541f53cb4e08122d95a8d6f68dc607c54dc44834b78a5a1057fca384c1837a8c392e4c1a'


// Middlewares
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded())
app.use(express.json())
app.use(authRoutes)
app.use(homepageRoutes)

app.post('/upload',  (req, res) => {
  console.log(req.body);
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500)
    }
    console.log(req.file);
    res.send(req.file)
  })
})


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});