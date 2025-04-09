import {posts} from './data.js'

let state = ''

document.addEventListener('click', e => {
    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    //if were clicked on article were going to get in here
    if(currentEventUuid) {
        state = 'ARTICLE'
        saveToLocalStorage()
        render(3, postsData.find(post => post.uuid === currentEventUuid))
    //if were clicked on home or about page were going to get in here
    } else if(e.target.className === 'link') {
        if(e.target.dataset.home === 'home') {
            state = 'HOME'
            saveToLocalStorage()
            render()
        } else {
            state = 'ABOUT'
            saveToLocalStorage()
            render()
        }
    // when view more button is pressed
    } else if(e.target.dataset.viewMoreBtn) {
        console.log('viewMoreBtn')
        // view more btn
        viewMoreBtnClickHandler()
    }
})

// localStorage.clear()

let postsData = []

if(localStorage.getItem('state') ) {
    state = JSON.parse(localStorage.getItem('state'))
}
if(localStorage.getItem('postsData')) {
    postsData = JSON.parse(localStorage.getItem('postsData'))
    console.log('if')
} else {
    console.log('else')
    posts.forEach(post => postsData.push(post))
}

function saveToLocalStorage() {
    console.log(state)
    localStorage.setItem('state', JSON.stringify(state))
    localStorage.setItem('postsData', JSON.stringify(postsData))
}


function viewMoreBtnClickHandler() {
    state = 'HOME'
    render(postsData.length)
}

/* give us the main article that were on at the moment and present it on the screen */
function getMain(currentPost = postsData.find( post => post.isMain === true)) {
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
            console.log(postsData.find( post => post.isOn === true))
            postsData.find( post => post.isOn === true).isOn = false
            currentPost.isOn = true
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
        } else {


        }
    
    return postStr
}

function getPostsList(size, currentPost) {
    let postsStr = `<div id="posts">`
    if(state === 'ARTICLE' || state === 'ABOUT') {
        document.getElementById('recent-post-title').innerHTML = 'Recent posts'
    } else {
        document.getElementById('recent-post-title').innerHTML = ''
    }
    postsStr += posts.filter( post => ( post.isMain === false ) && ( post.isOn === false ) )
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

function render( size = 3, currentPost = postsData.find( post => post.isMain === true)) {
    document.getElementById('main').innerHTML = getMain(currentPost)
    document.getElementById('posts-container').innerHTML = getPostsList(size, currentPost)
}

if(state === '') {
    state = 'HOME'
}
saveToLocalStorage()
render()