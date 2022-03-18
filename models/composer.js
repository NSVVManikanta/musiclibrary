const Sequelize = require('sequelize');
const sequelize= require('../util/database');
const composers= sequelize.define('composers',{
    Name:{
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    }
   
});


module.exports=composers;