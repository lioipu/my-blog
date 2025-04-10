import {posts} from './data.js'




document.addEventListener('click', e => {
    
    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    let currentPost = postsData.find(post => post.uuid === currentEventUuid)
    postsData.find(post => post.isOn === true).isOn = false
    
    //if were clicked on article were going to get in here
    if(currentEventUuid) {
        clickArticleHandler(currentPost)
        //if were clicked on home or about page were going to get in here
    } else if(e.target.className === 'link') {
        if(e.target.dataset.home === 'home') {
            clickHomeBtnHandler(currentPost)
        } else {
            clickAboutBtnleHandler(currentPost)
        }
    // when view more button is pressed
    } else if(e.target.dataset.viewMoreBtn) {
        // view more btn
        viewMoreBtnClickHandler()
    }
})

// localStorage.clear()

/************************* managing local storage *************************/

if(localStorage.getItem('state') ) {
    var state = JSON.parse(localStorage.getItem('state'))
} else {
    var state = 'HOME'
}

if(localStorage.getItem('postsData')) {
    var postsData = JSON.parse(localStorage.getItem('postsData'))
} else {
    var postsData = []
    posts.forEach(post => postsData.push(post))
}



function saveToLocalStorage() {
    localStorage.setItem('state', JSON.stringify(state))
    localStorage.setItem('postsData', JSON.stringify(postsData))
}

function clickArticleHandler(currentPost = postsData.find(post => post.isOn === true)) {
    state = 'ARTICLE'
    postsData.find(post => post.uuid === currentPost.uuid).isOn = true
    saveToLocalStorage()
    render(3, currentPost)
}

function clickHomeBtnHandler(currentPost = postsData.find(post => post.isMain === true)) {
    postsData.find(post => post.isMain === true).isOn = true
    state = 'HOME'
    saveToLocalStorage()    
    render(3, currentPost)
}

function clickAboutBtnleHandler(currentPost = postsData.find(post => post.isMain === true)) {
    postsData.find(post => post.isMain === true).isOn = true
    state = 'ABOUT'
    saveToLocalStorage()    
    render(3, currentPost)
}


function viewMoreBtnClickHandler() {
    state = 'HOME'
    saveToLocalStorage()    
    render(postsData.length)
}

/* give us the main article that were on at the moment and present it on the screen */
function getMainArticle(currentPost) {
    
    let postStr = ''

    if(state === 'HOME') {
        postStr = `<a href="#" id="main-post-container" data-post-uuid="${currentPost.uuid}" >
            <article id="main-post">
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
            </article>
        </a>
        `
    } else if(state === 'ARTICLE' || state === 'ABOUT') {
        postStr += `
        <div id="post-container">
            <article>
        `
        if(state === 'ARTICLE') {
            postStr += `
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
                <img class="post-image" src="${currentPost.image}">`
                
            } else {
                postStr += `
                <div id="about-img-container">
                    <img class="about-img" src="${'images/my-profile.png'}">
                </div>
                    <h2 id="about-title">Hi there! My name is Lior<br> and welcome to my learning journal.</h2>
                    <p id=about-content id="content">${currentPost.intro}</p>


            `
        }
        for(let i = 0 ; i < currentPost.content.titles.length ; i++) {
            postStr += `<h3>${currentPost.content.titles[i]}</h3>
                <p>${currentPost.content.contents[i]}</p>
                `
            }
            postStr += `
            </article>
        </div>`
    }
    saveToLocalStorage()
    console.log(postsData)
    return postStr
}

function getPostsList(size, currentPost) {
    
    let postsStr = `<div id="posts">`
    
    if(state === 'ARTICLE' || state === 'ABOUT') {
        document.getElementById('recent-post-title').innerHTML = 'Recent posts'
    } else {
        document.getElementById('recent-post-title').innerHTML = ''
    }
    
    postsStr += postsData.filter( post => ( post.isMain === false ) && ( post.isOn === false ) )
    .map( post => {
        return `<a class="blog" href="#" data-post-uuid="${post.uuid}">
            <article>
                <img class="post-image" src="${post.image}">    
                <header class="post">
                    <p class="post-date">${post.date}</p>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-content">${post.intro}</p>
                </header>
            </article>
        </a>
        `
    }).slice(0, size).join('')
    // currentPost.isOn = false

    if(state === 'HOME') {
        document.getElementById('btn-container').innerHTML = `
        <button id="btn" data-view-more-btn="view-more-btn" >View More</button>`
    } else {
        document.getElementById('btn-container').innerHTML = ''
    }
    return postsStr
}

function render( size = 3, currentPost = postsData.find( post => post.isOn === true )) {
    document.getElementById('main').innerHTML = getMainArticle(currentPost)
    document.getElementById('posts-container').innerHTML = getPostsList(size, currentPost)
}

saveToLocalStorage()
render()