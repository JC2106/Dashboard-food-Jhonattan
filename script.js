import { data } from './data.js'

const btnFilterAll = document.querySelector(".category-all");
const btnFilterBurguer = document.querySelector(".category-burguer");
const btnFilterPizza = document.querySelector(".category-pizza");
const btnFilterTaco = document.querySelector(".category-taco");
const btnFilterBatata = document.querySelector(".category-batata");
const btnFilterHotdog = document.querySelector(".category-hotdog");
let modal = document.getElementById("modal");
const fecharModal = document.getElementById("btn-modal");
const confirmarModal = document.getElementById("btn-modal-bottom");
let modalEdit = document.getElementById("modalEdit");
const fecharModalEdit = document.getElementById("btn-modal-edit");
const confirmarModalEdit = document.getElementById("btn-modal-edit-bottom");
const btnDellItemPedido = document.querySelector("#btn-modal-edit-dell");

productsList()    
atualizarDOMitens()

let order = JSON.parse(localStorage.getItem('order')) || { items: [], subtotal: 0.0, desconto: 0.0, acrescimo: 0.0, valorTotal: 0.0 };

buscarItensPedido()
atualizarDOMitensPedidos()

function atualizarDOMitens(){
  let productsDOM = document.querySelectorAll('[data-id]');    
  productsDOM.forEach(productIem => {
  productIem.addEventListener('click', function (event) {
    const ID = event.currentTarget.dataset.id

    const productClicked = data.find(function (product) {
      return Number(ID) === product.id
    })

    modal.style.display = "block";
    let itemImagem = document.getElementById("modal-img");  
    itemImagem.src = productClicked.image;  
    let itemNome = document.getElementsByClassName("modal-item-nome");
    itemNome[0].innerText = productClicked.name
    itemNome[1].innerText = productClicked.name
    let itemCategoria = document.getElementById("modal-item-categoria");
    itemCategoria.innerText = 'Categoria: ' + productClicked.category;
    let itemPreco = document.getElementById("modal-item-preco");
    let valor = productClicked.price.length > 0 ? productClicked.price[0] : productClicked.price
    itemPreco.innerText = 'Preço: R$' + valor.toLocaleString('pt-BR');
    let itemId = document.getElementById("modal-itemId");
    itemId.innerText = productClicked.id;  
    })
  })
}

function atualizarDOMitensPedidos(){
  let itensPedidosDOM = document.querySelectorAll('[data-index]');
  itensPedidosDOM.forEach(itemPedido => {
  itemPedido.addEventListener('click', function (event) {
    const index = event.currentTarget.dataset.index
    const itemPedidoClicked = order.items[index]
    
    modalEdit.style.display = "block";
    let itemImagem = document.getElementById("modal-edit-img");  
    itemImagem.src = itemPedidoClicked.image;  
    let itemNome = document.getElementById("modal-edit-item-nome");
    itemNome.innerText = itemPedidoClicked.name
    let itemCategoria = document.getElementById("modal-edit-item-categoria");
    itemCategoria.innerText = 'Categoria: ' + itemPedidoClicked.category;
    let itemPreco = document.getElementById("modal-edit-item-preco");
    let valor = itemPedidoClicked.price.length > 0 ? itemPedidoClicked.price[0] : itemPedidoClicked.price
    itemPreco.innerText = 'Preço: R$' + valor.toLocaleString('pt-BR');
    let itemId = document.getElementById("modal-edit-itemId");
    itemId.innerText = index;  
    let itemQuantidade = document.getElementById("item-quantidade");
    itemQuantidade.value = itemPedidoClicked.quantidade
    let itemAcrescimo = document.getElementById("item-acrescimo");
    itemAcrescimo.value = itemPedidoClicked.acrescimo  
    let itemDesconto = document.getElementById("item-desconto");
    itemDesconto.value = itemPedidoClicked.desconto 
    })
  })
}

btnFilterAll.onclick = () =>{
    productsList()
    atualizarDOMitens()
    atualizarDOMitensPedidos()
}

btnFilterBurguer.onclick = () =>{
    productsList('burger')
    atualizarDOMitens()
    atualizarDOMitensPedidos()
}

btnFilterPizza.onclick = () =>{
    productsList('pizza')
    atualizarDOMitens()
    atualizarDOMitensPedidos()
}

btnFilterTaco.onclick = () =>{
    productsList('taco')
    atualizarDOMitens()
    atualizarDOMitensPedidos()
}

btnFilterBatata.onclick = () =>{
    productsList('snack')
    atualizarDOMitens()
    atualizarDOMitensPedidos()
}

btnFilterHotdog.onclick = () =>{
    productsList('hotdog')
    atualizarDOMitens()
    atualizarDOMitensPedidos()
}

