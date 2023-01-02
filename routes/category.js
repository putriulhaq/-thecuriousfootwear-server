import express from "express";
const Cat = express.Router();
import Category from "../models/category.js";

Cat.post("/", async (req, res) => {
  try {
    const data = Category.findOne({ name: req.body.name }).then((dataCat) => {
      console.log(dataCat);
      if (dataCat) {
        return res.status(409).send({
          message: `${req.body.name} Already exist`,
        });
      } else {
        const newPost = Category.create({
          name: req.body.name,
        });
        return res.status(200).send({
          message: `${req.body.name} created successfully`,
        });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

Cat.get("/all", async (req, res) => {
  const dataCategory = await Category.find();
  const category = dataCategory.map((data) => {
    return {
      categoryId: data._id,
      name: data.name,
    };
  });
  res.send(category);
});

Cat.delete("/delete/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.delete();
      res.status(200).json(`Category ${category.name} has been deleted`);
    } else {
      res.status(404).json(`Category ${category.name} not exist`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default Cat;
