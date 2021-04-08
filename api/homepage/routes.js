const express = require('express')
const router = express.Router();

const HomepageService = require('../../services/hompage/service');


router.post('/user/:id_user/materials/new', async (req, res) => {
  const id_user = req.params.id_user;
  const material = req.body.material;

  const response = { data: null, error: null };
  console.log(req.file, req.bodyuser);

  try {
    await HomepageService.createMaterial(id_user, material)
    response.data = "200";
  } catch (error) {
    console.log(error);
    response.error = error;
  }
  res.send(response)
});

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




module.exports = router;