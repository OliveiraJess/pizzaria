let modalKey = 0;

let quantPizzas = 1;

let cart = [];

const seleciona = (elemento) => document.querySelector(elemento);
const selecionaTodos = (elemento) => document.querySelectorAll(elemento);

const formatoReal = (valor) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

const formatoMonetario = (valor) => {
  if (valor) {
    return valor.toFixed(2)
  }
}

const abrirModal = () => {
  seleciona('.pizzaWindowArea').style.opacity = 0;
  seleciona('.pizzaWindowArea').style.display = 'flex';
  setTimeout(() => seleciona('.pizzaWindowArea').style.opacity = 1, 150);
}

const fecharModal = () => {
  seleciona('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => seleciona('.pizzaWindowArea').style.display = 'none', 500);
}

const botoesFechar = () => {
  selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => item.addEventListener('click', fecharModal));
}

const preencheDadosDasPizzas = (pizzaItem, item, index) => {
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price[2]);
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
}

const preencheDadosModal = (item) => {
  seleciona('.pizzaBig img').src = item.img;
  seleciona('.pizzaInfo h1').innerHTML = item.name;
  seleciona('.pizzaInfo--desc').innerHTML = item.description;
  seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[2]);
}

const pegarKey = (event) => {
  let key = event.target.closest('.pizza-item').getAttribute('data-key');
  console.log('Pizza clicada ' + key);
  console.log(pizzaJson[key]);

  quantPizzas = 1;

  modalKey = key;

  return key;
}

const preencherTamanhos = (key) => {
  seleciona('.pizzaInfo--size.selected').classList.remove('selected');

  selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
    (sizeIndex == 2) ? size.classList.add('selected'): '';
    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
  })
}

const escolherTamanhoPreco = (key) => {
  selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
      seleciona('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');

      seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex]);
    })
  })
}

const mudarQuantidade = () => {
  seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
    quantPizzas++
    seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
  });

  seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (quantPizzas > 1) {
      quantPizzas--
      seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
    }
  });
}

const adicionarNoCarrinho = () => {
  seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
    console.log('Adicionar no carrinho');
    console.log("Pizza " + modalKey);

    let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key');
    console.log("Tamanho " + size);

    console.log("Quant. " + quantPizzas);

    let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '');
    let identificador = pizzaJson[modalKey].id + 't' + size;
    let key = cart.findIndex((item) => item.identificador == identificador);

    console.log(key);

    if (key > -1) {
      cart[key].qt += quantPizzas;
    } else {
      let pizza = {
        identificador,
        id: pizzaJson[modalKey].id,
        size,
        qt: quantPizzas,
        price: parseFloat(price)
      }

      cart.push(pizza);
      console.log(pizza);
      console.log('Sub total R$ ' + (pizza.qt * pizza.price).toFixed(2));
    }

    fecharModal();
    abrirCarrinho();
    atualizarCarrinho();
  })
}

const abrirCarrinho = () => {
  console.log('Qtd de itens no carrinho ' + cart.length);

  if (cart.length > 0) {
    seleciona('aside').classList.add('show');
    seleciona('header').style.display = 'flex';
  }

  seleciona('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
      seleciona('aside').classList.add('show');
      seleciona('aside').style.left = '0';
    }
  })
}

const fecharCarrinho = () => {
  seleciona('.menu-closer').addEventListener('click', () => {
    seleciona('aside').style.left = '100vw';
    seleciona('header').style.display = 'flex';
  })
}

const atualizarCarrinho = () => {
  seleciona('.menu-openner span').innerHTML = cart.length;

  if (cart.length > 0) {
    seleciona('aside').classList.add('show');
    seleciona('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      console.log(pizzaItem);

      subtotal += cart[i].price * cart[i].qt;

      let cartItem = seleciona('.models .cart--item').cloneNode(true);

      seleciona('.cart').append(cartItem);

      let pizzaSizeName = cart[i].size;
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        console.log('Clicou no botão mais')

        cart[i].qt++
        atualizarCarrinho();
      });

      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        console.log('Clicou no botão menos');
        if (cart[i].qt > 1) {
          cart[i].qt--
        } else {
          cart.splice(i, 1);
        }

        (cart.length < 1) ? seleciona('header').style.display = 'flex': '';

        atualizarCarrinho();
      })

      seleciona('.cart').append(cartItem);
    }

    desconto = subtotal * 0;
    total = subtotal - desconto;

    seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
    seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto);
    seleciona('.total span:last-child').innerHTML = formatoReal(total);

  } else {
    seleciona('aside').classList.remove('show');
    seleciona('aside').style.left = '100vw';
  }
}

const finalizarCompra = () => {
  seleciona('.cart--finalizar').addEventListener('click', () => {
    console.log('Finalizar compra');
    seleciona('aside').classList.remove('show');
    seleciona('aside').style.left = '100vw';
    seleciona('header').style.display = 'flex';
  });
}

pizzaJson.map((item, index) => {

  let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
  seleciona('.pizza-area').append(pizzaItem);

  preencheDadosDasPizzas(pizzaItem, item, index);

  pizzaItem.querySelector('.pizza-item a').addEventListener('click', (event) => {
    event.preventDefault();

    console.log('Clicou na pizza');

    let chave = pegarKey(event);

    abrirModal();
    preencheDadosModal(item);
    preencherTamanhos(chave);
    seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;
    escolherTamanhoPreco(chave);

  })

  botoesFechar();

})

mudarQuantidade();
adicionarNoCarrinho();
atualizarCarrinho();
fecharCarrinho();
finalizarCompra();
