const Sequelize = require('sequelize');
const sequelize= require('../util/database');
const albums= sequelize.define('albums',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey : true,
    },
    title:{
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    },
    year:{
        type : Sequelize.STRING,
        allowNull : false,
    },
   
});


module.exports=albums;