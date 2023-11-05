const list = document.getElementById("list");
fetch('members.json')
    .then(response => response.json())
    .then(data => {
        // Handle the JSON data here
        data.forEach(listItem => {
            list.innerHTML += `
			<a class="list-item zoom-in-out">
			  <div class="list-item__avatar ">
			    <img class="list-item__img" src="${listItem.picture}" />
			  </div>
			  <div class="list-item__content">
					  <strong class="list-item__name">${listItem.name}</strong>
					  <span class="list-item__info">${listItem.serviceName} <br></span>
					</div>
			</a>
 `
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
// Search
const userSearch = document.querySelector("[data-search]");

userSearch.addEventListener("keyup", filter);

function filter() {
    var term = document.querySelector("[data-search]").value.toLowerCase();
    var tag = document.querySelectorAll("[data-searchable] .list-item");
    for (i = 0; i < tag.length; i++) {
        if (tag[i].innerHTML.indexOf(term) !== -1) {
            tag[i].style.display = "flex";
        } else {
            tag[i].style.display = "none";
        }
    }
}

const recentSearch = document.querySelector(".recent-search");
const recentSearchList = document.querySelector(".recent-search__list");
const recentSearchTitle = document.querySelector(".recent-search__title");
const recentSearchCount = recentSearchList.childNodes.length;
const clearBtn = document.querySelector(".clear-btn");
const clearSearch = document.querySelector('.search__clear');

clearSearch.addEventListener('click', () => {
    userSearch.value = "";
    filter();
})

userSearch.addEventListener("keydown", event => {
    const keyName = event.key;
    if (event.key == "Enter") {
        let inputText = userSearch.value.toLowerCase();
        recentSearchList.insertAdjacentHTML(
            "beforeend",
            `<span class="search-item" onclick="labelSearch('${inputText}')">${inputText}<span class="search-item__close">×</span></span>`
        );
        if (recentSearchList.childNodes.length > 0) {
            clearBtn.innerHTML = "Clear Items";
            clearBtn.removeAttribute("disabled");
            var btn = document.querySelectorAll(".search-item__close");

            for (var i = 0; i < btn.length; i++) {
                btn[i].addEventListener("click", function (e) {
                    e.currentTarget.parentNode.remove();
                }, false
                );
            }
        }
    } else {
    }
});

function labelSearch(x) {
    userSearch.value = x;
    filter();
}
