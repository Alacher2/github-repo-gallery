
//This is where my profile info will appear
const overview = document.querySelector(".overview");
const username = "Alacher2";
const repoList = document.querySelector(".repo-list");
const myRepos = document.querySelector(".repos");
const myRepoInfo = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getUserData = async function () {
  const userData = await fetch(`https://api.github.com/users/${username}`);
    const data = await userData.json();
    displayUserData(data);
};

getUserData();

const displayUserData = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
  <figure>
      <img alt="user avatar" src=${data.avatar_url}/>
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
    overview.append(div);
    userRepos(username);
};

const userRepos = async function (username) {
  const getRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await getRepos.json();
  displayRepos(repoData);
}

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function(e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function (repoName) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);
  // Get Languages
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  
  //List of languages
  const languages = [];
    for (const language in languageData) {
      languages.push(language);
    }

    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  myRepoInfo.innerHTML = "";
  myRepoInfo.classList.remove("hide");
  myRepos.classList.add("hide");
  backButton.classList.remove("hide");
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
      <p>Description: ${repoInfo.description}</p>
      <p>Default Branch: ${repoInfo.default_branch}</p>
      <p>Languages: ${languages.join(",")}</p>
      <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
      `;
      myRepoInfo.append(div);
};

backButton.addEventListener("click", function () {
  myRepos.classList.remove("hide");
  myRepoInfo.classList.add("hide");
  backButton.classList.add("hide");
})

filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelector(".repo");
  const searchLowerCase = searchText.toLowerCase(); 

  for (const repo of repos) {
    const repoLowerCase = repo.innerText.toLowerCase();
    if (repoLowerCase.include(searchLowerCase)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});