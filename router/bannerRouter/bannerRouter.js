const express = require('express');
const { addBanner, upload } = require('../../controls/banner/banner');

const bannerRouter = express.Router();

//Ruta para agregar banner para la pagina web

bannerRouter.post('/banner', upload.fields([
    { name: 'banner_top', maxCount: 1 },
    { name: 'banner_sidebar', maxCount: 1 }
]), addBanner);

module.exports = bannerRouter;