let addToy = false;
const cardList = [];

function Card(id, image, likes, name) {
  this.div = document.createElement("h4");
  this.div.className = "card"
  this.h2 = document.createElement("h2");
  this.h2.textContent = name;
  this.img = document.createElement("img");
  this.img.src = image;
  this.img.className = "toy-avatar";
  this.likes = likes;
  this.p = document.createElement("p");
  this.p.textContent = `${likes} Likes`;
  this.button = document.createElement("button");
  this.button.className = "like-btn";
  this.button.id = id;
  this.button.textContent = "Like ❤️";
  this.addCard = function(location = document.querySelector("#toy-collection")) {
    this.div.append(this.h2,this.img,this.p,this.button);
    location.append(this.div);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit",event =>{
    event.preventDefault();
    fetch("http://localhost:3000/toys",{
      method: "POST",
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": `${toyForm.name.value}`,
        "image": `${toyForm.image.value}`,
        "likes": 0
    })
    })
    .then(response => response.json())
    .then(toy => {
      const i =cardList.push(new Card(toy.id,toy.image,toy.likes,toy.name));
      cardList[i-1].addCard();
    })
    .catch(error => console.log(error))
    toyForm.name.value = '';
    toyForm.image.value = '';
  });

  const toyCollection  = document.querySelector("#toy-collection");
  toyCollection.addEventListener("click",event => {
    if(event.target.className="like-btn"){
      const id = event.target.id;
      const card = cardList.find(element => element.button === event.target);
      const newLikes = card.likes+1;

      fetch(`http://localhost:3000/toys/${id}`,{
      method: "PATCH",
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },

      body: JSON.stringify({
        "likes": newLikes
      })
    })
    .then(response => response.json())
    .then(update => {
      card.likes = update.likes;
      card.p.textContent = `${update.likes} Likes`;
    })
    .catch(error => console.log(error))
    }
  })


  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => {
    toys.forEach((element, i) => {
      cardList.push(new Card(element.id,element.image,element.likes,element.name));
      cardList[i].addCard();
    });
  })
  .catch(error => console.log(error))
});
