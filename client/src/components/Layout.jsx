import React from 'react';
import {Outlet} from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

const Layout = ({children}) => {
  return (
    <>
    <Header/>
        <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout
