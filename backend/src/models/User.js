import mongoose from 'mongoose';
const schema=new mongoose.Schema({email:{type:String,unique:true,lowercase:true,trim:true,required:true},passwordHash:{type:String,required:true},role:{type:String,default:'admin'}},{timestamps:true});
export default mongoose.model('User',schema);
