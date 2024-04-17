import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

    {/*Logic for doing this : here we will map the product data that will get from the api  */}
    const [allproducts,setAllProducts]=useState([]);

    // using this func. we can fetch the data from api and save the data in this state var.
    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts').then((res)=>res.json()).then((data)=>{setAllProducts(data)});
    }

    // now we need to run this func.
    useEffect(()=>{
        fetchInfo();
    },[])   // because of this [] the func. will executed for only once

    // to make cross_icon functional
    const remove_product=async (id)=>{
        await fetch('http://localhost:4000/removeproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:id})
        })

        // after that, when the prod. is deleted we call the fetchInfo func. again to update the list
        await fetchInfo();
    }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {/* here we will map the product data that will get from the api  */}
        {allproducts.map((product,index)=>{
            // create a template where we map all the products
            return <>
                    <div key={index} className="listproduct-format-main listproduct-format">
                        <img src={product.image} alt="" className="listproduct-product-icon" />
                        <p>{product.name}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <p>{product.category}</p>
                        <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
                    </div>
                    <hr />
                  </>
        })}
      </div>
    </div>
  )
}

export default ListProduct
