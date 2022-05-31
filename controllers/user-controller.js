const { User, Thought } = require('../models');

const userController = {
    // get all Users
    getAllUser(req, res) {
      User.find({}) // sequelize uses findAll()
        .populate({
          path: 'thoughts',
          select: '-__v' // do not populate __v and show others
        })
        .populate({
          path: 'friends',
          select: '-__v' // do not populate __v and show others
        })
        .select('-__v') // do not return field __v
        .sort({ _id: -1 }) // mongoose sort DESC 
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one User by id
    getUserById({ params }, res) { // params deconstructed
      User.findOne({ _id: params.id })
        .populate({ // populate the array of objects and do not include the version field
          path: 'thoughts',
          select: '-__v'
        })
        .select('-__v') // do not include User version field
        .then(dbUserData => {
          // If no User is found, send 404
          if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
    // createUser
    createUser({ body }, res) {
        User.create(body) // body deconstructed
            .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
     },
    /*
    Mongoose only executes the validators automatically 
    when we actually create new data. This means that a 
    user can create a User, but then update that User 
    with totally different data and not have it validated.
    Let's go ahead and fix that with a simple option setting.

    runValidators: true
    We need to include this explicit setting when updating data so
    that it knows to validate any new information.
    */
    updateUser({ params, body }, res) {
      User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
      Thought.deleteMany( // Delete all thoughts related to an user collection first
        { userId: params.id },
        )
        .then(deletedComment => {
          if (!deletedComment) {
            return res.status(404).json({ message: 'No user found with this id!' });
          }
        return User.findOneAndDelete( // once the deletion of the users thoughts is done, delete the user from the User collection
          { _id: params.id }
          )
        })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    // add friend
    addFriend({ params, body }, res) {
      User.findOneAndUpdate( // pass the friend ID into the friends collection (self join)
              { _id: params.userId },
              { $push: { friends: params.friendId } }, 
              { new: true, runValidators: true }
          )
          .then(dbUserData => {
              if (!dbUserData) {
                  res.status(404).json({ message: 'No user found with this id!' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
      // remove friend
      removeFriend({ params, body }, res) {
        User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: params.friendId } }, 
                { new: true, runValidators: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
      }

  }

module.exports = userController;