function ReviewApp() {
  const [reviews, setReviews] = React.useState(() => {
    const savedReviews = localStorage.getItem("reactReviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  const [formData, setFormData] = React.useState({
    name: "",
    place: "",
    review: "",
    rating: "5"
  });

  React.useEffect(() => {
    localStorage.setItem("reactReviews", JSON.stringify(reviews));
  }, [reviews]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      formData.name.trim() === "" ||
      formData.place.trim() === "" ||
      formData.review.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    setReviews([...reviews, formData]);

    setFormData({
      name: "",
      place: "",
      review: "",
      rating: "5"
    });
  }

  function deleteReview(indexToDelete) {
    const updatedReviews = reviews.filter((item, index) => {
      return index !== indexToDelete;
    });

    setReviews(updatedReviews);
  }

  return (
    <div className="react-review-wrapper">

      <form className="react-review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="place"
          placeholder="Trip Place"
          value={formData.place}
          onChange={handleChange}
        />

        <textarea
          name="review"
          placeholder="Write your review"
          value={formData.review}
          onChange={handleChange}
        ></textarea>

        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <button type="submit">Submit Review</button>
      </form>

      <div className="react-new-reviews">
        {reviews.map((item, index) => (
          <div className="react-new-card" key={index}>
            <h3>{item.name}</h3>
            <p className="trip-place">{item.place}</p>
            <p>{item.review}</p>

            <div className="stars">
              {"★".repeat(Number(item.rating))}
            </div>

            <button
              className="delete-review-btn"
              onClick={() => deleteReview(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("reactReviewApp"));
root.render(<ReviewApp />);