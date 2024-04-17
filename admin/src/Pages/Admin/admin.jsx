import React from 'react'
import './Admin.css'
import { Routes,Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import Sidebar from '../../Components/Sidebar/Sidebar'

const Admin = () => {
  return (
    <div>
        <div className='admin'>
            <Sidebar/>
            <Routes>
                <Route path='/addproduct' element={<AddProduct/>} />
                <Route path='/listproduct' element={<ListProduct/>} />
            </Routes>
        </div>
    </div>
  )
}

export default Admin