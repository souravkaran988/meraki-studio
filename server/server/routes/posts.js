// Add this to your existing routes in server/routes/posts.js

router.put('/:id/like', async (req, res) => {
  try {
    const post = await (mongoose.model("Post")).findById(req.params.id);
    const { username } = req.body;

    if (!post.likes.includes(username)) {
      await post.updateOne({ $push: { likes: username } });
      res.status(200).json("The post has been liked");
    } else {
      // If already liked, clicking again will "unlike" it
      await post.updateOne({ $pull: { likes: username } });
      res.status(200).json("The post has been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});