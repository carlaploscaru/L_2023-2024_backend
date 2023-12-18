
const express = require("express");
const authRoutes = require("../routes/auth");
const placeRoutes = require("../routes/places");// adauga places ro
const categoryRoutes = require("../routes/category");
const userRoutes = require("../routes/user")

module.exports = (app) => {
  app.use(express.json());
  app.use(authRoutes);
  app.use("/place", placeRoutes);
  app.use("/category", categoryRoutes);
  app.use("/user", userRoutes);
};