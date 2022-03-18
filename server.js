const express = require('express'); 
const sequelize =require('./util/database');
const albums = require('./models/album');
const songs = require('./models/song');
const albumControllers = require("./controllers/albums");
const songControllers = require("./controllers/songs");
const composers = require('./models/composer');
const singers = require('./models/singer');
const lyricists = require('./models/lyricist');
const app = express();

app.use(express.json());
//,{ foreignKey: 'albumId' }
//Associations
albums.hasMany(songs,{ foreignKey: 'albumId' });
songs.belongsTo(albums);

songs.belongsToMany(composers, { through: 'cmodel' });
composers.belongsToMany(songs, { through: 'cmodel' });

songs.belongsToMany(singers, { through: 'smodel' });
singers.belongsToMany(songs, { through: 'smodel' });

songs.belongsToMany(lyricists, { through: 'lmodel' });
lyricists.belongsToMany(songs, { through: 'lmodel' });


sequelize
.sync({force:false})
.then((result)=>{
    console.log(result);
}).catch(err=>console.log(err));

// albums
app.get('/',albumControllers.welcome);

app.post("/albums", albumControllers.create);

app.get("/albums", albumControllers.list);

app.put("/albums/:albumId", albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum);

// songs

app.post("/albums/:albumId/songs", songControllers.create);

app.get("/albums/:albumId/songs/:songId",songControllers.getSong);

app.get("/songs", songControllers.list);

app.put("/albums/:albumId/songs/:songId", songControllers.update);

app.delete("/albums/:albumId/songs/:songId",songControllers.deleteSong);


app.listen(8080,()=>{
    console.log('Sever running on 8080!');
});