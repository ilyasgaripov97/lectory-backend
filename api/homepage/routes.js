const express = require('express')
const router = express.Router();

const HomepageService = require('../../services/hompage/service');

/* temp */
const multer = require('multer');
const { response } = require('express');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
})
const upload = multer({ storage: storage }).single('preview_image');
const uploadUpdatedImage = multer({ storage: storage }).single('updated_material_image');
/* temp */

router.post('/user/:id_user/materials/new', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.sendStatus(500)
    }
    const id_user = req.params.id_user;
    const previewImagePath ='http://localhost:8000/' + req.file.filename;


    const material = {
      title: req.body.title,
      body: req.body.body,
      previewImagePath,
    };
  
    const response = { data: null, error: null };
  
    try {
      await HomepageService.createMaterial(id_user, material)
      response.data = "200";
    } catch (error) {
      console.log(error);
      response.error = error;
    }
    res.send({ imgPath: 'http://localhost:8000/' + req.file.filename})
  })
});

router.post('/user/:id_user/materials/:id_material/update_image', (req, res) => {
  uploadUpdatedImage(req, res, async (err) => {
    if (err) {
      res.send(500);
    }
    
    const { id_user, id_material } = req.params;
    const previewImagePath = 'http://localhost:8000/' + req.file.filename;
    const { title, body } = req.body;
     const queryValues = [title, previewImagePath, body];

    try {
      await HomepageService.updateMaterial(id_user, id_material, queryValues)
    } catch(error) {
      console.log(error);
    }
    res.send({ imgPath: 'http://localhost:8000/' + req.file.filename})
  })
 })

router.get('/user/:id_user/materials', async (req, res) => {
    const id_user = req.params.id_user;
    let response = {}
    try {
      response.data = await HomepageService.fetchMaterials(id_user);
    } catch (error) {
      response.error = error;
    }
    res.send(response)
});

router.post('/user/:id_user/materials/:id_material/remove', async (req, res) => {
  const id_user = req.params.id_user;
  const id_material = req.params.id_material;
  console.log('post/ (remove material)', req.params, req.body);
  try {
    await HomepageService.removeMaterial(id_user, id_material);
  } catch (error) {
    console.log(error);
    // TODO logs
  }
});

router.get('/user/:id_user/materials/:id_material', async (req, res) => {
  const id_user = req.params.id_user;
  const id_material = req.params.id_material;
  let response = {}

  try {
    response.data = await HomepageService.fetchMaterial(id_user, id_material);
  } catch (error) {
    response.error = error;
  }
  res.send(response)
})

router.post(`/user/:id_user/materials/:id_material/update`, async (req, res) => {
  const id_user = req.params.id_user;
  const id_material = req.params.id_material;
  const { title, previewImagePath, body } = req.body;
  let response = {};

  const queryValues = [ title, previewImagePath, body ]

  try {
    await HomepageService.updateMaterial(id_user, id_material, queryValues)
    response.data = 'Material succesfully updated'
  } catch(error) {
    response.error = error;
  }

  res.send(response);
})

module.exports = router;  