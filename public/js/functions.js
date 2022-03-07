var user = JSON.parse(localStorage.getItem('user'));
var pageNumber = 1
var searchTags = {}

window.onload = async function(e) {
    if (window.location.pathname == "/") {
        loadImages(pageNumber) 
        loadImages(pageNumber) 
    }

    if (window.location.pathname == "/bookmarks.html") {
        getBookmarkedImages() 
    }

    if (user) {
        document.getElementById('headerLeftContainerMobile').innerHTML = 
        `
            <a href="/"><h1 class="headerLogo">Coolest images</h1></a>
        `

        document.getElementById('headerLeftContainer').innerHTML = 
        `
            <a href="/"><h1 class="headerLogo">Coolest images</h1></a>
            <a href="/" class="headerLink">Browse</a>
            <a href="/bookmarks.html" class="headerLink">Bookmarks</a>
        `

        document.getElementById('headerRightContainerMobile').innerHTML = 
        `
            <i class="fa fa-bars headerMenuIcon menuMobileActiveComponent" onclick="toggleMobileMenu()"></i>
        `

        document.getElementById('headerRightContainer').innerHTML = 
        `
            <p class="loginLink" onclick="logout()">Logout</p>
            <p >Hi ${user.name}</p>
        `

        document.getElementById('menuMobileContainerInner').innerHTML = 
        `
            <div class="menuMobileContainerTop menuMobileActiveComponent">
                <a href="/"><h1 class="headerLogo">Coolest images</h1></a>
                <p class="headerMenuMobileCross" onclick="toggleMobileMenu()">X</p>
            </div>
            <p class="mobileMenuLoggedInGreeting">Hi ${user.name}</p>
            <a href="/" class="mobileMenuLink">Browse</a>
            <a href="/bookmarks.html" class="mobileMenuLink">Bookmarks</a>
            <p class="mobileMenuLink" onclick="logout()">Logout</p>
        `
    } else {
        document.getElementById('headerLeftContainerMobile').innerHTML = 
        `
            <a href="/"><h1 class="headerLogo">Coolest images</h1></a>
        `

        document.getElementById('headerLeftContainer').innerHTML = 
        `
            <a href="/"><h1 class="headerLogo">Coolest images</h1></a>
            <a href="/" class="headerLink">Browse</a>
        `

        document.getElementById('headerRightContainerMobile').innerHTML = 
        `
            <i class="fa fa-bars headerMenuIcon menuMobileActiveComponent" onclick="toggleMobileMenu()"></i>
        `

        document.getElementById('headerRightContainer').innerHTML = 
        `
            <a href="/login.html" class="loginLink">Login</a>
            <a href="/signup.html" class="btn btnRed">Sign up</a>
        `
        document.getElementById('menuMobileContainerInner').innerHTML = 
        `
            <div class="menuMobileContainerTop menuMobileActiveComponent">
                <a href="/"><h1 class="headerLogo">Coolest images</h1></a>
                <p class="headerMenuMobileCross" onclick="toggleMobileMenu()">X</p>
            </div>
            <a href="/" class="mobileMenuLink">Browse</a>
            <a href="/login.html" class="mobileMenuLink">Login</a>
            <a href="/signup.html" class="mobileMenuLink">Sign up</a>
        `
    }
}

//Image functions
if (window.location.pathname == "/") {
    window.addEventListener('scroll',() => {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 300) {
            loadImages(pageNumber);
        }
    })
}

window.addEventListener("click", function(event) {
    if (document.getElementById('menuMobileContainer').classList.contains("menuMobileContainerActive")) {
        if (!event.target.matches('.menuMobileActiveComponent')) {
            document.getElementById('menuMobileContainer').classList.add("menuMobileContainer")
            document.getElementById('menuMobileContainer').classList.remove("menuMobileContainerActive")
        } 

    } 
});

