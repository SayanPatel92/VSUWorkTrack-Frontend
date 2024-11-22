import './App.css';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';
import DashboardLayout from './pages/Dashboard';
import StudentEmpList from './pages/components/studentEmpList';
import Inbox from './pages/components/Inbox';
import Search from './pages/components/Search';
import InputModal from './pages/components/InputModal';
import EmployementDataModal from './pages/components/EmployementDataModal';
import StudentDashboard from './pages/StudentDashboard'
import StudentDataDisplay from './pages/components/StudentProfile';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';



function App() {

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/faculty' element={
            <DashboardLayout />
          }>
            <Route exact path='' element={<StudentEmpList />} />
            <Route path='search' element={<Search />} />
            <Route path='inbox' element={<Inbox />} />
          </Route>

          <Route path='/student' element={
            <StudentDashboard />
          }>
            <Route path='input-modal' element={<InputModal />} />
            <Route exact path='' element={<StudentDataDisplay />} />
            <Route path='employment-modal' element={<EmployementDataModal />} />
          </Route>

          <Route exact path='/' element={<LoginPage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='admin' element={<AdminPage />} />
          <Route path='signup' element={<SignUpPage />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password/:id' element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;

