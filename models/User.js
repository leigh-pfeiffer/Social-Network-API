const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: 'You need to provide a user name!',
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
        
      },
      thoughts: [ 
        {
          type: Schema.Types.ObjectId, // the data is stored as an object
          ref: 'Thought' // defined here to map to Thought model (Join)
        }
      ],
      friends: [ // self reference
                {
          type: Schema.Types.ObjectId, // the data is stored as an object
          ref: 'User' // defined here to map to User model
        }
      ]
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
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// create the User model using the UserSchema collection
const User = model('User', UserSchema);

// export the Pizza model
module.exports = User;


