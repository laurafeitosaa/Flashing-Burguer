const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const paymentModal = document.getElementById("payment-modal");
const closePaymentModalBtn = document.getElementById("close-payment-modal-btn");
const paymentForm = document.getElementById("payment-form");
const paymentMethod = document.getElementById("payment-method");
const cardFields = document.getElementById("card-fields");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() { 
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none";
});

menu.addEventListener("click", function(event){
  let parentButton = event.target.closest(".add-to-cart-btn");

  if(parentButton){
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Função para adicionar no carrinho
function addToCart(name, price){
  const existingItem = cart.find(item => item.name === name);

  if(existingItem){
    // Se o item já existe, aumenta apenas a quantidade + 1 
    existingItem.quantity += 1;
  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

// Atualiza o carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];
    
    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){
  const isOpen = checkRestaurantOpen();
  if(!isOpen){
    Toastify({
      text: "Ops! O restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  cartModal.style.display = "none";
  paymentModal.style.display = "flex";
});

// Fechar o modal de pagamento
closePaymentModalBtn.addEventListener("click", function() {
  paymentModal.style.display = "none";
});

paymentMethod.addEventListener("change", function(event) {
  const method = event.target.value;
  if (method === "credit" || method === "debit") {
    cardFields.classList.remove("hidden");
    pixFields.classList.add("hidden");
  }
});

paymentForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const method = paymentMethod.value;
  if (method === "credit" || method === "debit") {
    const cardNumber = document.getElementById("cardNumber").value;
    const cvv = document.getElementById("cvv").value;
    const expirationMonth = document.getElementById("expirationMonth").value;
    const expirationYear = document.getElementById("expirationYear").value;
    simulateCardPayment(cardNumber, cvv, expirationMonth, expirationYear);
  } else if (method === "pix") {
    simulatePixPayment();
  }
});

function simulateCardPayment(cardNumber, cvv, expirationMonth, expirationYear) {
  // Simulação de processamento de pagamento com cartão
  console.log("Dados do cartão:", {
    cardNumber: cardNumber,
    cvv: cvv,
    expirationMonth: expirationMonth,
    expirationYear: expirationYear
  });
  alert("Pagamento com cartão simulado com sucesso!");
  clearCart();
  paymentModal.style.display = "none";
}

function simulatePixPayment() {
  // Simulação de processamento de pagamento com PIX
  alert("Pagamento com PIX simulado com sucesso!");
  clearCart();
  paymentModal.style.display = "none";
}

// Função para limpar o carrinho
function clearCart() {
  cart = [];
  updateCartModal();
}

// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23; 
  // true = restaurante está aberto 
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
}else{
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}

// script.js
document.addEventListener("DOMContentLoaded", function() {
  const whatsappFloatBtn = document.getElementById("whatsapp-float-btn");
  whatsappFloatBtn.addEventListener("click", function() {
    const message = "Olá, gostaria de tirar uma dúvida.";
    const phone = "83998500210"; // Substitua pelo número de telefone desejado
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  });

  whatsappFloatBtn.addEventListener("keydown", function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      whatsappFloatBtn.click();
    }
  });
});

