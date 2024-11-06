import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MatriculaForm from './components/MatriculaForm';


function App() {
   const isAuthenticated = !!localStorage.getItem('token');

   return (
       <Router>
           <Routes>
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/matricula" element={isAuthenticated ? <MatriculaForm /> : <Navigate to="/login" />} />
               <Route path="*" element={<Navigate to="/login" />} />
           </Routes>
       </Router>
   );
}

export default App;