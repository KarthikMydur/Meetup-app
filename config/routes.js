const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/userController')
const authenticateUser = require('../app/middlewares/auth')
const multer = require('multer')

//multer image uplaod
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

var upload = multer ({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
})



router.get("/user", authenticateUser, userController.list)
router.get("/user/:id", authenticateUser, userController.show)
router.put("/user/:id", authenticateUser, userController.update)
router.post("/user", userController.create)
router.delete("/user/:id", authenticateUser, userController.destroy)
router.post("/user/login", userController.login)
router.delete("/user/logout", authenticateUser, userController.logout)


module.exports = router