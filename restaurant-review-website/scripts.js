const posts = [];

posts.push({
  name: 'Restaurant Name',
  rating: 86,
  ratingColor: 'rating5',
  username: 'username',
  description: 'Food is not halal.',
  replyCount: 0,
  likeCount: 0,
  shareCount: 0,
  likeStatus: false,
  bookmarkStatus: false
});

// Event listeners for home page elements
document.getElementById('delete-button').addEventListener('click', () => {
  deletePosts();
});
// document.getElementById('toggle-button').addEventListener('click', () => {
//   switchMode();
// });
document.getElementById('add-entry-button').addEventListener('click', () => {
  openForm();
});

// Event listeners for form elements
document.getElementById('form-exit-button').addEventListener('click', () => {
  closeForm();
});
document.getElementById('form-submit-button').addEventListener('click', () => {
  addPost();
});
document.getElementById('form-clear-button').addEventListener('click', () => {
  clearForm();
});

// Event listeners for post elements
document.querySelectorAll('.like-icon').forEach((likeButton, index) => {
  likeButton.addEventListener('click', () => {
    likeButtonClicked(index);
  });
});

// Process of adding an entry
const addPost = () => {
  const restaurantNameObject = document.getElementById('restaurant-name-input');
  const restaurantName = restaurantNameObject.value;

  const restaurantRatingObject = document.getElementById('rating-input');
  const restaurantRating = restaurantRatingObject.value;
  const ratingColor = getRatingColor(restaurantRating);

  const usernameObject = document.getElementById('username-input');
  const username = usernameObject.value;

  const descriptionObject = document.getElementById('description-input');
  const description = descriptionObject.value;

  if (restaurantName.trim() === '') {
    formError('emptyRestaurantName');
    return;
  }
  if (restaurantRating.trim().length === 0) {
    formError('emptyRestaurantRating');
    return
  }
  if (isNaN(restaurantRating) || restaurantRating < 1 || restaurantRating > 99) {
    formError('invalidRestaurantRating');
    return;
  }
  if (username.trim() === '') {
    formError('emptyUsername');
    return;
  }

  posts.unshift({
    name: restaurantName,
    rating: restaurantRating,
    ratingColor: ratingColor,
    username: username,
    description: description,
    replyCount: 0,
    likeCount: 0,
    shareCount: 0,
    likeStatus: false,
    bookmarkStatus: false
  });
  restaurantNameObject.value = '';
  restaurantRatingObject.value = '';
  usernameObject.value = '';
  descriptionObject.value = '';

  console.log(posts);
  closeForm();
  renderPosts();
};
function renderPosts() {
  let postsHTML = '';
  for (let i = 0; i < posts.length; i++) {
    const { name, rating, ratingColor, username, description, replyCount, likeCount, shareCount} = posts[i];
    const html =
      `<div class="post">
        <div class="rating ${ratingColor}">${rating}</div>
        <div class="post-header">
          <div class="restaurant-name">${name}</div>
          <div class="time">2 months ago</div>
          <div class="bs">
            <img class="bookmark-icon" src="images/bookmark.png">
            <div class="bs-tooltip">Bookmark</div>
          </div>
        </div>
        <div class="username">@${username}</div>
        <div class="description">${description}</div>
        <div class="image-grid">
        </div>
        <div class="stats">
          <div class="reply-container">
            <img class="reply-icon" src="images/replies.png">
            <div>${replyCount}</div>
            <div class="tooltip">Reply</div>
          </div>
          <div class="like-container">
            <img class="like-icon" src="images/unactive-like.png">
            <div>${likeCount}</div>
            <div class="tooltip">Like</div>
          </div>
          <div class="share-container">
            <img class="share-icon" src="images/share.png">
            <div>${shareCount}</div>
            <div class="tooltip">Share</div>
          </div>
        </div>
      </div>`

    postsHTML += html;
  }
  // console.log(leftPostsHTML);
  // console.log(rightPostsHTML);
  document.getElementById('posts').innerHTML = postsHTML;

  document.querySelectorAll('.like-icon').forEach((likeButton, index) => {
    likeButton.addEventListener('click', () => {
      likeButtonClicked(index);
    });
  });
  /* 
  I don't think adding event listeners to all posts at the start of the code also add continue
  adding listeners to new posts that are added to the page later, so I have to do this dumb bs where
  I have to add new event listeners every time I render the posts.
  */
}
function formError(error) {
  const errorMessageObject = document.getElementById('form-error-message');
  if (error === 'emptyRestaurantName') {
    errorMessageObject.innerHTML = '[a restaurant name is required]';
  } else if (error === 'emptyRestaurantRating') {
    errorMessageObject.innerHTML = '[a rating is required]';
  } else if (error === 'invalidRestaurantRating') {
    errorMessageObject.innerHTML = '[the rating must be a number from 1-99]';
  } else if (error === 'emptyUsername') {
    errorMessageObject.innerHTML = '[a username is required]';
  }
}

// Update post stats
function likeButtonClicked(index) {
  console.log(index);
  if(posts[index].likeStatus) {
    posts[index].likeCount--;
    posts[index].likeStatus = false;
  } else {
    posts[index].likeCount++;
    posts[index].likeStatus = true;
  }
  renderPosts();
}

// Restaurant rating color scale
function getRatingColor(rating) {
  if (rating < 3) {
    return 'rating1';
  } else if (rating < 16) {
    return 'rating2';
  } else if (rating < 50) {
    return 'rating3';
  } else if (rating < 84) {
    return 'rating4';
  } else if (rating < 97) {
    return 'rating5';
  } else if (rating < 100) {
    return 'rating6';
  }
}

// Temp
function deletePosts() {
  posts.splice(0, posts.length);
  renderPosts();
}
// Doesn't really work
function switchMode() {
  const modeStatus = document.getElementById('toggle-button');
  const body = document.querySelector('body');
  if (modeStatus.innerText === "Dark Mode") {
    modeStatus.innerHTML = "Light Mode";
    modeStatus.classList.add('light-mode');
    body.classList.add('light-mode');
  } else {
    modeStatus.innerHTML = "Dark Mode";
    modeStatus.classList.remove('light-mode');
    body.classList.remove('light-mode');
  }
}

// Change the state of the form
function openForm() {
  const formClassList = document.getElementById('add-post-form').classList;
  formClassList.remove('not-visible');
}
function closeForm() {
  const formClassList = document.getElementById('add-post-form').classList;
  formClassList.add('not-visible');
  document.getElementById('form-error-message').innerHTML = '';
  clearForm();
}
function clearForm() {
  document.getElementById('restaurant-name-input').value = '';
  document.getElementById('rating-input').value = '';
  document.getElementById('username-input').value = '';
  document.getElementById('description-input').value = '';
}