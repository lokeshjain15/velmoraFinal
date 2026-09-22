import mongoose from 'mongoose';
import priceSchema from './price.schema.js';

const productSchema = new mongoose.Schema({
    catalogId: {
        type: Number,
        unique: true,
        sparse: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price:{
       type: priceSchema,
       required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    category: String,
    categoryLabel: String,
    material: String,
    images:[
        {
            url:{
                type: String,
                required: true
            }
        }
    ],
}, { timestamps: true });

const productModel = mongoose.model('product', productSchema);

export default productModel;
