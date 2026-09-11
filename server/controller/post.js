const User = require("../model/User");
const Post = require("../model/Post");
const PostCategory = require("../model/PostCategory");
const { Readable } = require("nodemailer/lib/xoauth2");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require('fs');
const multer = require('multer');
const path = require('path');


exports.addPost = async (req, res, next) => {
  try {
    const { title, category, content, desc, imageSource, status, tag } = req.body;

    // 1️⃣ Vérification de la présence du fichier
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image reçue.' });
    }


    const imageUrl = `/uploads/${req.file.filename}`;

    const post = new Post({
      title,
      content,
      desc,
      category,
      image: imageUrl,
      imgSource: imageSource,
      imageName: req.file.originalname,
      tag,
      status,
      user: req.userId,
    });

    const result = await post.save();
    if (!result) throw new Error("Erreur lors de la création du post");
  // 4️⃣ Ajout du post à la catégorie
    const cat = await PostCategory.findById(category);
    if (!cat) throw new Error("Catégorie non trouvée");
    cat.posts.push(result._id);
    await cat.save();

    // 5️⃣ Ajout du post à l’utilisateur
    const user = await User.findById(req.userId);
    if (!user) throw new Error("Utilisateur non trouvé");
    user.posts.push(result._id);
    await user.save();

    res.status(201).json({ message: 'Post ajouté !', post: savedPost });  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};


