const Express = require("express");
const { Myprofile} = require('../controller/my-profile.js');
const Router = Express.Router();

Router.post('/Myprofile',Myprofile)  /// The My profile section from controller/my-profile.js is called here


module.exports = Router;