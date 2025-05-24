const { NODE_ENV, JWT_SECRET } = process.env;

const config = {
  jwtSecret: NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
  jwtExpiresIn: "7d",
};

module.exports = config;
