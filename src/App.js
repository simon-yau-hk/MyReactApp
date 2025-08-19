import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import GoolgeLogin from './pages/GoolgeLogin';
import Landing from './pages/Landing';
import Version from './pages/Version';
//import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <BrowserRouter>
       <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/google-login" element={<GoolgeLogin />} />
          {/* Protected Route */}
          <Route
            path="/"
            element={
                <Landing />
            }
          />
          
          {/* Catch all other routes and redirect to root */}
          <Route path="/version" element={<Version />}  />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}  

export default App;
