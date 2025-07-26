import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './Pages/LogIn';
import Travels from './Pages/Travels';
import AdminDashboard from './admin/travel/CreateTravel';
import Dashboard from './Pages/Dashboard';
import Statistics from './Pages/Statistics';
import MainDashboard from './Pages/MainDashboard';
import AppointmentDashboard from './Pages/appointment/AppointmentDashboard';
import CreateAppointment from './admin/appointment/CreateAppointment';
import EditAppointment from './admin/appointment/EditAppointment';
import AppointmentStatistics from './Pages/appointment/AppointmentStatistics';
import AppointmentDetails from './Pages/appointment/AppointmentDashboard';
import CreateTravel from './admin/travel/CreateTravel';
import MainDashboardAdmin from './admin/MainDashboardAdmin';
import EditTravel from './admin/travel/EditTravel';
import CreateOrder from './admin/order_admin/CreateOrder';
import OrderDashboard from './Pages/order/OrderDashboard';
import EditOrder from './admin/order_admin/EditOrder';

const App = () => {
  return (
    <Router>
     
        <Routes>
          <Route path="/travelsDashboard" element={<Dashboard/>} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/travels" element={<Travels/>} />

        {/*admin travel */}
          <Route path="/createTravel" element={<CreateTravel/>} />
          <Route path="/editTravel" element={<EditTravel/>} />
          <Route path="/" element={<MainDashboard/>} />
        
        {/*SDS appointment system*/}
        <Route path="/appointmentDetails" element={<AppointmentDetails/>} />
        <Route path="/appointmentStatistics" element={<AppointmentStatistics/>} />

          {/*SDS appointment system*/}
          <Route path="/orderDashboard" element={<OrderDashboard />} />
          <Route path="/editOrder" element={<EditOrder />} />

         {/*admin appointment system*/}
          <Route path="/createAppointment" element={<CreateAppointment />} />
          <Route path="/editAppointment" element={<EditAppointment />} />

          <Route path="/admin" element={<MainDashboardAdmin />} />
          
          {/*admin appointment system*/}
          <Route path="/createOrder" element={<CreateOrder/>} />
        </Routes>

    </Router>
  );
};

export default App;