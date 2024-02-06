const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    referido:{
        type: mongoose.Types.ObjectId,
        require: false
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    last_login_date: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
};

UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.statics.getFieldsInfo = function () {
  return Object.keys(this.schema.paths).map((field) => ({
    name: field,
    properties: this.schema.paths[field],
  }));
};

const Usuario = model("User", UserSchema);

module.exports = Usuario;
