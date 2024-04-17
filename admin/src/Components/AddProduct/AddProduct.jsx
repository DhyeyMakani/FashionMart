import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    // logic for, if i upload any image in that upload field that img will be displayed on that upload field
    const [image, setImage]=useState(false);
    
    const imageHandler=(e)=>{
        setImage(e.target.files[0]);
    }
    
    // make a function to store data in database if i click on add button
    const [productDetails, setProductDetails] = useState({
        name:"",
        image:"",
        category:"Women",
        new_price:"",
        old_price:""
    })
    const changeHandler=(e)=>{
        setProductDetails({...productDetails, [e.target.name]:e.target.value})
    }

    // craete a func. for add button
    const Add_Product = async ()=>{
        // console.log(productDetails);

        // now link the Add_Product function with the backend
        let responseData;
        let product= productDetails;

        let formData= new FormData();
        formData.append('product',image);   // it will append image with productDetails

        // now send the formData to our api
        await fetch('http://localhost:4000/upload',{
            method: 'POST',
            headers: {
                Accept : 'application/json',
            },
            body: formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data})  // first resp.json will parse the response and then that data will be saved in responseData variable

        if(responseData.success){   // if responseData.success is true then our img is stored in the multer
            product.image = responseData.image_url;
            console.log(product);

            // now we can send this product in addproduct endpoint
            await fetch('http://localhost:4000/addproduct',{
                method: 'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product added successfully"):alert("Failed!!!")
            })
        }
    }


  return (
    <div className='add-product'>
      {/* whenever addproduct icon was clicked this text box will be visible */}
      <div className="addproduct-itemfield">    
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>

      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add</button>
    </div>
  )
}

export default AddProduct