function createListItemProduct(item) {
    let valor = item.price.length > 0 ? item.price[0] : item.price
    valor = valor.toLocaleString('pt-BR');
  return `
    <li data-id="${item.id}" class="item-list">
      <a class="list-menu" href="#">
        <div class="list-img">
          <img src="${item.image}" alt="">
        </div>
        <span class="list-name">${item.name}</span>
        <span class="list-price">R$ ${valor}</span>
      </a>
    </li>
  `
}

function productsList(filter) {
  const cardapio = document.querySelector('.menu-list')
  let dataFilter = data
  let listProducts = []

  if(filter){
    dataFilter = dataFilter.filter(item => item.category === filter)
  }
  listProducts = dataFilter.reduce(function (accumulator, item) {
        accumulator += createListItemProduct(item)
        return accumulator
    }, '')

  cardapio.innerHTML = listProducts
}

function buscarItensPedido(){
    
    const orderDOM = document.querySelector('.order-list')
    const orderSubTotalDOM = document.querySelector('#order-subtotal')
    const orderAcrescimoDOM = document.querySelector('#order-acrescimo')
    const orderDescontoDOM = document.querySelector('#order-desconto')
    const orderTotalDOM = document.querySelector('#order-totalvalor')
    
    atualizarTotalizadores()
    
    orderDOM.innerHTML = construirItensLista();
    orderSubTotalDOM.innerText = 'R$' + order.subtotal.toLocaleString('pt-BR');
    orderAcrescimoDOM.innerText = 'R$' + order.acrescimo.toLocaleString('pt-BR');
    orderDescontoDOM.innerText = 'R$' + order.desconto.toLocaleString('pt-BR');
    orderTotalDOM.innerText = 'R$' + order.valorTotal.toLocaleString('pt-BR');
}

function construirItensLista(){
    const listProduct = order.items.reduce((accumulator, {id, name, price, image, quantidade}, index) => {
    let valorQuantidade = price.length > 0 ? price[0] : price
    valorQuantidade = '(R$' + valorQuantidade.toLocaleString('pt-BR') + ' x ' + quantidade + ')';
      return accumulator += `
         <li data-index="${index}" class="order-item">${id} - ${name} ${valorQuantidade}<div class="btn-item-edit"><img src="assets/icons/pencil.png" alt=""></div></li>
       `
     }, '')
    return listProduct
}

function atualizarTotalizadores(){
    order.subtotal = 0.0
    order.acrescimo = 0.0
    order.desconto = 0.0
    order.items.forEach(item => {
        order.subtotal += parseFloat(item.price) * parseFloat(item.quantidade);
        order.desconto += parseFloat(item.desconto);
        order.acrescimo += parseFloat(item.acrescimo)
    })
    order.valorTotal = (order.subtotal + parseFloat(order.acrescimo)) - order.desconto;
}

confirmarModal.onclick = function(){
    let itemId = document.getElementById("modal-itemId");
    let dataFilter = data.find(item => item.id == itemId.innerText)
    dataFilter.quantidade = 1;
    dataFilter.desconto = 0;
    dataFilter.acrescimo = 0;
    
    order.items.push(dataFilter)
    localStorage.setItem('order', JSON.stringify(order))
    
    buscarItensPedido()
    atualizarDOMitensPedidos()
    modal.style.display = "none";
}

confirmarModalEdit.onclick = function(){
    let itemIndex = document.getElementById("modal-edit-itemId");
    let itemEdit = order.items[itemIndex.innerText];

    const quantidade = parseFloat(document.getElementById("item-quantidade").value);
    const acrescimo = parseFloat(document.getElementById("item-acrescimo").value);
    const desconto = parseFloat(document.getElementById("item-desconto").value);
    
    itemEdit.quantidade = quantidade <= 0 ? 1 : quantidade;
    itemEdit.acrescimo = acrescimo <= 0 ? 0 : acrescimo;
    itemEdit.desconto = desconto <= 0 ? 0 : desconto;
    
    order.items[itemIndex] = itemEdit;
    localStorage.setItem('order', JSON.stringify(order))
    
    buscarItensPedido()
    atualizarDOMitensPedidos()
    modalEdit.style.display = "none";
}

btnDellItemPedido.onclick = function(){
     let itemIndex = document.getElementById("modal-edit-itemId");
     order.items.splice(itemIndex.innerText,1);
     localStorage.setItem('order', JSON.stringify(order))
     buscarItensPedido()
     atualizarDOMitensPedidos()
     modalEdit.style.display = "none";
}

fecharModal.onclick = function(){
     modal.style.display = "none";
}

fecharModalEdit.onclick = function(){
    modalEdit.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modalEdit) {
    modalEdit.style.display = "none";
  }    
}