const Sequelize = require('sequelize');
const sequelize= require('../util/database');
const singers= sequelize.define('singers',{
    Name:{
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    }
   
});


module.exports=singers;