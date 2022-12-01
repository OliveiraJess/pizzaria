pizzaJson.map((item, index) => {
  // console.log(pizza)

  let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true)

  // console.log(pizzaItem)

  document.querySelector(".pizza-area").append(pizzaItem)

  pizzaItem.querySelector(".pizza-item--img img").src = item.img
  pizzaItem.querySelector(".pizza-item--price").innerHTML = item.price
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
})
