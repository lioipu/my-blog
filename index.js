import {posts} from './data.js'

let state = 'HOME'

document.addEventListener('click', e => {
    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    if(currentEventUuid) {
        state = 'ARTICLE'
        render(3, posts.find(post => post.uuid === currentEventUuid))
    } else if(e.target.className === 'link') {
        if(e.target.dataset.home === 'home') {
            state = 'HOME'
            render()
        } else {
            console.log('about')
            state = 'ABOUT'
            render()
        }
    } else if(e.target.dataset.viewMoreBtn) {
        console.log('viewMoreBtn')
        // view more btn
        viewMoreBtnClickHandler()
    }
})

function viewMoreBtnClickHandler() {
    state = 'HOME'
    render(posts.length)
}

/* give us the main article that were on at the moment and present it on the screen */
function getMain(currentPost = posts.find( post => post.isMain === true)) {
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

    currentPost.isOn = false

    if(state === 'HOME') {
        console.log('home?')
        document.getElementById('btn-container').innerHTML = `
        <button id="btn" data-view-more-btn="view-more-btn" >View More</button>`
    } else {
        document.getElementById('btn-container').innerHTML = ''
    }



    return postsStr
}

function render( size = 3, currentPost = posts.find( post => post.isMain === true)) {
    document.getElementById('main').innerHTML = getMain(currentPost)
    document.getElementById('posts-container').innerHTML = getPostsList(size, currentPost)
}

render()