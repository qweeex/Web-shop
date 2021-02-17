let Cart = {
    Add(elem) {
        let dataset = elem.target.dataset;
        let Product = {
            id: parseInt(dataset.id),
            count: parseInt(dataset.count),
            name: dataset.title,
            img: dataset.img,
            price: dataset.price
        }
        if (localStorage.cart){
            let StorageCart = JSON.parse(localStorage.cart);
            if (StorageCart.length > 1){
                StorageCart.forEach((item) => {
                    console.log(item)
                    if (item.id === Product.id){
                        item.count++;
                        localStorage.setItem('cart', JSON.stringify(StorageCart));
                        alert('Add to cart');
                    } else {
                        StorageCart.push(Product);
                        localStorage.setItem('cart', JSON.stringify(StorageCart));
                        alert('Add to cart');
                    }
                })
            } else {
                if (StorageCart.id === Product.id){
                    StorageCart.count++
                    localStorage.setItem('cart', JSON.stringify(StorageCart));
                    alert('Add to cart');
                } else {
                    let Store = [];
                    Store.push(StorageCart);
                    Store.push(Product)
                    localStorage.setItem('cart', JSON.stringify(Store));
                    alert('Add to cart');
                }
            }
        } else {
            localStorage.setItem('cart', JSON.stringify(Product));
            alert('Add to cart');
        }
    },
    CheckCart(){
        let CartElem = $('#cart');

        if (CartElem.length > 0){

            let CartStore = JSON.parse(localStorage.cart);

            if (CartStore !== null && CartStore !== undefined){
                $.ajax({
                    type: "POST",
                    url: "/checkout/cart",
                    // The key needs to match your method's input parameter (case-sensitive).
                    data: JSON.stringify(CartStore),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        let product = data;
                        let html = '';
                        product.forEach((item) =>{
                            html += `
                         <ul class="cart-header" id="product_${item.id}">
                            <div class="close1" data-product="${item.id}"> </div>
                            <li class="ring-in">
                            <a href="${item.product_url}" >
                                <img src="${item.product_image}" class="img-responsive" alt="">
                            </a>
                            </li>
                            <li><span class="name">${item.product_name}</span></li>
                            <li><span class="cost">$ ${item.product_price}</span></li>
                            <p>Delivered in 2-3 business days</p></li>
                            <div class="clearfix"> </div>
                        </ul>
                         `;
                        })
                        $('#cart').html(html);
                    },
                    error: function(errMsg) {
                        alert(errMsg);
                    }
                });
            }

        }
    },
    SendOrder(){
        $('.order-send').on('submit', (e) => {
            let form = $('.order-send');
            e.preventDefault();
            let Inputs = form.find('input[type="text"]');
            let InputData = [];

            for (let i = 0; i < Inputs.length; i++){
                let name = Inputs[i].name,
                    value = Inputs[i].value;
                InputData.push({
                    key: name,
                    val: value
                })
            }
            let Cart = JSON.parse(localStorage.cart);
            let data = {
                profile: InputData,
                cart: Cart
            }

            $.ajax({
                type: "POST",
                url: "/checkout",
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    if (data.status === true){
                        localStorage.removeItem('cart');
                        alert('Ваш Заказ оформлен');
                        location.reload();
                    }
                },
                error: function(errMsg) {
                    alert(errMsg);
                }
            });
        })
    },
    Init(){
        $('.add-product').on('click', (e) => {
            e.preventDefault();
            this.Add(e)
        });
        this.CheckCart();
        this.SendOrder();
    }
}

Cart.Init();