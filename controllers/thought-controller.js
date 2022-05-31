const { Thought, User } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({}) // sequelize uses findAll()
          .populate({
            path: 'reactions',
            select: '-__v' // do not populate __v and show others
          })
          .select('-__v') // do not return field __v
          .sort({ _id: -1 }) // mongoose sort DESC 
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },
    // get one User by id
    getThoughtById({ params }, res) { // params deconstructed
        Thought.findOne({ _id: params.id })
          .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v')
          .then(dbThoughtData => {
            // If no User is found, send 404
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },
      // add thought
     addThought({ params, body }, res) {
        Thought.create(body) // create a thought first using the body
          .then(({ _id }) => {
            return User.findOneAndUpdate( // once created pass that generated id to the User collection thoughts document 
              { _id: body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },
      // update thought
      updateThought({ params, body }, res) {
        Thought.findOneAndUpdate( { _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
      },
      // delete thouhgt
      deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
      },

      // add though reaction
      addThoughtReaction({ params, body }, res) {
        //console.log(body)
        Thought.findOneAndUpdate( // find thought then push body to reactions sub document
               { _id: params.thoughtId },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
          },
        // delete thought reaction
        deleteThoughtReaction({ params }, res) {
          Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionID: params.reactionId } } },
            { new: true }
            )
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this id!' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },


      


}

module.exports = thoughtController;



