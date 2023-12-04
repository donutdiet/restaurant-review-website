// ----------------------------- 
// Event Listeners               
// ----------------------------- 

// Posts Section Header 
// temp
document.getElementById("delete-posts-button").addEventListener("click", () => {
  deletePost();
});

// Sidebar Tabs 
document.getElementById("home-tab").addEventListener("click", () => {
  renderPosts(0, posts.length);
  display.state = "home";
  display.index = -1;
  localStorage.setItem("display", JSON.stringify(display));
});

// Post Functions
function addPostEventListener() {
  document.querySelectorAll(".post").forEach((post, index) => {
    post.addEventListener("click", () => {
      renderPostAndReplies(index);
      display.state = "post";
      display.index = index;
      localStorage.setItem("display", JSON.stringify(display));
    });
  });
}

function addPostLikeInteraction() {
  document.querySelectorAll(".like-button").forEach((likeButton, index) => {
    likeButton.addEventListener("click", e => {
      likeButtonClicked(index); e.stopPropagation(); // Button overlaps with div.
    });
  });
}

function addSinglePostLikeInteraction(index) {
  document.querySelector(".like-button").addEventListener("click", e => {
    if(posts[index].likeStatus) {
      posts[index].likeCount--;
      posts[index].likeStatus = false;
      console.log("unliked post");
    } else {
      posts[index].likeCount++;
      posts[index].likeStatus = true;
      console.log("liked post");
    }
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPostAndReplies(index);
  })
}

// Post Form Buttons
document.getElementById('post-button').addEventListener("click", () => {
  openPostForm();
});

document.getElementById("form-submit-button").addEventListener("click", () => {
  submitPostForm();
  localStorage.setItem("posts", JSON.stringify(posts));
});

document.getElementById("form-clear-button").addEventListener("click", () => {
  clearForm();
});

document.getElementById('form-exit-button').addEventListener("click", () => {
  closeForm();
});

// Reply Funcions
function addSubmitReplyEventListener(index) {
  document.querySelector(".send-reply-button").addEventListener("click", () => {
    submitReplyForm(index);
  });
}

// ----------------------------- 
// Main Code   
// ----------------------------- 

let display = JSON.parse(localStorage.getItem("display")) || { state:"home", index:-1 };
let posts = JSON.parse(localStorage.getItem("posts")) || [];

if(display.state == "home") {
  renderPosts(0, posts.length);
} else if(display.state == "post") {
  renderPostAndReplies(display.index, display.index + 1);
}

// ----------------------------- 
// Post Form Functions               
// ----------------------------- 

const postForm = document.getElementById('post-form');

function submitPostForm() {
  const restaurantName = document.getElementById("restaurant-name-input").value;
  const restaurantRating = document.getElementById("rating-input").value;
  const ratingColor = getRatingColor(restaurantRating);
  const username = document.getElementById("username-input").value;
  const description = document.getElementById("description-input").value;

  if(postFormErrorCheck(restaurantName, restaurantRating, username, description)) {
    posts.unshift({
      name: restaurantName,
      rating: restaurantRating,
      ratingColor: ratingColor,
      username: username,
      description: description,
      likeCount: 0,
      replyCount: 0,
      likeStatus: false,
      bookmarkStatus: false,
      replies: []
    });
  
    console.log(posts);
  
    clearForm();
    closeForm();
    renderPosts(0, posts.length);
  }
}

function getRatingColor(rating) {
  if (rating < 3) {
    return 'text-rating-0';
  } else if (rating < 16) {
    return 'text-rating-1';
  } else if (rating < 50) {
    return 'text-rating-2';
  } else if (rating < 84) {
    return 'text-rating-3';
  } else if (rating < 97) {
    return 'text-rating-4';
  } else if (rating < 100) {
    return 'text-light';
  }
}

function postFormErrorCheck(name, rating, username, description) {
  if(name.trim() === "") {
    document.getElementById("form-error-message").innerHTML = "Error: a restaurant name is required";
    return false;
  } else if (rating.trim() === "") {
    document.getElementById("form-error-message").innerHTML = "Error: a rating is required";
    return false;
  } else if (isNaN(rating) || rating < 1 || rating > 99) {
    document.getElementById("form-error-message").innerHTML = "Error: the rating must be a whole number from 1-99 ";
    return false;
  } else if (username.trim() === "") {
    document.getElementById("form-error-message").innerHTML = "Error: a username is required";
    return false;
  }
  return true;
}