async function loadImages(number){
    // Create placeholder images while loading
    pageNumber++
    const loadingImages =  document.createElement('div');
    loadingImages.id = `imageLoad${number}`
    loadingImages.className = "imagesContainerInner"

    for (let i = 0; i < 12; i++) {
        loadingImages.innerHTML +=         
        `
            <div class="imageSingleContainer" tabindex="0">
                <div class="imageSingleContainerInner">
                </div>
            </div>
        `
    }   

    document.getElementById('imagesContainer').appendChild(loadingImages)
    
    if (user) {
        await axios.get(`/api/images/logged-in`, { 
            params: { 
                page: number, 
                tags: searchTags.tags ? searchTags.tags : "nature", 
            }, headers: { Authorization: `Bearer ${user.token}`,}  
        })
        .then(function (response) {
            const loaded =  document.createElement('div');

            if (response.data.length > 0) {
                loaded.className = "imagesContainerInner"
                loaded.id = `loaded${number}`

                for (var image of response.data) {
                    loaded.innerHTML +=         
                    `
                        <div class="imageSingleContainer" 
                            id="${image.imageURL}" 
                            tabindex="0" 
                            onclick="${image.bookmarked ? "removeBookmark('" + image.imageURL + "')" : "bookmarkImage('" + image.imageURL + "')"}">
                            <div class="imageSingleContainerInner">
                                <i class="fa fa-bookmark ${image.bookmarked ? "bookmarkIconSaved" : "bookmarkIcon"}"></i>
                                <div class="flickrImage" style="background-image: url('${image.imageURL}')">
                                </div>
                            </div>
                        </div>
                    `
                }
            } else {
                if (document.getElementById(`imagesContainer`).contains(loadingImages)) {
                    const textNode = document.createTextNode("No images found");
                    loaded.appendChild(textNode);
                }
            }

    
            // Replace placeholder with loaded images
            if (document.getElementById(`imagesContainer`).contains(loadingImages)) {
                document.getElementById(`imagesContainer`).removeChild(loadingImages)
            }
            document.getElementById(`imagesContainer`).appendChild(loaded)
            })
            .catch(function (error) {
                const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

                document.getElementById('imageError').innerHTML = message
                document.getElementById('imageErrorContainer').classList.add("showError")
        })
    } else {
        await axios.get(`/api/images/`, { 
            params: { 
                page: number, 
                tags: searchTags.tags ? searchTags.tags : "nature" 
            } 
        })
        .then(function (response) {
            const loaded =  document.createElement('div');

            if (response.data.length > 0) {
                loaded.className = "imagesContainerInner"
                loaded.id = `loaded${number}`
                
                for (var image of response.data) {
                    loaded.innerHTML +=         
                    `
                        <div class="imageSingleContainer" id="${image}" tabindex="0" >
                            <div class="imageSingleContainerInner">
                                <div class="flickrImage" style="background-image: url('${image}')">
                                </div>
                            </div>
                        </div>
                    `
                }
            } else {
                if (document.getElementById(`imagesContainer`).contains(loadingImages)) {
                    const textNode = document.createTextNode("No images found");
                    loaded.appendChild(textNode);
                }
            }

            // Replace placeholder with loaded images
            if (document.getElementById(`imagesContainer`).contains(loadingImages)) {
                document.getElementById(`imagesContainer`).removeChild(loadingImages)
            }            
            document.getElementById(`imagesContainer`).appendChild(loaded)
            })
            .catch(function (error) {
                const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

                document.getElementById('imageError').innerHTML = message
                document.getElementById('imageErrorContainer').classList.add("showError")        
        })
    }
}   

function searchImages(e) {
    if (document.getElementById("searchQuery").value) {
        pageNumber = 0
    }
    searchTags.tags = document.getElementById("searchQuery").value
    document.getElementById("imagesContainer").innerHTML = "";
    loadImages(pageNumber) 
    loadImages(pageNumber++) 
}

