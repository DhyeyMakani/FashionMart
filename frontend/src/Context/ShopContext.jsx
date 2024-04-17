import React, { createContext, useEffect, useState } from "react";
// import all_product from '../Components/Assets/all_product';

export const ShopContext = createContext(null);
const BACKEND = process.env.REACT_APP_BACKEND;

const getDefaultCart = ()=>{
    let cart={};
    for(let index=0;index<400+1;index++)
    {
        cart[index]=0;
    }
    return cart;
}

const ShopContextProvider = (props) =>{

    const [all_product, setAll_Product]= useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());

    // console.log(cartItems);

    // now we will fetch our all product data that will stored in all_product state var.
    useEffect(()=>{
        fetch(`${BACKEND}/allproducts`)
        .then((response)=>response.json()).then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch(`${BACKEND}/getcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            })
            .then((response)=>response.json()).then((data)=>setCartItems(data));
        }
    },[])   // here useeffect will be loaded once when the component is mounted
    
    const addToCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));

        if(localStorage.getItem('auth-token')){
            fetch(`${BACKEND}/addtocart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    
    const removeFromCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token'))
        {
            fetch(`${BACKEND}/removefromcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const i in cartItems)
        {
            if(cartItems[i]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(i));
                totalAmount+=(itemInfo.new_price*cartItems[i]);
            }
        }
        return totalAmount;
    }

    const getTotalCartItems=()=>{
        let totalItem=0;
        for(const i in cartItems){
            if(cartItems[i]>0)
            {
                totalItem+=cartItems[i];
            }
        }
        return totalItem;
    }
    
    const contextValue = {getTotalCartItems, getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;