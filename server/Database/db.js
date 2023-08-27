import mongoose from "mongoose";

const Connection = async () => {
  URL =
    "mongodb+srv://googledocs:googledocs@googledocs.m4i4tpf.mongodb.net/?retryWrites=true&w=majority";
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(
      "Getting error while connecting to the database",
      error.message
    );
  }
};

export default Connection;
