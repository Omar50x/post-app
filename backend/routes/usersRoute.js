const router = require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl } = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken } = require("../middlewares/verifyToken");

// api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);

// api/users/profile/:id
router.route("/profile/:id")
    .get(validateObjectId, getUserProfileCtrl)
    .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl);

// api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
    .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

// api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);

module.exports = router;