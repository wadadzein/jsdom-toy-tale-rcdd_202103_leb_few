const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector('#toy-collection')
let addToy = false
const createToyForm = document.querySelector('.add-toy-form')

addBtn.addEventListener('click', () => {
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
  } else {
    toyForm.style.display = 'none'
  }
})

// if the <script> is at the top of the page, can use
// document.addEventListener('DOMContentLoaded', () => {})
// code goes here!

const initialize = () => {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    // divide toys here
    .then(toys => toys.forEach(showToy))
}

const showToy = toy => {
  let thisToy = toy
  let toyDiv = document.createElement('div')
  // add class to class list array
  toyDiv.classList.add('card')
  toyDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p>${toy.likes}</p>`
  let deleteBtn = document.createElement('button')
  deleteBtn.class = 'like-btn'
  deleteBtn.innerText = 'Delete'
  deleteBtn.addEventListener('click', e => deleteToy(e, thisToy.id))
  let likeBtn = document.createElement('button')
  likeBtn.class = 'like-btn'
  likeBtn.innerText = 'Like <3'
  likeBtn.addEventListener('click', e => showLikes(e, thisToy))
  toyDiv.append(likeBtn)
  toyDiv.append(deleteBtn)
  toyCollection.append(toyDiv)
}

const showLikes = (e, toy) => {
  let num = parseInt(e.target.parentElement.children[2].innerText)
  e.target.parentElement.children[2].innerText = num + 1
  likeToy(toy)
}

const likeToy = toy => {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ likes: toy.likes++ })
  }).then(resp => resp.json())
}

const deleteToy = (e, id) => {
  e.target.parentNode.remove()
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'DELETE'
  }).then(resp => resp.json())
}

createToyForm.addEventListener('submit', e => {
  e.preventDefault()
  addNewToy(e)
  createToyForm.reset()
})

const addNewToy = e => {
  let newToy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  createToy(newToy);
};

const createToy = toy => {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(toy)
  })
    .then(resp => resp.json())
    .then(showToy(toy));
};

// call the initialize function at the end of the page- when the page loads
// make the fetch request and start the js

initialize()