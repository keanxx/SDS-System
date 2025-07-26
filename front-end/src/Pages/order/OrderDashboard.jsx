import React from 'react'
import OrderTable from '../../Components/order_components/OrderTable'
import Header from '../../Components/Header';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderDashboard = () => {
    const navigate = useNavigate();

     const navLinks = [
    { label: 'Dashboard', path: '/' },
    
  ];


  return (
    <div className="w-full h-screen flex flex-col  bg-white">
      
       <AppBar position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1e293b' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
           Order List
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
          
        </Toolbar>
      </AppBar>

      {/* <div className="w-full ">
        <Header
        
          icon={<img src="/depEdCNLogo.png" alt="logo" className="w-12 h-12 object-contain " />}
          text="Order | List"
          navLinks={navLinks}
        />
      </div> */}
      
      <div className="w-full max-h-full bg-white shadow-lg rounded-lg  overflow-y-auto items-center justify-center p-4 flex">
        <OrderTable />
      </div>
    </div>
  )
}

export default OrderDashboard