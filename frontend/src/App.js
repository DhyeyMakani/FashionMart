import './App.css';
import Navbar from './Components/Navbar/Navbar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Shop from './Pages/Shop';
import Footer from './Components/Footer/Footer';

import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import { useState,useContext } from 'react';
import { ContextProvider } from './ContextProvider.jsx';

function App() {

  const [loggedInUserName, setLoggedInUserName] = useState('');
  
  return (
    <div>
        <ContextProvider value={{loggedInUserName, setLoggedInUserName}} name="loginInfo">
        <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="Women"/>}/>
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
          <Route path='product' element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSignup/>}/>
        </Routes>
        <Footer/>
        </BrowserRouter>
        </ContextProvider>
    </div>
  );
}

export default App;