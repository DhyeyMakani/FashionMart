import React, { useState, useContext } from 'react'
import './CartItems.css'
import { ShopContext, getDefaultCart } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Invoice = () => {

  const {getTotalCartAmount, all_product, cartItems, setCartItems, removeFromCart}=useContext(ShopContext);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Invoice', 10, 10);
    
    var cart = []
    all_product.forEach(item => {
        if(cartItems[item.id] > 0) {
            console.log(item);
            cart.push(item)
        }
    });

    // Add cart data to the PDF
    doc.autoTable({
      head: [['Product', 'Price', 'Quantity', 'Total']],
      body: cart?.map(item => [
                                        item.name, 
                                        item.new_price, 
                                        cartItems[item.id], 
                                        item.new_price * cartItems[item.id]
                                    ]),
    });
    
    doc.text('Cart Total', 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['Subtotal', 'Shipping Charge', 'Total']],
        body: [[getTotalCartAmount(), 0, getTotalCartAmount()]],
      });

    setCartItems(getDefaultCart());
    doc.save('invoice.pdf');
  };

  return (
    <div>
      <h2>Invoice</h2>
      <button onClick={generatePDF} >Check Out</button>
    </div>
  );
};

const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItems, removeFromCart}=useContext(ShopContext);

    const [cartData, setCartData] = useState([
        { name: 'Product 1', price: 10, quantity: 2, total: 20 },
        { name: 'Product 2', price: 15, quantity: 1, total: 15 },
      ]);

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>

      <hr />

        {all_product.map((e) => {
            if (cartItems[e.id] > 0) {
                return (
                    <div key={e.id}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className='carticon-product-icon' />
                            <p className='p1'>{e.name}</p>
                            <p className='p2'>${e.new_price}</p>
                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                            <p className='p3'>${e.new_price * cartItems[e.id]}</p>
                            <img src={remove_icon} className='cartitems-remove-icon' onClick={() => { removeFromCart(e.id) }} alt="" />
                        </div>
                        <hr />
                    </div>
                );
            }
            return null; // Added to satisfy the map function
        })}
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Cart Total</h1>

                <div>
                    <div className="cartitems-total-items">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>

                    <hr />

                    <div className="cartitems-total-items">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>

                    <hr />

                    <div className="cartitems-total-items">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                </div>

                {/* <button>PROCEED TO CHECKOUT</button> */}
                <Invoice />
            </div>

            <div className="cartitems-promocode">
                <p>If you have a promo code, Enter it here</p>
                
                <div className="cartitems-promobox">
                    <input type="text" placeholder='Promo code'/>
                    <button>Submit</button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default CartItems