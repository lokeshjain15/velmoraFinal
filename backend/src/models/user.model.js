import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    googleId: { type: String, default: null },
    profilePicture: { type: String, default: null },
    password:{ type:String, 
        required: function(){
            return !this.googleId; 
        }
    },
    fullName: { type: String, required: true },
    role:{
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    }
})  

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function(){
    if(!this.isModified("password") || !this.password) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

// Method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = async function(password){
    if(!this.password) return false;
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);

export default userModel;