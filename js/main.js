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

pizzaJson.map((item, index) => {

  let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
  seleciona('.pizza-area').append(pizzaItem);

  preencheDadosDasPizzas(pizzaItem, item, index);

  pizzaItem.querySelector('.pizza-item a').addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Clicou na pizza');

    let chave = pegarKey(event)

    abrirModal();

    preencheDadosModal(item);

    preencherTamanhos(chave);

    seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;

    escolherTamanhoPreco(chave);

  })

  botoesFechar();

})

mudarQuantidade();
