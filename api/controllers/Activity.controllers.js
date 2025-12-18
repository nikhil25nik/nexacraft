import { handleError } from "../helper/handleError.js";
import Creation from "../model/creation.model.js";

export const getUserCreations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userCreations = await Creation.find({ user: userId }).populate("user")
      .sort({ created_at: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "Your creations",
      creations:userCreations,
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

export const getPublishedCreations = async (req, res, next) => {
  try {
    const allCreations = await Creation.find({ publish: true }).populate("user")
      .sort({ created_at: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      creations:allCreations,
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};


export const toggleLikeCreation = async (req, res, next) => {
  try {
    const userId  = req.user.id;
    const  {id}  = req.body;
    
    const creation = await Creation.findById(id);
    console.log(creation)

    if (!creation) {
      return next(404, "Creation not found!");
    }



        const isLiked = creation.likes.some(
      likeId => likeId.toString() === userId
    );

    let updatedLikes;
    let updatedCreation;

    if (isLiked) {
      updatedLikes = await Creation.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedCreation = await Creation.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: isLiked ? "Creation unliked" : "Creation liked",
      likesCount: updatedCreation.likes.length,
      likes: updatedCreation.likes,
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};
