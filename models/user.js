import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   imail: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
   },
   fullName: {
      type: String,
      required: true,
   },
   avatar:String,
},
{
   timestamps:true
}
);

export default mongoose.model('user', UserSchema);