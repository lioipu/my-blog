import {posts} from './data.js'
const STATES = {
    HOME: 'HOME',
    ARTICLE: 'ARTICLE',
    ABOUT: 'ABOUT'
}

const SIZE = 3
let state = 'HOME'
let size = SIZE
let postsData = []

/***************** event listeners handling *****************/

window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastUnloadTime', JSON.stringify(Date.now().toString()));
  })
  
  // When page loads
  window.addEventListener('load', () => {
    const lastUnload = JSON.parse(localStorage.getItem('lastUnloadTime'));
    if (lastUnload) {
      const timeDiff = Date.now() - parseInt(lastUnload, 10);
      if (timeDiff < 100) {
        console.log('Page was refreshed (quick return)');
      } else {
        console.log('Page was likely reopened after being closed');
        postsData.find( post => post.isOn === true).isOn = false
        updateState(STATES.HOME, SIZE, postsData.find( post => post.isMain === true))
    }
} else {
    console.log('First page load or sessionStorage was cleared');
    }
  })

document.addEventListener('click', e => {

    let currentEventUuid = e.currentTarget.activeElement.dataset.postUuid
    let currentPost = postsData.find(post => post.uuid === currentEventUuid)
    console.log(postsData)
    
    //if were clicked on article were going to get in here
    if(currentEventUuid) {
        postsData.find(post => post.isOn === true).isOn = false
        clickArticleHandler(currentPost)
        //if were clicked on home or about page were going to get in here
    } else if(e.target.className === 'link') {
        postsData.find(post => post.isOn === true).isOn = false
        if(e.target.dataset.home === 'home') {
            updateState(STATES.HOME, SIZE, postsData.find(post => post.isMain === true))
        } else {
            updateState(STATES.ABOUT, SIZE, postsData.find(post => post.isMain === true))
        }
        // when view more button is pressed
    } else if(e.target.dataset.viewMoreBtn) {
        postsData.find(post => post.isOn === true).isOn = false
        // view more btn
        updateState(STATES.HOME, postsData.length, postsData.find(post => post.isMain === true))
    }
})

// localStorage.clear()
/************************* managing local storage *************************/

if(localStorage.getItem('state') ) {
    state = JSON.parse(localStorage.getItem('state'))
} else {
    state = STATES.HOME
}

if(localStorage.getItem('size')) {
    size = JSON.parse(localStorage.getItem('size'))
} else {
    size = SIZE
}

if(localStorage.getItem('postsData')) {
    postsData = JSON.parse(localStorage.getItem('postsData'))
} else {
    postsData = []
    posts.forEach(post => postsData.push(post))
}

function saveToLocalStorage() {
    localStorage.setItem('state', JSON.stringify(state))
    localStorage.setItem('size', JSON.stringify(size))
    localStorage.setItem('postsData', JSON.stringify(postsData))
}

function clickArticleHandler(currentPost) {
    currentPost.isOn = true
    state = STATES.ARTICLE
    size = SIZE
    saveToLocalStorage()
    render(size, currentPost)
}

function updateState(newState, newSize, currentPost) {
    currentPost.isOn = true
    state = newState
    size = newSize
    saveToLocalStorage()
    render(newSize, currentPost)
}

/* give us the main article that were on at the moment and present it on the screen */
function getMainArticle(currentPost) {
    let postStr = ''
    if(state === STATES.HOME) {
        postStr = `<a href="#" id="main-post-container" data-post-uuid="${currentPost.uuid}" >
            <article id="main-post">
                <p id="date">${currentPost.date}</p>
                <h2>${currentPost.title}</h2>
                <p id="content">${currentPost.intro}</p>
            </article>
        </a>
        `
    } else if(state === STATES.ARTICLE || state === STATES.ABOUT) {
        postStr += `
        <div id="post-container">
            <article>
        `
        if(state === STATES.ARTICLE) {
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
    return postStr
}

function getPostsList(size, currentPost) {
    
    let postsStr = `<div id="posts">`
    
    if(state === STATES.ARTICLE || state === STATES.ABOUT) {
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

    if(state === STATES.HOME) {
        document.getElementById('btn-container').innerHTML = `
        <button id="btn" data-view-more-btn="view-more-btn" >View More</button>`
    } else {
        document.getElementById('btn-container').innerHTML = ''
    }
    return postsStr
}

function render( size , currentPost = postsData.find( post => post.isOn === true )) {
    document.getElementById('main').innerHTML = getMainArticle(currentPost)
    document.getElementById('posts-container').innerHTML = getPostsList(size, currentPost)
}

saveToLocalStorage()
render(size)