const express = require('express');
const router = express.Router();

const CategoriesService = require('../../services/categories/service');
const { route } = require('../homepage/routes');


router.get('/categories/:id', async (req, res) => {
    console.log(req.params);
    let data = null;
    try {
        data = await CategoriesService.readCategory(req.params.id, null);
    } catch (error) {
        console.log(error);
    }
    res.json(data);
});

router.get('/categories/with/:name', async (req, res) => {
    let data = null;
    try {
        data = await CategoriesService.readCategory(null, req.params.name);
    } catch (error) {
        console.log(error);
    }
    res.json(data);
});


router.post('/categories/create', async (req, res) => {
    try {
        await CategoriesService.createCategory(req.body.name);
        res.send(201)
    } catch (error) {
        console.log(error);
    }
});

router.put('/categories/:id/update', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await CategoriesService.updateCategory(id, name);
        res.send(204);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/categories/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        await CategoriesService.deleteCategory(id);
        res.send(200);
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;