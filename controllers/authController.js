const { generarJWT } = require("../helpers/jwt");
const User = require("../models/user");
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const RequestUtil = require('../utils/requesUtils');
const AppError = require('../utils/appError');
const authConfig = require('../config/jwtConfig');
const passport = require("passport");
const { error } = require("../helpers/logger");
const jwt = require('jsonwebtoken');
const TOKEN_TIMEOUT = 86400;

const controller = {
  crearUsuario: catchAsync(async (req, res, next) => {
    const { email, password,phone} = req.body;

    try {
      const existEmail = await User.findOne({ email: email.toLowerCase() });
      const existPhone = await User.findOne({ phone: phone})

      if (existEmail) {
        return res.status(400).json(
          RequestUtil.prepareSingleResponse(
            'success',
            {},
            `Este correo electrónico ya está registrado`
          )
        );
      }

      if(existPhone){
        return res.status(400).json(
          RequestUtil.prepareSingleResponse(
            'success',
            {},
            `Este numero telefonico ya está registrado`
          )
        );
      }

      const user = new User(req.body);
      const str = req.body.name.toLowerCase();
      const arr = str.split(" ");

      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }

      const newName = arr.join(" ");

      user.name = newName;
      user.email = email.toLowerCase();
      user.phone = phone;

      await user.save();

      const token = await generarJWT(user.id);

      return res.status(200).json(
        RequestUtil.prepareSingleResponse(
          'success',
          {
            user,
            token
          },
          `Useario creado con éxito`
        )
      );
    } catch (error) {
      return next(
        new AppError(
          500,
          'Ocurrió un error en esta operación',
          'APP_00',
          'data',
          [{ message: error.message }]
        )
      );
    }
  }),
  login: catchAsync(async (req, res,next) => {

    const { email, password } = req.body;

    passport.authenticate(
      'login',
      { session: false },
      async(err,user,_info)=>{



        try {
          if (err || !user || user === false) {
            return next(
              new AppError(
                401,
                _info ? _info.message : err.message,
                'USR_10',
                'login'
              )
            )
          }

          req.login(user,{session: false}, async(error)=>{
            
            if(error) return next(error);

            createSendToken(user,200,req,res)

          })

        } catch (error) {
          return next(error);
        }
      }
    )(req,res,next);

  }),
  renovarToken: async (req, res) => {
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await User.findById(uid);
    usuario.tokenFB = req.header('x-token-firebase');
    await usuario.save();

    User.find({ _id: mongoose.Types.ObjectId(uid) })
      .populate('negocios')
      .exec(async function (err, data) {
        const token2 = req.header('x-token-firebase');
        var checkToken = await Tienda.findOne({ punto_venta: token2 });

        if (checkToken) {
          checkToken = true;
        } else {
          checkToken = false;
        }

        res.json({
          ok: true,
          usuario: data[0],
          token: token,
          checkToken
        });
      });
  },restrictTo: (...roles) =>
  (req, res, next) => {
    //roles is an array of strings
    const userRoles = req.user.roles.map((role) => {
      return role.dataValues.code;
    });

    if (!roles.some((r) => userRoles.includes(r))) {
      return next(
        new AppError(
          403,
          'El rol no cuenta con permisos para realizar esta acción',
          'rol'
        )
      );
    }
    next();
  }
};

module.exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //roles is an array of strings
    const userRoles = req.user.roles.map((role) => {
      return role.dataValues.code;
    });

    if (!roles.some((r) => userRoles.includes(r))) {
      return next(
        new AppError(
          403,
          'El rol no cuenta con permisos para realizar esta acción',
          'rol'
        )
      );
    }
    next();
  };

const createSendToken = (user, status, req, res) => {
  const payload = {
    email: user.email,
  };

  const token = signToken(payload);

  return res.status(status).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken: `${token}`,
    expiresIn: `24h`,
  });
};

const signToken = (exports.signToken = (payload) => {
  return jwt.sign(payload, `${authConfig.secret}`, {
    expiresIn: TOKEN_TIMEOUT,
  }); //24 h
});

module.exports = controller;