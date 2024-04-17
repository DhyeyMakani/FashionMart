import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import insta_icon from '../Assets/instagram_icon.png'
import pint_icon from '../Assets/pintester_icon.png'
import whats_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" srcset="" />
            <p>DetailingClothes</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={insta_icon} alt="" srcset="" />
                <img src={pint_icon} alt="" srcset="" />
                <img src={whats_icon} alt="" srcset="" />
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2023 - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer
