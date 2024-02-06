const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const RequestUtil = require('../utils/requestUtils');

var controller = {
    crearNuevoTramite : catchAsync(async(req,res,next)=>{
      console.log(req.user);
        const {tipo,user} = req.body;
        try {
            return res.status(200).json(
                RequestUtil.prepareSingleResponse(
                  'success',
                  {
                    
                  },
                  `Test con exito`
                )
              );
        } catch (error) {
            return res.status(200).json({ok:false})
        }
    })
}

module.exports = controller;