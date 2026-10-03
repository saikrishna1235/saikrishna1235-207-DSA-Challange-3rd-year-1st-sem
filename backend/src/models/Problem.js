import mongoose from 'mongoose';
const schema=new mongoose.Schema({problemNumber:{type:Number,unique:true,index:true},sessionNumber:Number,sessionProblemNumber:Number,sessionTopic:String,difficulty:String,lcNumber:Number,problemName:String,plannedDate:String});
export default mongoose.model('Problem',schema);
