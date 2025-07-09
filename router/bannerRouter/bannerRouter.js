const express = require('express');
const { addBanner, upload, updateBanner, deleteBanner } = require('../../controls/banner/banner');

const bannerRouter = express.Router();

//Ruta para agregar banner para la pagina web

bannerRouter.post("/banner", upload.fields([
    { name: 'banner_top', maxCount: 1 },
    { name: 'banner_sidebar', maxCount: 1 }
]), addBanner);

//Ruta para actualizar banners

bannerRouter.patch("/banner/:id", upload.fields([
    { name: 'banner_top', maxCount: 1},
    { name: 'banner_sidebar', maxCount: 1}
]), updateBanner);

//Ruta para eliminar banner

bannerRouter.delete("/banner/:id", deleteBanner)

module.exports = bannerRouter;