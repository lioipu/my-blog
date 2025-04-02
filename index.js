import {posts} from './data.js'

const state = {
    home: true,
    about: false,
    article: false
}

document.addEventListener('click', e => {
    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    console.log(e.currentTarget.activeElement)
    console.log(currentEventUuid)
    if(currentEventUuid) {
        state.article = true
        render(posts.find(post => post.uuid === currentEventUuid))
    } else if(e.target.className === 'link') {
        if(e.target.dataset.home === 'home') {
            state.home = true
            render()
        } else {
            state.about = true
            render()
        }
    }
})

/* give us the main article that were on at the moment and present it on the screen */
function getMain(currentPost = posts.find( post => post.isMain === true)) {
    let postStr = ''
    if(state.home) {
        state.home = false
        console.log('home state')
        postStr = `<a href="#" id="main-post-container" data-post-uuid="${currentPost.uuid}" >
            <article id="main-post">
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
            </article>
        </a>
        `
    } else if(state.article) {
        console.log('article state')
        state.article = false
        postStr = `<div id="post-container">
            <article>
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
                <img class="post-image" src="${currentPost.image}">
        `
        for(let i = 0 ; i < currentPost.content.titles.length ; i++) {
            postStr += `<h3>${currentPost.content.titles[i]}</h3>
                <p>${currentPost.content.contents[i]}</p>
                `
            }
            postStr += `
            </article>
        </div>`
        } else {
            // about page code to be implemented here
        }
    
    return postStr
}

function getPostsList() {
    let postsStr = posts.filter( post => post.isMain === false).map( post => {
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
    }).join('')

    postsStr += `<button id="btn"  >View More</button>`

    return postsStr
}

function render(currentPost = posts.find( post => post.isMain === true)) {
    document.getElementById('posts').innerHTML = getPostsList() 
    document.getElementById('main').innerHTML = getMain(currentPost)

}

render()