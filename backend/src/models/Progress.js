import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},problemNumber:{type:Number,required:true,index:true},status:{type:String,enum:['Not Started','In Progress','Done'],default:'Not Started'},notes:{type:String,default:''},timeTaken:{type:String,default:''},revisionNeeded:{type:String,enum:['No','Needed','Done'],default:'No'},completedAt:Date},{timestamps:true});
schema.index({userId:1,problemNumber:1},{unique:true});
export default mongoose.model('Progress',schema);
