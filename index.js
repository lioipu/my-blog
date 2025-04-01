import {posts} from './data.js'

document.addEventListener('click', e => {
    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    render(posts.find(post => post.uuid === currentEventUuid).uuid)
})

function getMainPost(postUuid = posts.find( post => post.isMain === true).uuid) {
    let mainPost = posts.find( post => post.uuid === postUuid)
    let postStr = `<p id="date">${mainPost.date}</p>
    <h2>${mainPost.title}</h2>
    <p id="content">${mainPost.intro}</p>
    `
    return postStr
}

function getPostsList() {
    let postsStr = posts.filter( post => post.isMain === false).map( post => {
        return `<a class="blog" href="" data-post-uuid="${post.uuid}">
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

function render(postUuid = posts.find( post => post.isMain === true).uuid) {
    document.getElementById('posts').innerHTML = getPostsList() 
    document.getElementById('main-post').innerHTML = getMainPost(postUuid)

}

render()