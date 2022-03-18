const albums = require("../models/album");
const songs = require("../models/song");
const Joi = require("joi");
const lyricists = require("../models/lyricist");
const composers = require("../models/composer");
const singers = require("../models/singer");
const { sequelize } = require("../models/song");

//Welcome Page
const welcome = (req, res) => {
  res.status(200).send("Music Library API. Built by manikanta.");
};

//Create Album

const schema = Joi.object({
  title: Joi.string().alphanum().min(0).max(250).required(),
  year: Joi.number().integer().min(1900).max(2022).required(),
  songs: Joi.array().items(
    Joi.object({
      title: Joi.string().alphanum().min(2).max(250).required(),
      length: Joi.string()
        .regex(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
        .required(),
      singers: Joi.array().items(
        Joi.object({
          Name: Joi.string().alphanum().min(0).max(345).required(),
        })
      ),
      composers: Joi.array().items(
        Joi.object({
          Name: Joi.string().alphanum().min(0).max(345).required(),
        })
      ),
      lyricists: Joi.array().items(
        Joi.object({
          Name: Joi.string().alphanum().min(0).max(345).required(),
        })
      ),
    })
  ),
});

const create = async (req, res) => {
  const dataToValidate = {
    title: req.body.title,
    year: req.body.year,
    songs: req.body.songs,
  };

  const schemaerr = schema.validate(dataToValidate);
  if (schemaerr.error) {
    return res.status(404).send(schemaerr.error);
  } else {
    let t;
    try {
      t = await sequelize.transaction();
      console.log("entered", t);
      const Album = await albums.create(
        {
          title: req.body.title,
          year: req.body.year,
        },
        { transaction: t }
      );

      var song = req.body.songs;
      for (var i in song) {
        const Songs = await songs.create(
          {
            title: song[i].title,
            length: song[i].length,
            albumId: Album.id,
          },
          { transaction: t }
        );

        //create singer
        var singer = song[i].singers;
        for (var s in singer) {
          const find = await singers.findOne(
            { where: { Name: singer[s].Name } },
            { transaction: t }
          );
          if (find === null) {
            const singer1 = await singers.create(
              {
                Name: singer[s].Name,
              },
              { transaction: t }
            );
            await Songs.addSingers(singer1, { transaction: t });
          } else {
            await Songs.addSingers(find, { transaction: t });
          }
        }
        //create composer
        var composer = song[i].composers;
        for (var c in composer) {
          const find1 = await composers.findOne(
            { where: { Name: composer[c].Name } },
            { transaction: t }
          );
          if (find1 === null) {
            const composer1 = await composers.create(
              {
                Name: composer[c].Name,
              },
              { transaction: t }
            );
            await Songs.addComposers(composer1, { transaction: t });
          } else {
            await Songs.addComposers(find1, { transaction: t });
          }
        }

        //create lyricists
        var lyricist = song[i].lyricists;
        for (var l in lyricist) {
          const find2 = await lyricists.findOne(
            { where: { Name: lyricist[l].Name } },
            { transaction: t }
          );
          if (find2 === null) {
            const lyricist1 = await lyricists.create(
              {
                Name: lyricist[l].Name,
              },
              { transaction: t }
            );
            await Songs.addLyricists(lyricist1, { transaction: t });
          } else {
            await Songs.addLyricists(find2, { transaction: t });
          }
        }
      }

      await t.commit();
      res.status(200).send(Album);
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(404).send({ error: "The album Does not Created!" });
    }
  }
};

//Album List
const list = async (req, res) => {
  try {
    const find = await albums.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: songs,
          order: [["createdAt", "DESC"]],
          attributes: { exclude: ["createdAt", "updatedAt", "albumId"] },
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
        },
      ],
    });
    res.status(200).send(find);
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: "The albums does not Display!" });
  }
};

//Update Album
const schema1 = Joi.object({
  title: Joi.string().alphanum().min(2).max(250).required(),
  year: Joi.number().integer().min(1900).max(2022).required(),
});
const update = async (req, res) => {
  try {
    const dataToValidate1 = {
      title: req.body.title,
      year: req.body.year,
    };
    const schemaerr1 = schema1.validate(dataToValidate1);
    if (schemaerr1.error) {
      return res.send(schemaerr1.error);
    } else {
      const albumId = req.params.albumId;
      const put = await albums.update(
        {
          title: req.body.title,
          year: req.body.year,
        },
        { where: { id: albumId } }
      );
      res.status(200).send(put);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song does not update." });
  }
};

//Delete Album
const deleteAlbum = async (req, res) => {
  try {
    const albumId = req.params.albumId;
    await albums.destroy({ where: { id: albumId } });
    res.status(200).json("deleted Successfully!");
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The album does not Delete." });
  }
};

module.exports = { welcome, list, create, update, deleteAlbum };
