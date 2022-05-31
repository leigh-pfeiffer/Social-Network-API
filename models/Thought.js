const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(

    {
     // set custom id to avoid confusion with parent thought_id
        reactionID: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: 'Please enter the reply text!',
            maxLength: 280
        },
        username: {
            type: String,
            required: 'Who wrote the reply?',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    { // alows to user getters (which is what we have date format)
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
  );


const ThoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: 'You need to provide a pizza name!',
        minLength: 1,
        maxLength: 280
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
      },
      username: {
        type: String,
        required: 'Who wrote the thought?',
        trim: true
     },
      userId: {
        type: String,
        required: 'Who wrote the thought?',
        trim: true
     },
      reactions: [ReactionSchema],
    },
    {
      toJSON: { // allow virtuals to be used
        virtuals: true,
        getters: true // coming from utils
      },
      id: false
    }
);


  // virtual - get total count of friends
ThoughtSchema.virtual('friendCount').get(function() {
    return this.reactions.length;
});

// create the Pizza model using the PizzaSchema
const Thought = model('Thought', ThoughtSchema);

// export the Pizza model
module.exports = Thought;


