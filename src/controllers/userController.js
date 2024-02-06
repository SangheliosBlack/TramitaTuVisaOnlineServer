const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const RequestUtil = require("../utils/requestUtils");

const UserController = {
  getAllUser: catchAsync(async (req, res, next) => {
    try {
      const user = await User.find();
      res
        .status(200)
        .json(RequestUtil.prepareSingleResponse("success", user, "data"));
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrió un error en esta operación",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),
  getReferredUsers: catchAsync(async (req, res, next) => {
    try {
      const user = await User.find({referido: req.user.id });
      
      res
        .status(200)
        .json(RequestUtil.prepareSingleResponse("success", user, "data"));
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrió un error en esta operación",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),
  getAllInternalUsers: catchAsync(async (req, res, next) => {
    try {
      const users = await User.find({
        role: { $in: ["ADMIN", "DEV"] },
      });
      res
        .status(200)
        .json(RequestUtil.prepareSingleResponse("success", users, "data"));
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrio un error en esta operacion",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),
  getUserById: catchAsync(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res
        .status(200)
        .json(RequestUtil.prepareSingleResponse("success", user, "data"));
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrió un error en esta operación",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),

  createNewUser: catchAsync(async (req, res, next) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res
        .status(200)
        .json(
          RequestUtil.prepareSingleResponse(
            "success",
            { user: newUser },
            "data"
          )
        );
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrió un error en esta operación",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),

  updateUser: catchAsync(async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res
        .status(200)
        .json(RequestUtil.prepareSingleResponse("success", user, "data"));
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrió un error en esta operación",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),

  deleteUser: catchAsync(async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json(
          RequestUtil.prepareSingleResponse("success", { ok: true }, "data")
        );
    } catch (error) {
      next(
        new AppError(
          500,
          "Ocurrió un error en esta operación",
          "APP_00",
          "data",
          [{ message: error.message }]
        )
      );
    }
  }),
};

module.exports = UserController;
