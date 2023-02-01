
const productDOM = document.querySelector('#products')
const OpenCart = document.querySelector('.nav_shopcart')
const overlay = document.querySelector('.shop_overlay')
const shopDom = document.querySelector('.shopcart')
const closeCart = document.querySelector('.shopcart_close')
const cartCenter = document.querySelector('.viewcenter')
const itemsPopup = document.querySelector('.popupItems')
const removeCart = document.querySelector('.removeCart')
const totalitems = document.querySelector('.total_items')
const allproductView = document.getElementById('details')


let shopcart = []
let buttonDOM = []


class mainUI {
    renderproducts(productList) {
        let uishow = ""
        productList.forEach((element) => {
            uishow += `
                <div class="produflex">
          <div class="prod">
            <div class="produimage">
                <a href="productDetails.html?id=${element.id}">
                    <img
                    src="${element.image}"
                    alt="${element.alt}">
                </a>
            </div>
            <div class="produfooter">
              <h1>${element.product}</h1>
            </div>
            <div class="price">
            ${element.price}€
            </div>
            <div class="bt ">
                <a href="productDetails.html?id=${element.id}" class="btn btn-primary">details</a>
                <button data-id="${element.id}" class="btn btn-primary addcar">add to shop list</button>
            </div>
          </div>
        </div>`
        });
        productDOM.innerHTML = uishow
    }

    buttons() {
        const buttons = [...document.querySelectorAll('.addcar')];
        buttonDOM = buttons;
        buttons.forEach((button) => {
            const id = button.dataset.id;
            const incar = shopcart.find(item => item.id === parseInt(id, 10));
            if (incar) {
                button.innerHTML = "added check out!"
                button.disabled = true
                
            }
            button.addEventListener("click", event => {
                event.preventDefault();
                event.target.innerHTML = "added check out!"
                event.target.disabled = true
                
                

                const shopItem = { ...Storage.getProduct(id), quantity: 1 }

                shopcart = [...shopcart, shopItem]

                Storage.autoSave(shopcart)

                this.setItemValues(shopcart)
                this.addShopcarItem(shopItem)
            })
        })
    }





    addShopcarItem({ id, product, price, image, alt, quantity }) {
        const div = document.createElement('div');
        div.classList.add('view_item')

        div.innerHTML = `
        <div>
            <img
              src="${image}"
              alt="${alt}">
              
            
          </div>
          <div class="description">
          <h3>${product}</h3>
          <p class="pri">${price}€</p>

          </div>
          <div class="updown">
            <span class="increase" data-id="${id}">
              <i class="fa-solid fa-caret-up"></i>
            </span>
            <p class="itemQuantity">${quantity}</p>
            <span class="decrease" data-id="${id}">
              <i class="fa-solid fa-caret-down"></i>
            </span>
          </div>
          <div>
            <span class="eliminate" data-id="${id}">
                <i class="fa-regular fa-trash-can"></i>
            </span>
          </div>`

        cartCenter.appendChild(div)
        
    }
    setItemValues(shopcart) {
        let Total = 0;
        let items = 0;
        shopcart.map(item => {
            Total += item.price * item.quantity;
            items += item.quantity;

        });
        totalitems.innerText = parseFloat(Total.toFixed(2));
        itemsPopup.innerText = items
    }
    show() {
        shopDom.classList.add('show')
        overlay.classList.add('show')
    }
    hide() {
        shopDom.classList.remove('show')
        overlay.classList.remove('show')
    }
    setAPP() {
        shopcart = Storage.getcart()
        this.setItemValues(shopcart)
        this.populate(shopcart)

        OpenCart.addEventListener("click", this.show)
        closeCart.addEventListener("click", this.hide)
    }
    populate(shopcart) {
        shopcart.forEach(element => this.addShopcarItem(element))
    }
    allcartfunction() {
        removeCart.addEventListener("click", () => {
            this.removeShopcart()
            this.hide()
        })

        cartCenter.addEventListener("click", re => {
            const target = re.target.closest("span")
            const targetElement = target.classList.contains("eliminate")
            console.log(target);
            console.log(targetElement)

            if (!target) return
            if (targetElement) {
                const id = parseInt(target.dataset.id)
                this.removeItem(id)
                cartCenter.removeChild(target.parentElement.parentElement)
            }
            else if (target.classList.contains("increase")) {
                const id = parseInt(target.dataset.id, 10)
                let item = shopcart.find(element => element.id === id)
                item.quantity++;
                Storage.autoSave(shopcart)
                this.setItemValues(shopcart)
                target.nextElementSibling.innerText = item.quantity


            }
            else if (target.classList.contains("decrease")) {
                const id = parseInt(target.dataset.id, 10)
                let item = shopcart.find(element => element.id === id)
                item.quantity--

                if (item.quantity > 0) {
                    Storage.autoSave(shopcart)
                    this.setItemValues(shopcart)
                    target.previousElementSibling.innerText = item.quantity
                }
                else {
                    this.removeItem(id);
                    cartCenter.removeChild(target.parentElement.parentElement)
                }
            }

        })
    }
    removeShopcart() {
        const cartitems = shopcart.map(element => element.id)
        cartitems.forEach(id => this.removeItem(id))

        while (cartCenter.children.length > 0) {
            cartCenter.removeChild(cartCenter.children[0])

        }
    }

