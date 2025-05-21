import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
   table_id:{
type:String,
   },
    offer_type:{
        type:String,
    },
    offer_amount:{
        type:String,
        default:null
    },
    offer_percentage:{
        type:String,
        default:null
    },
    offer_code:{
        type:String,
       
    },
    offer_exp:{
        type:String,
    },
  

},
{timestamps:true}
);

export const offer = mongoose.model("offer",offerSchema);
