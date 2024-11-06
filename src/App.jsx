import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Login from './components/Login';
import Register from './components/Register';
import MatriculaForm from './components/MatriculaForm';
import StripePayment from './components/StripePayment';

const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');

function App() {
   const isAuthenticated = !!localStorage.getItem('token');

   return (
       <Router>
           <Routes>
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/matricula" element={isAuthenticated ? <MatriculaForm /> : <Navigate to="/login" />} />
               <Route
                   path="/pago"
                   element={
                       isAuthenticated ? (
                           <Elements stripe={stripePromise}>
                               <StripePayment />
                           </Elements>
                       ) : (
                           <Navigate to="/login" />
                       )
                   }
               />
               <Route path="*" element={<Navigate to="/login" />} />
           </Routes>
       </Router>
   );
}

export default App;
