const productsDOM = document.querySelector('.imgContainer');
const searchBar = document.getElementById('searchBar');

let cart = []
const cartOverlay = document.querySelector('.cart-overlay');
const cartIcon = document.querySelector('.cartIcon');
const bookInCart = document.querySelector('.bookInCart') //number of cart items
const closeCartBtn =document.querySelector('.close-cart');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const clearCartBtn = document.querySelector('.clearBtn');
const userOverlay = document.querySelector('.userMenu-overlay');
const userIcon = document.querySelector('.userIcon');
const closeUserBtn = document.querySelector('.user-close-cart');
//check point==================================================


class Products{
    async getProducts(){
        try {
            let result = await fetch('products.json');
            
            let data = await result.json();
            
            let products = data.items;
           
            products = products.map(item =>{
                const {title, price} = item.fields;
                //const id = item.sys.id;
                const {id} = item.sys;
                const image =item.fields.image.fields.file.url;
                return {title, price, id, image}

            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }

}

class UI{
   
   displayMain(){
       let products = JSON.parse(localStorage.getItem('products'));
       products.forEach(item =>{
             //console.log(item)
           const article = document.createElement('article'); //in HTML, <article>  </article>
           article.classList.add('product');   //in HTML, <article class="product"> </article>
           article.innerHTML = `
           <div class="img-container">
           <img src=${item.image} alt="" class="product-img" height=400>
           <button class= "cartBtn" data-id=${item.id}>
               <i class="fa-solid fa-basket-shopping"></i>
               Add to Cart
           </button>
           </div>
           <h3>${item.title}</h3>
           <h4>$${item.price}</h4>`;
           productsDOM.appendChild(article);

       });
       
   }


 showCart(){
     cartOverlay.classList.add('cartVisiblity');
   }

 hideCart(){
     cartOverlay.classList.remove('cartVisiblity');
   }
 showUser(){
     userOverlay.classList.add('userVisiblity');
   }

 hideUser(){
     userOverlay.classList.remove('userVisiblity');
  }
 getBagButtons(){
     const btns = document.querySelectorAll('.cartBtn'); //button on each book
     btns.forEach(element =>{  //element is a variable for EACH BUTTON, everything in the cart
        //console.log(element)
        let id = element.dataset.id;
        let inCart = cart.find(item => item.id === id); // inCart  contains everything in the element 
        if(inCart){
          element.innerText ="Added to Cart"; //if the book is alrady in cart change innertext to added to cart
          element.disabled = true; // if the book is alrady in cart disable
        }
        element.addEventListener('click', (event)=>{  //we cant add event listener for earch button so we crate event lisstener inside for loop
          event.target.innerText = "Added to Cart";
          event.target.disabled = true;
          let cartItem = {...Storage.getProduct(id), amount: 1};  // cartItem  is everything in the localstorage plus a new key value pair of amount 
         
          cart = [...cart, cartItem]; //...cart means everything we had in cart
          Storage.saveCart(cart);
          this.setCartValues(cart); 
          this.addBook(cartItem)
        })
     })
   }  


  

/// add a one book with everything with key value pair (id image titel price amount)
 addBook(item){
  
     const div = document.createElement('div');
   
     div.classList.add("cart-item");
     div.innerHTML = `
                    <div>
                    <i class="fa-sharp fa-solid fa-square-plus"></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fa-sharp fa-solid fa-square-minus"></i>
                    </div>
                    <img src=${item.image}>
                    <div class = "cartbookheadding">
                    <h4>${item.title}</h4>
                    <h4>$${item.price}</h4> 
                    <span class="remove-item" data-id =${item.id}>Remove</span 
                    </div>
                    
     `;
     cartContent.appendChild(div);
   }
// cart is array of all the books
   setCartValues(cart){
     // for each book calcuate temptotal and itemsTotl 
     let tempTotal = 0;
     let itemsTotal =0;
     cart.forEach(item =>{
       tempTotal += item.price* item.amount;
       itemsTotal += item.amount;
     
     })
     cartTotal.innerText = parseFloat(tempTotal.toFixed(2)); //convert tempTotal to two decimal place(parsFloat)
      
     bookInCart.innerText = itemsTotal;
   }

 removeItem(id){
     cart = cart.filter(item => item.id !== id);
     this.setCartValues(cart);
     Storage.saveCart(cart);
     let button = this.getSingleBtn(id);
     button.disabled = false;
     button.innerHTML =`<i class="fa-solid fa-basket-shopping"></i>
               Add to Cart`;
   }
// get each button by id 
   getSingleBtn(id){
     const btns = document.querySelectorAll('.cartBtn');
     let button;
     btns.forEach(element =>{
       if(element.dataset.id === id){
         button = element;
       }
     });
     return button;
   }
// cart show and hide event 
   setupApp(){
     cart = Storage.getCart();
     this.setCartValues(cart);
     cart.forEach(item => this.addBook(item));
     cartIcon.addEventListener('click', () =>{ 
            //console.log(cartIcon)
     this.showCart()
   });
     closeCartBtn.addEventListener('click', this.hideCart);
   }
UserProfile(){
     
     userIcon.addEventListener('click', () =>{ 
           console.log(userIcon)
     this.showUser()
   });
     closeUserBtn.addEventListener('click', this.hideUser);
   }

   cartLogic(){
     const btns = document.querySelectorAll('.cartBtn');
     //console.log(btns)
     clearCartBtn.addEventListener('click', ()=>{
       cart =[];
       Storage.saveCart(cart);
       this.setCartValues(cart);
       btns.forEach(element =>{
         element.innerHTML = `<i class="fa-solid fa-basket-shopping"></i>
               Add to Cart`;
         element.disabled = false;
       }); 
       while(cartContent.children.length > 0){
         
         cartContent.removeChild(cartContent.children[0]);
       }
     });

     cartContent.addEventListener('click', (event)=>{
      console.log(event);
       if(event.target.classList.contains('remove-item')){
         let removeItem = event.target;
         let id = removeItem.dataset.id;
         this.removeItem(id);
         cartContent.removeChild(removeItem.parentElement.parentElement);
       }
       if(event.target.classList.contains('fa-square-plus')){
         let addAmount = event.target;
         
         let id = addAmount.dataset.id;
         
         let tempItem = cart.find(item => item.id === id);
          
         tempItem.amount ++;
         console.log(item.amount)
         Storage.saveCart(cart);
         this.setCartValues(cart);
         addAmount.nextElementSibling.innerText = tempItem.amount;
       }

       if(event.target.classList.contains('fa-square-minus')){
         let subAmount = event.target;
         let id = subAmount.dataset.id;
         let tempItem = cart.find(item => item.id === id);
         tempItem.amount --;
         if(tempItem.amount > 0){
          Storage.saveCart(cart);
           this.setCartValues(cart);
           subAmount.previousElementSibling.innerText = tempItem.amount;
         }else{
           cartContent.removeChild(subAmount.parentElement.parentElement);
           this.removeItem(id);
         }
       }


     });
   }

}

class Storage{ 
    static saveProducts(products){
      //JSON.stringify() method converts a JavaScript object or value to a JSON string
      //the key is "products"
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){ 
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find( product=> product.id === id);
    }

    static saveCart(cart){
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart(){
      return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [];
    }

}






  

document.addEventListener("DOMContentLoaded", ()=>{ //everything starts here
    const ui = new UI();
    const products = new Products();
    //setup the APP
    
    products.getProducts().then(products => Storage.saveProducts(products)); 
    //console.log(localStorage.getItem('products'));
    ui.displayMain();//display products should be set here
    ui.setupApp();
    ui.getBagButtons();  
    ui.cartLogic();
    ui.UserProfile();
    

})

function displayBooks(books){
  console.log(books)
  
 // const ui = new UI();
 
  while(productsDOM.firstChild){
        productsDOM.removeChild(productsDOM.firstChild);
    } 

    
     books.forEach(item =>{
           
const article = document.createElement('article'); //in HTML, <article>  </article>
           article.classList.add('product');   //in HTML, <article class="product"> </article>
           article.innerHTML = `
           <div class="img-container">
           <img src=${item.image} alt="" class="product-img" height=400>
           <button class= "cartBtn" data-id=${item.id}>
               <i class="fa-solid fa-basket-shopping"></i>
               Add to Cart
           </button>
           </div>
           <h3>${item.title}</h3>
           <h4>$${item.price}</h4>`;
           productsDOM.appendChild(article);

       });

       const btns = document.querySelectorAll('.cartBtn');
        btns.forEach(element =>{
          //console.log(element)
        let id = element.dataset.id;
        let inCart = cart.find(item => item.id === id); // inCart  contains everything in the element 
        if(inCart){
          element.innerText ="Add to Cart"; //if the book is alrady in cart change innertext to added to cart
          element.disabled = false; // if the book is alrady in cart disable
        }
       element.addEventListener('click', (event)=>{  //we cant add event listener for earch button so we crate event lisstener inside for loop
          event.target.innerText = "Added to Cart";
          event.target.disabled = true;
       });

       
      });
           
     

}


searchBar.addEventListener("keyup", function(event){
    console.log(event)
   
    if(event.key === "Enter"){
        var searchString = event.target.value;
        console.log(searchString)
        cart = JSON.parse(localStorage.getItem('products'));
       const filteredBooks = cart.filter(function(book){
        return book.title.includes(searchString) || book.price <= searchString
       })
       console.log(filteredBooks);
       displayBooks(filteredBooks);
       
    }
  
})


 /*
  const btns = document.querySelectorAll('.cartBtn');
        btns.forEach(element =>{
          //console.log(element)
        let id = element.dataset.id;
        let inCart = cart.find(item => item.id === id); // inCart  contains everything in the element 
        if(inCart){
          element.innerText ="Add to Cart"; //if the book is alrady in cart change innertext to added to cart
          element.disabled = false; // if the book is alrady in cart disable
        }
       
        })
     
    
   */

