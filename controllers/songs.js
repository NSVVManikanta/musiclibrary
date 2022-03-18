const albums = require("../models/album");
const songs = require("../models/song");
const composers = require("../models/composer");
const lyricists = require("../models/lyricist");
const singers = require("../models/singer");
const Joi = require("joi");

//Create Song
const schema = Joi.object({
  title: Joi.string().required(),
  length: Joi.string()
     .regex(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
     .required(),
  singers: Joi.array().items(
              Joi.object({
           Name: Joi.string().alphanum().min(0).max(345).required(),
              })),
  composers: Joi.array().items(
              Joi.object({
           Name: Joi.string().alphanum().min(0).max(345).required(),
              })),   
  lyricists: Joi.array().items(
             Joi.object({
           Name: Joi.string().alphanum().min(0).max(345).required(),
              })),                       

 });
const create = async (req, res) => {
  try {
    const dataToValidate = {
      title: req.body.title,
      length: req.body.length,
      singers: req.body.singers,
      composers: req.body.composers,
      lyricists: req.body.lyricists
    };
    const schemaerr = schema.validate(dataToValidate);
     if (schemaerr.error) {
       return res.send(schemaerr.error);
     } else {
    const song = req.body;
    const Songs = await songs.create({
      title: song.title,
      length: song.length,
      albumId: req.params.albumId,
    });

    //create singer
    var singer = song.singers;
    for (var s in singer) {
      const find = await singers.findOne({ where: { Name: singer[s].Name } });
      if (find === null) {
        const singer1 = await singers.create({
          Name: singer[s].Name,
        });
        await Songs.addSingers(singer1);
      } else {
        await Songs.addSingers(find);
      }
    }
    //create composer
    var composer = song.composers;
    for (var c in composer) {
      const find1 = await composers.findOne({
        where: { Name: composer[c].Name },
      });
      if (find1 === null) {
        const composer1 = await composers.create({
          Name: composer[c].Name,
        });
        await Songs.addComposers(composer1);
      } else {
        await Songs.addComposers(find1);
      }
    }

    //create lyricists
    var lyricist = song.lyricists;
    for (var l in lyricist) {
      const find2 = await lyricists.findOne({
        where: { Name: lyricist[l].Name },
      });
      if (find2 === null) {
        const lyricist1 = await lyricists.create({
          Name: lyricist[l].Name,
        });
        await Songs.addLyricists(lyricist1);
      } else {
        await Songs.addLyricists(find2);
      }
    }

    res.status(200).send(Songs);
     }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song is not Created!" });
  }
};

//Songs List
const list = async (req, res) => {
  try {
    const song = await songs.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt", "albumId"] },
      include: [
        {
          model: albums,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: composers,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: singers,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: lyricists,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    res.status(200).send(song);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "Songs are not display!" });
  }
};

// Get One Song
const getSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const albumId = req.params.albumId;
    const find = await songs.findOne({
      where: { id: songId, albumId: albumId },
      attributes: { exclude: ["createdAt", "updatedAt", "albumId"] },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: composers,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: singers,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: lyricists,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    res.status(200).send(find);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song does not exist." });
  }
};

//Update Song
const schema1 = Joi.object({
  title: Joi.string().alphanum().min(2).max(250).required(),
  length: Joi.string()
    .regex(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
    .required(),
});
const update = async (req, res) => {
  try {
    const dataToValidate1 = {
      title: req.body.title,
      length: req.body.length,
    };
    const schemaerr1 = schema1.validate(dataToValidate1);
    if (schemaerr1.error) {
      return res.status(404).send(schemaerr1.error);
    } else {
      const songId = req.params.songId;
      const put = await songs.update(
        {
          title: req.body.title,
          length: req.body.length,
          albumId: req.params.albumId,
        },
        { where: { id: songId } }
      );
      res.status(200).send(put);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song does not update." });
  }
};

//Delete Song
const deleteSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const song = await songs.findByPk(songId);
    await song.destroy({ where: { albumId: req.params.albumId } });
    res.send("deleted successfully!");
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: "The song does not Delete." });
  }
};

module.exports = {
  create,
  list,
  getSong,
  update,
  deleteSong,
};