function clearForm() {
  document.getElementById("restaurant-name-input").value = "";
  document.getElementById("rating-input").value = "";
  document.getElementById("username-input").value = "";
  document.getElementById("description-input").value = "";
  document.getElementById("form-error-message").innerHTML = "";
}

function openPostForm() {postForm.style.display = "grid"; }

function closeForm() { 
  clearForm();
  document.getElementById("form-error-message").innerHTML = "";
  postForm.style.display = "none"; 
}

// ----------------------------- 
// Reply Form Functions               
// ----------------------------- 

function submitReplyForm(index) {
  const replyUsername = document.querySelector(".reply-username-input").value;
  const replyComment = document.querySelector(".comment-input").value;

  if(replyUsername.trim() != "" && replyComment.trim() != "") {
    posts[index].replies.unshift({
      replyUsername: replyUsername,
      comment: replyComment
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPostAndReplies(index);
  }
}

// ----------------------------- 
// DOM Manipulation Functions               
// ----------------------------- 

// Post Functions
function getPostsHTML(start, end) {
  let postHTML = "";
  for(let i=start; i<end; i++) {
    const { name, rating, ratingColor, username, description, likeCount, replyCount} = posts[i];
    postHTML += 
      `<div class="post">
        <div class="rating ${ratingColor} bold">${rating}</div>
        <div class="post-header">
          <span class="bold">${name}</span>
          <span style="color: dimgray;">@${username} &#183; Oct 12</span>
        </div>
        <div class="post-comment">${description}</div>
        <div class="post-stats flex">
          <button class="like-button"></button>${likeCount}
          <button class="reply-button"></button>${replyCount}
          <button class="bookmark-button"></button>
        </div>
      </div>`
  }
  return postHTML;
}

function renderPosts(start, end) {
  const postsHTML = getPostsHTML(start, end);
  document.getElementById("posts").innerHTML = postsHTML;
  console.log("posts rendered");
  addPostEventListener();
  addPostLikeInteraction();
}

function deletePost() {
  posts.shift();
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts(0, posts.length);
}

function likeButtonClicked(index) {
  if(posts[index].likeStatus) {
    posts[index].likeCount--;
    posts[index].likeStatus = false;
    console.log("unliked post");
  } else {
    posts[index].likeCount++;
    posts[index].likeStatus = true;
    console.log("liked post");
  }
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts(0, posts.length);
}

// Reply Functions
function getReplyFormHTML() {
  const replyFormHTML = 
    `<div class="reply-form flex">
      <input class="reply-username-input" placeholder="Username">
      <textarea class="comment-input" placeholder="Post your reply"></textarea>
      <div class="reply-buttons flex">
        <button class="delete-replies-button">Delete reply (temp)</button>
        <button class="send-reply-button">Send</button>
      </div>
    </div>`
  return replyFormHTML;
}

function getRepliesHTML(index) {
  let repliesHTML = "";
  for(let i=0; i<posts[index].replies.length; i++) {
    const { replyUsername, comment } = posts[index].replies[i];
    repliesHTML += 
      `<div class="reply flex">
        <div class="reply-header">
          <span class="bold">@${replyUsername}</span>
          <span style="color: dimgray;">&#183; Oct 12</span>
        </div>
        <div class="comment">${comment}</div>
        <div class="reply-stats flex">
          <button class="r-like-button"></button>0
          <button class="r-reply-button"></button>
        </div>
      </div>`
  }
  return repliesHTML;
}

function renderPostAndReplies(index) {
  let postAndRepliesHTML = getPostsHTML(index, index + 1);
  postAndRepliesHTML += getReplyFormHTML();
  postAndRepliesHTML += getRepliesHTML(index);
  console.log("post and replies rendered");
  document.getElementById("posts").innerHTML = postAndRepliesHTML;
  addSubmitReplyEventListener(index);
  addSinglePostLikeInteraction(index);
}