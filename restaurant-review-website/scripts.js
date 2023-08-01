// Event listeners for home page elements
document.getElementById('delete-button').addEventListener('click', () => {
  deletePosts();
});
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

// Add event listeners for post elements
function addPostEventListeners() {
  document.querySelectorAll('.like-icon').forEach((likeButton, index) => {
    likeButton.addEventListener('click', () => {
      likeButtonClicked(index);
    });
  });
  document.querySelectorAll('.reply-icon').forEach((replyButton, index) => {
    replyButton.addEventListener('click', () => {
      replyButtonClicked(index);
      addReplyEventListeners();
    });
  });
}

// Event listeners for dynamic reply form elements
function addReplyEventListeners() {
  document.querySelectorAll('.send-reply-button').forEach((sendReplyButton, queryIndex) => {
    for(let i=0; i<posts.length; i++) {
      if (posts[i].replyStatus) {
        sendReplyButton.addEventListener('click', () => {
          addReply(i, queryIndex);
        });
      }
    }
  });
  document.querySelectorAll('.delete-replies-button').forEach((deleteRepliesButton, queryIndex) => {
    for(let i=0; i<posts.length; i++) {
      if (posts[i].replyStatus) {
        deleteRepliesButton.addEventListener('click', () => {
          deleteReplies(i);
        });
      }
    }
  });
}

// For dynamic textareas
function dynamicTextarea() {
  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].addEventListener("input", OnInput, false);
  }
}
function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}
// scrollHeight does not work on display: none elements so need to add this after
toggleDisplayById(document.getElementById('add-post-form'));

// ----------------------------------------------

// Assigns the posts saved through local storage to posts or defaults to empty and renders the posts
const posts = JSON.parse(localStorage.getItem('posts')) || [];

for(let i=0; i<posts.length; i++) {
  posts[i].replyStatus = false;
}
renderPostsAndReplies(0, posts.length);
console.log(posts);

// ----------------------------------------------

// Functions used during the process of adding an entry
function addPost() {
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
    replyStatus: false,
    bookmarkStatus: false,
    replies: [],
    likeButtonImg: 'images/unactive-like.png',
    bookmarkImg: 'images/unactive-bookmark.png',
    likeCountTextColor: ''
  });
  console.log(posts);

  // Updates the local storage variable as more posts get added
  localStorage.setItem('posts', JSON.stringify(posts));

  restaurantNameObject.value = '';
  restaurantRatingObject.value = '';
  usernameObject.value = '';
  descriptionObject.value = '';

  closeForm();
  renderPostsAndReplies(0, posts.length);
}
function renderPosts(start, end) {
  const postsHTML = getPostHTML(start, end);
  document.getElementById('posts').innerHTML = postsHTML;
  addPostEventListeners();
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
function renderReplies(index) {
  let repliesHTML = getPostHTML(0, index + 1);
  repliesHTML += getReplyHTML(index);
  repliesHTML += getPostHTML(index + 1, posts.length)
  document.getElementById('posts').innerHTML = repliesHTML;
  replyStatus = true;

  addPostEventListeners();
}

function addReply(index, queryIndex) {
  let replyUsername = '';
  let replyComment = '';
  document.querySelectorAll('.reply-username-input').forEach((replyUsernameObject, index) => {
    if(index == queryIndex) {
      replyUsername = replyUsernameObject.value;
    }
  });
  document.querySelectorAll('.comment-input').forEach((replyCommentObject, index) => {
    if(index == queryIndex) {
      replyComment = replyCommentObject.value;
    }
  });
  if(replyUsername.trim() != '' && replyComment.trim() != '') {
    posts[index].replies.unshift({
      username: replyUsername,
      comment: replyComment
    });
    posts[index].replyCount++;
    renderPostsAndReplies(0, posts.length);
  }
}
function renderPostsAndReplies(start, end) {
  let combinedHTML = '';
  for(let i=start; i<end; i++) {
    combinedHTML += getPostHTML(i, i + 1);
    if(posts[i].replyStatus) {
      combinedHTML += getReplyHTML(i);
    }
  }
  document.getElementById('posts').innerHTML = combinedHTML;
  addPostEventListeners();
  addReplyEventListeners();
  dynamicTextarea();

  localStorage.setItem('posts', JSON.stringify(posts));
}

// Update post stats (incomplete)
function likeButtonClicked(index) {
  if(posts[index].likeStatus) {
    posts[index].likeCount--;
    posts[index].likeStatus = false;
    posts[index].likeButtonImg = 'images/unactive-like.png';
    posts[index].likeCountTextColor = '';
  } else {
    posts[index].likeCount++;
    posts[index].likeStatus = true;
    posts[index].likeButtonImg = 'images/active-like.png';
    posts[index].likeCountTextColor = 'pink-text';
  }
  renderPostsAndReplies(0, posts.length);
}
function replyButtonClicked(index) {
  if(posts[index].replyStatus) {
    posts[index].replyStatus = false;
  } else {
    posts[index].replyStatus = true;
  }
  renderPostsAndReplies(0, posts.length);
  dynamicTextarea();
}

// Restaurant rating color scale (bell curve)
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

// HTML for posts and replies
function getPostHTML(start, end) {
  let combinedHTML = '';
  for (let i = start; i < end; i++) {
    const { name, rating, ratingColor, username, description, replyCount, likeCount, shareCount, likeButtonImg, bookmarkImg, likeCountTextColor} = posts[i];
    const postHTML =
      `<div class="post">
        <div class="rating ${ratingColor}">${rating}</div>
        <div class="post-header">
          <div class="restaurant-name">${name}</div>
          <div class="time">2 months ago</div>
          <div class="bs">
            <img class="bookmark-icon" src=${bookmarkImg}>
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
            <img class="like-icon" src=${likeButtonImg}>
            <div class=${likeCountTextColor}>${likeCount}</div>
            <div class="tooltip">Like</div>
          </div>
          <div class="share-container">
            <img class="share-icon" src="images/share.png">
            <div>${shareCount}</div>
            <div class="tooltip">Share</div>
          </div>
        </div>
      </div>`
    combinedHTML += postHTML;
  }
  return combinedHTML;
}
function getReplyHTML(index) {
  html =
  `<div class="post-reply-container">
    <input class="reply-username-input" placeholder="Username">
    <textarea class="comment-input" placeholder="Share your thoughts!"></textarea>
    <div class="reply-buttons">
      <button class="delete-replies-button">Delete</button>
      <button class="send-reply-button">Send</button>
    </div>
  </div>`
  for(let i=0; i<posts[index].replies.length; i++) {
    html += 
      `<div class="replies">
        <div class="reply">
          <div class="reply-username">@${posts[index].replies[i].username}</div>
          <div class="reply-comment">${posts[index].replies[i].comment}</div>
        </div>
      </div>`
  }
  return html;
}

// Temporary
function deletePosts() {
  posts.splice(0, 1);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts(0, posts.length);
}
function deleteReplies(index) {
  posts[index].replies.splice(0, 1);
  posts[index].replyCount--;
  renderPostsAndReplies(0, posts.length);
}

function toggleDisplayById(elementId) {
  if(elementId.classList.contains('not-visible')) {
    elementId.classList.remove('not-visible');
  } else {
    elementId.classList.add('not-visible');
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