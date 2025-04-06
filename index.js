import {posts} from './data.js'

const state = {
    home: true,
    about: false,
    article: false
}

document.addEventListener('click', e => {
    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    if(currentEventUuid) {
        state.article = true
        render(3, posts.find(post => post.uuid === currentEventUuid))
    } else if(e.target.className === 'link') {
        if(e.target.dataset.home === 'home') {
            state.home = true
            render()
        } else {
            console.log('here')
            state.about = true
            render()
        }
    } else if(e.target.dataset.viewMoreBtn) {
        console.log('viewMoreBtn')
        // view more btn
        viewMoreBtnClickHandler()
    }
})

function viewMoreBtnClickHandler() {
    state.home = true
    render(0)
}

/* give us the main article that were on at the moment and present it on the screen */
function getMain(currentPost = posts.find( post => post.isMain === true)) {
    let postStr = ''
    if(state.home) {
        state.home = false
        postStr = `<a href="#" id="main-post-container" data-post-uuid="${currentPost.uuid}" >
            <article id="main-post">
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
            </article>
        </a>
        `
    } else if(state.article || state.about) {
        postStr += `
        <div id="post-container">
            <article>
        `
        if(state.article) {
            state.article = false
            postStr += `
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
                <img class="post-image" src="${currentPost.image}">`
                
            } else {
                state.about = false
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

function getPostsList(size) {
    let postsStr = `<div id="posts">`
    if(state.article || state.about) {
        document.getElementById('recent-post-title').innerHTML = 'Recent posts'
    } else {
        document.getElementById('recent-post-title').innerHTML = ''
    }
    console.log('size:' + size)
    postsStr += posts.filter( post => post.isMain === false).map( post => {
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
    }).slice(size).join('')

    if(state.home) {
        document.getElementById('btn-container').innerHTML = `
        <button id="btn" data-view-more-btn="view-more-btn" >View More</button>`
    } else {
        document.getElementById('btn-container').innerHTML = ''
    }

    

    return postsStr
}

function render( size = 3, currentPost = posts.find( post => post.isMain === true)) {
    document.getElementById('posts-container').innerHTML = getPostsList(size)
    document.getElementById('main').innerHTML = getMain(currentPost)
}

render()