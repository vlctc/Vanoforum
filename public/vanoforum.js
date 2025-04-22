const username = document.getElementById('username');
const title = document.getElementById('title');
const content = document.getElementById('content');
const btn = document.getElementById('publishBtn');
const articles = document.getElementById('articles');


function validateForm() {
  if (username.value && title.value && content.value) {
    btn.disabled = false;
    btn.classList.add("enabled");
  } else {
    btn.disabled = true;
    btn.classList.remove("enabled");
  }
}

username.addEventListener("input", validateForm);
title.addEventListener("input", validateForm);
content.addEventListener("input", validateForm);

function createArticleElement(article) {
  const articleDiv = document.createElement("div");
  articleDiv.className = "article";
  articleDiv.style.borderBottom = "1px solid #ccc";
  articleDiv.style.padding = "10px 0";
  articleDiv.innerHTML = `
    <h3>${article.title} - <small>${article.username}</small></h3>
    <p>${article.content}</p>
    <small>${new Date(article.date).toLocaleString()}</small>
  `;
  return articleDiv;
}

function loadArticles() {
  fetch('http://localhost:3000/api/articles')
    .then(res => res.json())
    .then(data => {
      articles.innerHTML = "";
      data.forEach(article => {
        const articleElement = createArticleElement(article);
        articles.appendChild(articleElement);
      });
    })
    .catch(err => {
      console.error("Error loading articles:", err);
    });
}

btn.addEventListener("click", () => {
  const newArticle = {
    username: username.value.trim(),
    title: title.value.trim(),
    content: content.value.trim()
  };

  fetch('http://localhost:3000/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newArticle)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to post article");
      }
      return res.json();
    })
    .then(data => {
      username.value = "";
      title.value = "";
      content.value = "";
      validateForm();
      loadArticles();
    })
    .catch(err => {
      console.error("Error submitting article:", err);
    });
});

// Load on page start
window.addEventListener("DOMContentLoaded", loadArticles);