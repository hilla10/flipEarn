import {
  Home,
  ListingDetails,
  Loading,
  ManageListing,
  Marketplace,
  Messages,
  MyListings,
  MyOrders,
} from '@pages';
import React from 'react';
import { Route, Routes,useLocation } from 'react-router-dom';
import {ChatBox, Navbar} from '@components';

const App = () => {

  const {pathname} = useLocation();


  return (
    <div>
      {!pathname.includes('/admin') && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/marketplace' element={<Marketplace />} />
        <Route path='/my-listings' element={<MyListings />} />
        <Route path='/listing/:listingId' element={<ListingDetails />} />
        <Route path='/create-listing' element={<ManageListing />} />
        <Route path='/edit-listing/:id' element={<ManageListing />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/loading' element={<Loading />} />
      </Routes>

      <ChatBox/>
    </div>
  );
};

export default App;