    removeItem(id) {
        shopcart = shopcart.filter(element => element.id !== id);
        this.setItemValues(shopcart);
        Storage.autoSave(shopcart)

        let button = this.singleButton(id);
        if (button) {
            button.disabled = false;
            button.innerText = "add to shop list";
        }
    }

    singleButton(id) {
        return buttonDOM.find(button => parseInt(button.dataset.id) == id)
    }

    productdetails(id) {
        const product = filtred.filter(item => item.id == id)
        let result = "";
        product.forEach(product => {
            result += `
            <div class="Vimg_product col-xl-6">
      <img
        src=${product.image}
        alt="${product.alt}">
    </div>
    <div class="description col-xl-6">
      <div class="title">
        <h1>${product.product}</h1>
      </div>
      <div class="price">
        ${product.price}€
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum ullam voluptas est repellendus numquam ad,
        neque,
        temporibus sequi saepe architecto commodi inventore voluptate quia earum accusamus corporis ab atque quaerat?
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae cum alias enim ipsum architecto aut et
        placeat omnis! Non id ad ex ratione beatae explicabo asperiores tempore voluptatibus eius facere. Lorem ipsum
        dolor sit amet consectetur adipisicing elit. Sint at quam, soluta ipsam fugit hic odio quidem aut autem numquam
        quasi eaque iure non sit alias voluptatem minima ducimus animi.</p>
      <div class="adshopcar">
      <button href="" data-id="${product.id}" class="btn btn-primary addcar">add to shop list</button>
      </div>
    </div>`
        });
        allproductView.innerHTML = result;
    }

}

// filter items function

let defaul = "";
let spi = "";
let sweet = "";
let soda = "";
let health = "";
let bread = "";


let filtred = [];


function defaulttype() {
    const ui = new mainUI();
    defaul = document.getElementById("all").value;
    ui.renderproducts(filtred)
    ui.buttons()
}

function filterspy() {
    const ui = new mainUI();
    spi = document.getElementById("spi").value;
    if (spi.length > 0) {
        const filt = filtred.filter(value => value.type === spi);
        console.log(filt)
        ui.renderproducts(filt)
        ui.buttons()
    }
}

function filtersweet() {
    const ui = new mainUI();
    sweet = document.getElementById("sweet").value;
    if (sweet.length > 0) {
        const filt = filtred.filter(value => value.type === sweet);
        console.log(filt)
        ui.renderproducts(filt)
        ui.buttons()
    }
}

function filtersoda() {
    const ui = new mainUI();
    soda = document.getElementById("soda").value;
    if (soda.length > 0) {
        const filt = filtred.filter(value => value.type === soda);
        console.log(filt)
        ui.renderproducts(filt)
        ui.buttons()
    }
}

function filterhealth() {
    const ui = new mainUI();
    health = document.getElementById("health").value;
    if (health.length > 0) {
        const filt = filtred.filter(value => value.type === health);
        console.log(filt)
        ui.renderproducts(filt)
        ui.buttons()
    }
}

function filterbread() {
    const ui = new mainUI();
    bread = document.getElementById("bread").value;
    if (bread.length > 0) {
        const filt = filtred.filter(value => value.type === bread);
        console.log(filt)
        ui.renderproducts(filt)
        ui.buttons()
    }
}



class Storage {
    static saveProduct(obj) {
        localStorage.setItem("products", JSON.stringify(obj))

    }
    static autoSave(data) {
        localStorage.setItem("shopcart", JSON.stringify(data))
    }
    static getProduct(id) {
        const product = JSON.parse(localStorage.getItem("products"));
        return product.find(product => product.id === parseFloat(id, 10))
    }
    static getcart() {
        return localStorage.getItem("shopcart") ? JSON.parse(localStorage.getItem("shopcart")) : [];
    }
}



class Products {
    async getProducts() {
        try {
            const result = await fetch("products.json");
            const data = await result.json();
            const products = data.allproducts
            
            return products

        }
        catch (err) {
            console.log(err);
        }
    }
}
const query = new URLSearchParams(window.location.search)
let id = query.get('id')


document.addEventListener("DOMContentLoaded", async () => {
    const productList = new Products();
    const ui = new mainUI();

    ui.setAPP();

    filtred = await productList.getProducts();
    if (id) {
        ui.productdetails(id)
        Storage.saveProduct(filtred);
        ui.buttons();
        ui.allcartfunction();
    }
    else {
    ui.renderproducts(filtred);
    Storage.saveProduct(filtred);
    ui.buttons();
    ui.allcartfunction();
    }

})




