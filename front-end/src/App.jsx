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
import Footer from './Components/Footer'; // make sure path is correct
import CreateEmployee from './admin/employee/CreateEmployees';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/travelsDashboard" element={<Dashboard />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/travels" element={<Travels />} />

            {/* admin travel */}
            <Route path="/createTravel" element={<CreateTravel />} />
            <Route path="/editTravel" element={<EditTravel />} />
            <Route path="/" element={<MainDashboard />} />

            {/* SDS appointment system */}
            <Route path="/appointmentDetails" element={<AppointmentDetails />} />
            <Route path="/appointmentStatistics" element={<AppointmentStatistics />} />

            {/* SDS order system */}
            <Route path="/orderDashboard" element={<OrderDashboard />} />
            <Route path="/editOrder" element={<EditOrder />} />

            {/* admin appointment system */}
            <Route path="/createAppointment" element={<CreateAppointment />} />
            <Route path="/editAppointment" element={<EditAppointment />} />

            {/* admin main dashboard */}
            <Route path="/admin" element={<MainDashboardAdmin />} />

            {/* admin order system */}
            <Route path="/createOrder" element={<CreateOrder />} />
            <Route path="/employees" element={<CreateEmployee />} />
          </Routes>
        </main>
        <Footer className="fixed bottom-0 left-0 right-0" />
      </div>
    </Router>
  );
};  

export default App;
