const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Helper function to validate MongoDB ObjectId
const validateObjectId = (value, helpers) => {
  if (!validator.isMongoId(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Custom URL validation function using validator.isURL()
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Clothing item validation for creation
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": 'The "weather" field must be filled in',
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
    }),
  }),
});

// 2. User registration validation
const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. User profile update validation
const validateUserUpdate = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().optional().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
      }),
      avatar: Joi.string().optional().custom(validateURL).messages({
        "string.uri": 'the "avatar" field must be a valid url',
      }),
    })
    .min(1)
    .messages({
      "object.min": "At least one field (name or avatar) must be provided",
    }),
});

// 4. User login validation
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 5. ID validation for both users and clothing items
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().custom(validateObjectId, "Invalid ID format").messages({
      "any.invalid": 'The "id" field must be a valid MongoDB ObjectId',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUser,
  validateUserUpdate,
  validateLogin,
  validateId,
};