exports.getProfilePost = (req, res, next) => {
  const pageNumber = req.query.page || 1;
  const getType = req.query.type || "allpost";
  const postStatus = req.query.postStatus || "publish";

  const perPageItem = 6;

  let totalItem;
  let totalPage;

  let type = postStatus === "draft" ? "draft" : "publish";

  let option = getType === "recyclebin" ? "Delete" : type;

  Post.find({
    user: req.userId,
    status: option,
  })
    .countDocuments()
    .then((count) => {
      totalItem = count;

      return Post.find({
        user: req.userId,
        status: option,
      })
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * perPageItem)
        .limit(perPageItem);
    })

    .then((post) => {
      if (post.length == 0) {
        const error = new Error("no post available");
        error.statusCode = 401;
        throw error;
      }

      totalPage = Math.ceil(totalItem / perPageItem);

      const postData = post.map((data) => {
        return {
          imageUrl:`${req.protocol}://${req.get("host")}${data.image}`, 
          desc: data.title,
          postId: data._id,
        };
      });

      res.status(200).json({
        message: "post get done",
        postData: postData,
        totalItem: totalItem,
        totalPage: totalPage,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getEditPostData = (req, res, next) => {
  const postId = req.body.postId;
  console.log("🧠 req.userId:", req.userId);
  console.log("🧠 req.body.postId:", postId);

  Post.findOne({ _id: postId, user: req.userId }) // filtre par userId aussi
    .then((post) => {
      if (!post) {
        const error = new Error("No post available or unauthorized access.");
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({ message: "Post fetched successfully", postData: post });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};




exports.postEditData = async (req, res, next) => {
  console.log("✅ Requête reçue sur /post/editpost");
  console.log("🟡 req.body:", req.body);
  console.log("🟡 postId:", req.body.postId);
  
  const { title, category, content, desc, imageSource, status, tag, postId } = req.body;

  try {
    const post = await Post.findOne({ _id: postId, user: req.userId });
    if (!post) {
      const err = new Error("Post not found.");
      err.statusCode = 404;
      throw err;
    }

    // ✅ Vérifie que le post appartient à l'utilisateur connecté
    if (post.user.toString() !== req.userId) {
      const err = new Error("Unauthorized: You cannot edit this post.");
      err.statusCode = 403;
      throw err;
    }

    // ✅ Mise à jour des champs
    post.title = title;
    post.category = category;
    post.content = content;
    post.desc = desc;
    post.imgSource = imageSource;
    post.status = status;
    post.tag = tag;
    post.updatedAt = Date.now();

    // ✅ Gestion de l'image uploadée
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const imageName = Date.now() + '-' + req.file.originalname;
      const imagePath = path.join(__dirname, '../uploads', imageName);

      fs.writeFileSync(imagePath, imageBuffer);

      post.image = `/uploads/${imageName}`;
      post.imageName = imageName;
    }

    const updatedPost = await post.save();

    res.status(200).json({
      message: 'Post updated successfully',
      postData: updatedPost,
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};


exports.deletePost = (req, res, next) => {
  const postId = req.body.postId;
  const postStatus = req.body.status;

  const perPage = 6;
  let totalPost;
  let totalPage;

  Post.findOne({ user: req.userId, _id: postId, status: postStatus })
    .then((post) => {
      if (!post) {
        const error = new Error("post not found");
        error.statusCode = 401;
        throw error;
      }

      post.status = "Delete";

      return post.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }

      return Post.find({
        user: req.userId,
        status: postStatus,
      }).countDocuments();
    })
    .then((count) => {
      totalPost = count;

      return Post.find({
        user: req.userId,
        status: postStatus,
      })

        .sort({ createdAt: -1 })
        .limit(6);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }

      totalPage = Math.ceil(totalPost / perPage);

      const postData = posts.map((data) => {
        return {
          imageUrl: data.image,
          desc: data.title,
          postId: data._id,
        };
      });

      res.status(200).json({
        message: "post get done",
        postData: postData,
        totalPage: totalPage,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.restorePost = (req, res, next) => {
  const postId = req.body.postId;

  let perPage = 6;
  let totalPost;
  let totalPage;

  Post.findOne({ user: req.userId, _id: postId })
    .then((post) => {
      if (!post) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }

      post.status = "draft";

      return post.save();
    })
    .then((result) => {
      return Post.find({ user: req.userId, status: "Delete" }).countDocuments();
    })
    .then((count) => {
      totalPost = count;
      return Post.find({ user: req.userId, status: "Delete" })
        .sort({ createdAt: -1 })
        .limit(perPage);
    })
    .then((posts) => {
      totalPage = Math.ceil(totalPost / perPage);

      if (!posts) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }
      const postData = posts.map((data) => {
        return {
          imageUrl: data.image,
          desc: data.title,
          postId: data._id,
        };
      });

      res.status(200).json({
        message: "post restore done",
        postData: postData,
        totalPage: totalPage,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletFromRecycleBin = (req, res, next) => {
  const postId = req.body.postId;
  let postData;
  let totalPost;
  let totalPage;
  const postPerPage = 6;

  Post.findOne({ user: req.userId, _id: postId })
    .then((post) => {
      if (!post) {
        const error = new Error("post not found");
        error.statusCode = 401;
        throw error;
      }

      postData = post;

      return User.findById(postData.user);
    })
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 401;
        throw error;
      }

      user.posts.pop(postId);
      return user.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error("Not found");
        error.statusCode = 401;
        throw error;
      }

      return PostCategory.findById(postData.category);
    })
    .then((PostCategoryData) => {
      if (!PostCategoryData) {
        const error = new Error("Postcategory Not found");
        error.statusCode = 401;
        throw error;
      }

      PostCategoryData.posts.pop(postId);
      return PostCategoryData.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }

      return Post.findByIdAndDelete(postId);
    })
    .then((post) => {
      if (!post) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }

      return Post.find({ user: req.userId, status: "Delete" }).countDocuments();
    })
    .then((count) => {
      totalPost = count;
      return Post.find({ user: req.userId, status: "Delete" })
        .sort({ createdAt: -1 })
        .limit(postPerPage);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("server error");
        error.statusCode = 401;
        throw error;
      }

      totalPage = Math.ceil(totalPost / postPerPage);

      const postData = posts.map((data) => {
        return {
          imageUrl: data.image,
          desc: data.title,
          postId: data._id,
          totalPage: totalPage,
        };
      });

      res.status(200).json({ message: "post get done", postData: postData });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.addComment = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userId;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'yes', message: 'Post not found' });

    const comment = {
      author: userId,
      content,
      date: Date.now()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    next(err);
  }
};



exports.getComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.author", "name email");
    if (!post) return res.status(404).json({ error: "yes", message: "Post not found" });
    res.json({ post });
  } catch (err) {
    next(err);
  }
};
