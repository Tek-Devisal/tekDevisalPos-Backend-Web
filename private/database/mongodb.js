const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
const localURI = "mongodb://localhost";
const onlineURI =
  "mongodb+srv://tekdevisal:Frimpong2010@cluster0.0dlsllz.mongodb.net";

module.exports = (db_name) => {
  return mongoose.connect(
    `${onlineURI}/${db_name}`,
    () => {
      console.log("Local MongoDB Connection Successful");
    },
    (e) => console.error(e)
  );
};
