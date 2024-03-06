const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");

/**
 * @desc    Get users profile
 * @route   /api/users/profile
 * @method  GET
 * @sccess  private (only admin)
 */
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
});

/**
 * @desc    Get user profile
 * @route   /api/users/profile/:id
 * @method  GET
 * @sccess  public
 */
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
});

/**
 * @desc    Update user profile
 * @route   /api/users/profile/:id
 * @method  PUT
 * @sccess  private (only user himself)
 */
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio,
        }
    }, { new: true }).select("-password");

    res.status(200).json(updateUser);
})

/**
 * @desc    Get users count
 * @route   /api/users/count
 * @method  GET
 * @sccess  private (only admin)
 */
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
    const count = await User.countDocuments();
    res.status(200).json(count);
});

/**
 * @desc    Profile photo upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @sccess  private (only logged in user)
 */
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" })
    }

    // 2. Get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    // 3. Upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);
    console.log(result);

    // 4. Get the user from DB
    // 5. Delete the old profile photo if exist
    // 6. Change the profilePhoto field in the DB

    // 7. Send response to client
    res.status(200).json({ message: "Your profile photo uploaded successfully" });

    // 8. Remove image from the server
})