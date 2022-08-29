///////////////// CAPTURA DE ELEMENTOS HTML - DOM /////////////////

let productsDOM = document.getElementsByClassName("products") // div que contiene la descripcion del producto
let addButtonDOM = document.getElementsByClassName("addButton") // Botones para añadir el producto al carrito

///////////////// INSTANCIADO Y CONSUMO DE DATOS /////////////////

// Carrito y array de productos creado a partir de base de datos JSON
let carrito = []
let productsArr = []

// Consumo de base de datos desde archivo JSON e instanciado del array productos
const fetchProducts = async () => {
    try {
        const res = await fetch('./data/products.json')
        const data = await res.json()
        for (i=0; i<data.length; i++){
            productsArr.push(data[i])
            productsDOM[i].children[1].textContent = productsArr[i].name
            productsDOM[i].children[2].textContent = `u$s` + productsArr[i].price
        }
    } catch (error) {
        console.log(error)
    }
}

fetchProducts()

///////////////// EVENTOS /////////////////

// Evento del boton "Add cart" 
for (button of addButtonDOM) {
    button.addEventListener("click", addCart)
}

// Evento del boton "Show cart"
$("#showCart").on("click", showCart)

// Evento del boton "Empty cart"
$("#removeCart").on("click", emptyCart)

// Creacion del contador del carrito en HTML
let counterHTML = document.createElement("h3")
counterHTML.innerHTML = " (" + carrito.length + ") "
$("#counter").append(counterHTML)


///////////////// API /////////////////

// Creacion de la seccion del clima con HTML dinamico y consumo de la API del clima + geolocalizacion
navigator.geolocation.getCurrentPosition(mostrarGeo)
function mostrarGeo(position){
    var lat = position.coords.latitude
    var long = position.coords.longitude
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather',
        type: 'GET',
        data: {
            lat: lat,
            lon: long,
            appid: 'f08969ce7afd98e3b62850ecee404a35',
            dataType: 'jsonp',
            units: 'metric'
        },
        success: function (data) {
            let icono = data.weather[0].icon
            let iconoURL = 'https://openweathermap.org/img/w/' + icono + ".png"
            $('#icono').attr("src", iconoURL)
            $('#weather').append(`<p>${data.name} - ${data.weather[0].main}  -  ${data.main.temp_max}º</p>`)
        }
    })
}

///////////////// FUNCIONES /////////////////

// Funcion que añade producto al carrito y ejecuta las demas funciones de actualizacion de datos
function addCart (e) {
    let targetId = e.target.id

    let itemInput = document.getElementsByClassName("itInput")

    for (i=0; i<carrito.length; i++){
        if (carrito[i].id === targetId) {
            let inputValue = itemInput[i]
            inputValue.value++
            carrito[i].quantity++
            cartTotal()
            return null;
        }
    }

    carrito.push(productsArr[targetId])
    renderCart(targetId)
    updateContent(targetId)
    animateBuy()
}

// Funcion que renderiza el carrito en una seccion HTML de manera dinamica
function renderCart(targetId) {
    let carritoHTML = document.createElement("li")
    carritoHTML.innerHTML = `<input type="counter" class="itInput" style="width: 20px; text-align: center;" value="${productsArr[targetId].quantity}">`+ " - " + productsArr[targetId].name + " - " + " u$s" + productsArr[targetId].price 
    $("#cart").append(carritoHTML)
    cartTotal()
}

// Funcion que suma el precio total de los productos del carrito
function cartTotal(){
    let total = 0;
    let itemCartTotal = document.getElementById("total")
    carrito.forEach((Product)=> {
        const precio = Product.price
        total = total + precio * Product.quantity
    })
    itemCartTotal.innerHTML = `TOTAL= u$s${total}`
    storageCart()
}

// Funcion que guarda el carrito en el storage
function storageCart(){
    sessionStorage.setItem("carrito", JSON.stringify(carrito))
}

// Funcion que carga y renderiza el carrito si existe en el storage cuando se hace refresh
window.onload = function(){
    let sStorage = JSON.parse(sessionStorage.getItem('carrito'));
    if (sStorage !== null){
        for (i=0; i<sStorage.length; i++){
            carrito.push(sStorage[i])
            let carritoHTML = document.createElement("li")
            carritoHTML.innerHTML = `<input type="counter" class="itemInput" style="width: 20px; text-align: center;" value="${sStorage[i].quantity}">`+ " - " + sStorage[i].name + " - " + " u$s" + sStorage[i].price 
            $("#cart").append(carritoHTML)
            cartTotal()
            updateContent()
        }
    }    
}

// Funcion que actualiza el contador del carrito
function updateContent () {
    counterHTML.innerHTML = " (" + carrito.length + ") "
}

// Funcion que lanza un alerta animado cada vez que un producto se agrega al carrito
function animateBuy () {
    $("#alert").fadeIn()
    .delay(1000)
    .fadeOut() 
}

// Funcion que muestra el carrito si es que tiene productos, quitando el display none que tiene por default
function showCart () {
    if (carrito.length == 0) {
        $("#noCart").fadeIn()
        .delay(1000)
        .fadeOut() 
    } else {
        $("#cart").slideDown()
    }
}

// Funcion que reinicia el contador, vacia el carrito, storage y el HTML creado
function emptyCart () {
    $("#cart").hide("slow")
    $("#cart").html('')
    for (i=0; i<carrito.length; i++){
        carrito[i].quantity = 1
    }
    carrito = []
    counterHTML.innerHTML = " (" + carrito.length + ") "
    let itemCartTotal = document.getElementById("total")
    itemCartTotal.innerHTML = `TOTAL= u$s0`
    sessionStorage.clear()
}