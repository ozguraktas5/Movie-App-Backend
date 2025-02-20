import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db("reviews").collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(movieId, user, review) {
    try {
      const reviewDoc = {
        movieId: movieId,
        user: user,
        review: review,
      }
      console.log("adding")
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async getReview(reviewId) {
    try {
      if (ObjectId.isValid(reviewId)) {
        const objectId = new ObjectId(reviewId);
        const review = await reviews.findOne({ _id: objectId });
        return review;
      } else {
        console.error("Invalid ObjectId format");
        return { error: "Invalid ObjectId format" };
      }
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }


  static async updateReview(reviewId, user, review) {
    try {
      // ObjectId'nin geçerli olup olmadığını kontrol edin
      if (ObjectId.isValid(reviewId)) {
        const objectId = new ObjectId(reviewId);

        // Update işlemini geçerli ObjectId ile yapın
        const updateResponse = await reviews.updateOne(
          { _id: objectId },
          { $set: { user: user, review: review } }
        )

        console.log("Update Response:", updateResponse);

        // Update işlemi başarısız olduysa hata döndürün
        if (updateResponse.modifiedCount === 0) {
          return { error: "Review not found or no changes made" };
        }

        return updateResponse;
      } else {
        console.error("Invalid ObjectId format");
        return { error: "Invalid ObjectId format" };
      }
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e.message };
    }
  }

  static async deleteReview(reviewId) {
      try {
        // ObjectId'nin geçerli olup olmadığını kontrol edin
        if (ObjectId.isValid(reviewId)) {
          const objectId = new ObjectId(reviewId);

          // Delete işlemini geçerli ObjectId ile yapın
          const deleteResponse = await reviews.deleteOne({
            _id: objectId,
          })

          console.log("Delete Response:", deleteResponse);

          // Silme işlemi başarısız olduysa hata döndürün
          if (deleteResponse.deletedCount === 0) {
            return { error: "Review not found" };
          }

          return deleteResponse;
        } else {
          console.error("Invalid ObjectId format");
          return { error: "Invalid ObjectId format" };
        }
      } catch (e) {
        console.error(`Unable to delete review: ${e}`);
        return { error: e.message };
      }
    }


  static async getReviewsByMovieId(movieId) {
    try {
      const cursor = await reviews.find({ movieId: parseInt(movieId) })
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

}