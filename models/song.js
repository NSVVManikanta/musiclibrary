const Sequelize = require('sequelize');
const sequelize= require('../util/database');
const songs= sequelize.define('songs',{
    title:{
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    },
    length:{
        type : Sequelize.STRING,
        allowNull : false,
    }
   
});


module.exports=songs;