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
});

// Post Functions
function addPostEventListener() {
  document.querySelectorAll(".post").forEach((post, index) => {
    post.addEventListener("click", () => {
      renderPostAndReplies(index);
    })
  })
}

// Post Form Buttons
document.getElementById('post-button').addEventListener("click", () => {
  openPostForm();
});

document.getElementById("form-submit-button").addEventListener("click", () => {
  submitPostForm();
});

document.getElementById("form-clear-button").addEventListener("click", () => {
  clearForm();
});

document.getElementById('form-exit-button').addEventListener("click", () => {
  closeForm();
});


// ----------------------------- 
// Main Code   
// ----------------------------- 

let posts = JSON.parse(localStorage.getItem("posts")) || [];
renderPosts(0, posts.length);
addPostEventListener();

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

  if(formErrorCheck(restaurantName, restaurantRating, username, description)) {
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
    localStorage.setItem("posts", JSON.stringify(posts));
  
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

function formErrorCheck(name, rating, username, description) {
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

function closeForm() { postForm.style.display = "none"; }

// ----------------------------- 
// DOM Manipulation Functions               
// ----------------------------- 

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

function getReplyFormHTML() {
  const replyFormHTML = 
    `<div class="reply-form flex">
      <input class="reply-username-input" placeholder="Username">
      <textarea class="comment-input" placeholder="Post your reply"></textarea>
      <div class="reply-buttons flex">
        <button class="delete-replies-button">Delete all replies (temp)</button>
        <button class="send-reply-button">Send</button>
      </div>
    </div>`
  return replyFormHTML;
}

function renderPosts(start, end) {
  const postsHTML = getPostsHTML(start, end);
  document.getElementById("posts").innerHTML = postsHTML;
  addPostEventListener();
}

function renderPostAndReplies(index) {
  let postAndRepliesHTML = getPostsHTML(index, index + 1);
  postAndRepliesHTML += getReplyFormHTML();
  console.log("this ran");
  document.getElementById("posts").innerHTML = postAndRepliesHTML;
}

function deletePost() {
  posts.shift();
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts(0, posts.length);
}