async function getBookmarkedImages() {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
    }

    await axios.get(`/api/images/bookmarks`, config)
    .then(function (response) {
        if (response && response.data.length > 0) {
            document.getElementById('bookmarksContainerInner').innerHTML = response.data.map(image => 
                `<div class="imageSingleContainer" id="${image.imageURL}" tabindex="0"" onclick="removeBookmark('${image.imageURL}')">
                    <div>
                        <i class="fa fa-bookmark bookmarkIconSaved"></i>
                    </div>
                    
                    <div class="imageSingleContainerInner">
                        <div class="flickrImage" style="background-image: url('${image.imageURL}')"></div>
                    </div>
                </div>`
            ).join('') 
        } else {
            document.getElementById('bookmarksContainer').innerHTML = `<p class="noImagesFound">You don't have any images bookmarked</p>`
        }
    })
    .catch(function (error) {
        const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString()

        document.getElementById('imageError').innerHTML = message
        document.getElementById('imageErrorContainer').classList.add("showError")    
    })
}

async function bookmarkImage(e) {    
    var user = JSON.parse(localStorage.getItem('user'));

    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
    }

    await axios.put(`/api/images/bookmark`, {url: e}, config)
    .then(function (response) {
        if (response.data) {
            document.querySelector(`div[id="${e}"] i`).classList.add( "showBookmark" )
        }
    })
    .catch(function (error) {
        const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString()

        document.getElementById('imageError').innerHTML = message
        document.getElementById('imageErrorContainer').classList.add("showError")    })
}

async function removeBookmark(e) {
    document.querySelector(`div[id="${e}"] i`).classList.add( "removeBookmark" )
    
    var user = JSON.parse(localStorage.getItem('user'));

    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
    }

    await axios.put(`/api/images/remove-bookmark`, {url: e}, config)
    .then(function (response) {
        if (window.location.pathname == "/bookmarks.html") {
            if (response.data && response.data.length > 0) {
                document.getElementById('bookmarksContainerInner').innerHTML = response.data.map(image => 
                    `<div class="imageSingleContainer" id="${image.imageURL}" tabindex="0"" onclick="removeBookmark('${image.imageURL}')">
                        <div>
                            <i class="fa fa-bookmark bookmarkIconSaved"></i>
                        </div>
                        
                        <div class="imageSingleContainerInner">
                            <div class="flickrImage" style="background-image: url('${image.imageURL}')"></div>
                        </div>
                    </div>`
                ).join('')
            } else {
                    document.getElementById('bookmarksContainer').innerHTML = `<p class="noImagesFound">You removed all your bookmarks! :(</p>`
            }
        }

    })
    .catch(function (error) {
        const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString()

        document.getElementById('imageError').innerHTML = message
        document.getElementById('imageErrorContainer').classList.add("showError")
    })
}

function toggleMobileMenu() {
    if (document.getElementById('menuMobileContainer').classList.contains("menuMobileContainer")) {
        document.getElementById('menuMobileContainer').classList.add("menuMobileContainerActive")
        document.getElementById('menuMobileContainer').classList.remove("menuMobileContainer")
    } else {
        document.getElementById('menuMobileContainer').classList.add("menuMobileContainer")
        document.getElementById('menuMobileContainer').classList.remove("menuMobileContainerActive")
    }
}

//Auth functions
async function signupUser(e) {
    var data = {
        name: document.getElementById("nameSignup").value,
        email: document.getElementById("emailSignup").value,
        password: document.getElementById("passwordSignup").value
    }
    
    if(data.name && data.email && data.password) {
        await axios.post(`/api/users/`, data)
        .then(function (response) {
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data))
                window.location.href = "/";
            }
        })
        .catch(function (error) {
            const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString()

            document.getElementById('signupError').innerHTML = message
            document.getElementById('signupErrorContainer').classList.add("showError")
        })
    }
}

async function loginUser(e) {
    var data = {
        email: document.getElementById("emailLogin").value,
        password: document.getElementById("passwordLogin").value
    }
    
    if(data.email && data.password) {
        await axios.post(`/api/users/login`, data)
        .then(function (response) {
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data))
                window.location.href = "/";
            }
        })
        .catch(function (error) {
            const message =
            (error.response && error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString()

            document.getElementById('loginError').innerHTML = message
            document.getElementById('loginErrorContainer').classList.add( "showError" )
        })
    }
}

// Logout user
function logout() {
    localStorage.removeItem('user')
    window.location.href = "/";
}