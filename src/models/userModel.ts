import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
}, 
{ 
    timestamps: true 
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
