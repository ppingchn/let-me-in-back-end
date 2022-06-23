const express = require("express");
const createError = require("../utils/createError");
exports.createWorkEnvironment = async (req, res, next) => {
  try {
    const { workEnvironmentType } = req.body;
    const workEmveronment = await WorkEnvironment.create({
      workEnvironmentType,
    });
    res.status(201).json({ workEmveronment });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkEnvironment = async (req, res, next) => {
  try {
    const { workEnvironmentType } = req.body;
    const { workEnvironmentId } = req.params;
    const workEnvironment = await WorkEnvironment.fiindOne({
      where: { id: workEnvironmentId },
    });
    if (!workEnvironment) {
      createError("Work Environment not found", 404);
    }
    bodyUpdate = { WorkEnvironmentType };
    await WorkEnvironment.update(bodyUpdate);
    res.json({ workEnvironment });
  } catch (error) {
    next(error);
  }
};
exports.deleteWorkEnvironment = async (req, res, next) => {
  try {
    const { workEnvironmentId } = req.params;
    const workEnvironment = await WorkEnvironment.fiindOne({
      where: { id: workEnvironmentId },
    });
    if (!workEnvironment) {
      createError("Work environmemt not found");
    }
    await workEnvironment.destroy();
    res.status(204).json({ workEnvironment });
  } catch (error) {
    next(error);
  }
};
