const Sequelize = require('sequelize');

const connection=new Sequelize('nodejs','root','Mysql@8374',{dialect:'mysql',host:'localhost'});

console.log('DB connected successfully!')
module.exports=connection;