const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel');


//============================ CREATE POST
// POST : api/posts
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        let { title, description, category } = req.body;
        if (!title || !description || !category) {
            return next(new HttpError("Fill in all fields.", 422));
        }
        const { thumbnail } = req.files;
        //check file size
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big , size should be less than 2mb.", 422));
        }

        let fileName = thumbnail.name;
        let splittedFileName = fileName.split('.')
        let newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1]
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if (err) { return next(new HttpError(err, 422)); }
            else {
                const newPost = await Post.create({ title, category, description, thumbnail: newFileName, creator: req.user.id })
                if (!newPost) {
                    return next(new HttpError("Post couldnt be created.", 422));
                }

                //find user and increment post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPost = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPost })

                res.status(201).json(newPost);
            }
        })
    } catch (error) {
        return next(new HttpError(error));
    }
}

//============================ GET ALL POST
// POST : api/posts
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 })
        return res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError("Posts couldnt be found.", 422));
    }
}

//============================ GET SINGLE POST
// POST : api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return next(new HttpError("Post does not exist.", 422));
        return res.status(200).json(post);
    } catch (error) {
        return next(new HttpError("Post couldnt be found.", 422));
    }
}

//============================ GET  POSTS BY CATEGORY
// POST : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
        return res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError("Post couldnt be found.", 422));
    }
}

//============================ GET  POSTS BY AUTHOR
// POST : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userPosts = await Post.find({ creator: userId }).sort({ createdAt: -1 });
        return res.status(200).json(userPosts);
    } catch (error) {
        return next(new HttpError("User Posts not found.", 422));
    }
}

//============================ EDIT POST
// PATCH : api/posts/:id/
// PROTECTED
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;

        const postId = req.params.id;
        let { title, description, category } = req.body;
        //reactQuill already has 11 characters
        if (!title
            || (description < 12)
            || !category
        ) {
            return next(new HttpError("Fill in all the blanks.", 422));
        }
        if (!req.files) {

            const updatedPost = await Post.findByIdAndUpdate(postId, { title, description, category }, { new: true });
            return res.status(200).json(updatedPost);
        } else {
            const oldPost = await Post.findById(postId);

            if (req.user.id == oldPost.creator) {
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), (err) => {
                    if (err) { return next(new HttpError(err)) }
                });

                //uplaod new thumbnail
                const { thumbnail } = req.files;
                if (thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail size should not be greater than 2MB", 422));
                }
                fileName = thumbnail.name;
                let splittedFileName = fileName.split('.')
                newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];

                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                })

                const updatedPost = await Post.findByIdAndUpdate(postId, { title, description, category, thumbnail: newFileName }, { new: true });
                res.status(200).json(updatedPost);
            } else {
                return next(new HttpError("Unauthaurized to edit post", 422))
            }
        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post", 400));
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError("Post couldnt be found.", 422));
    }
}

//============================ DELETE POST
// DELETE : api/posts/:id/
// PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post Unavailable", 400));
        }
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {

            //delete thumbnail from uploads folder
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId);
                    // find user and update post count by -1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                }
            })
            return res.json(`Post ${postId} deleted successfully`)
        } else {
            return next(new HttpError("Unauthaurized to delete post", 422))
        }

    } catch (error) {
        return next(new HttpError("Couldn't delete post", 422));
    }
}

module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost }