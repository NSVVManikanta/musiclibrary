const Sequelize = require('sequelize');
const sequelize= require('../util/database');
const lyricists= sequelize.define('lyricists',{
    Name:{
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    }
   
});


module.exports=lyricists;