const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    required: true
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: [String],
    required: true,
  },
  reviews: {
    type: Number,
    default: 0,
  },
   bookCover:{
    type:String
  },
  deletedAt: {
    type: Date,
    default:null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  releasedAt: {
    type: Date,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)
