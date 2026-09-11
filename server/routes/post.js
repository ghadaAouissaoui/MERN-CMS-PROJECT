const express = require("express");
const upload=require("../middleware/upload")
const auth = require("../middleware/auth");
// le fichier d'au-dessus
const routes = express.Router();
const postController = require("../controller/post");

routes.post("/addpost",auth, upload.single("image"), postController.addPost);
routes.get("/getpost", auth, postController.getProfilePost);
routes.post("/getpostdata", auth, postController.getEditPostData);
routes.put("/editpost", auth,upload.single("image"), postController.postEditData);
routes.delete("/postdelete", auth, postController.deletePost);
routes.put("/restorePost", auth, postController.restorePost);
routes.delete("/reccyclePostdelete", auth, postController.deletFromRecycleBin);
routes.post('/:id/comment', auth, postController.addComment);
routes.get('/:id/comments', auth, postController.getComment);


module.exports = routes;
