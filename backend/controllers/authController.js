const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");

/**
 * @desc    Register
 * @route   /api/auth/register
 * @method  POST
 * @sccess  public
 */
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
    // Validation
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Is user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "User already exest" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // New user and save it to db
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();

    // Send a response to client
    res.status(201).json({ message: "You registred succssfuly, please log in" });
});

/**
 * @desc    Login
 * @route   /api/auth/login
 * @method  POST
 * @sccess  public
 */
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    // Validation
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Is user exist?
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token (jwt)
    const token = user.generateAuthToken();

    // Response to client
    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token,
    });
});