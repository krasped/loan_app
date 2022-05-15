import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Navigate, Routes, Route, useLocation} from "react-router-dom";
import Layout from "../layout";
import UsersPage from "../usersPage";
import PublicPage from "../publicPage";
import LoginPage from "../loginPage";
import AddLoanPage from "../addLoanPage";
import LoansPage from "../loansPage";



function App() {
    let newIslog = useSelector((state) => state.autorization.isLoggedIn);
    let isLoggedIn = localStorage.getItem('isLogged') ? localStorage.getItem('isLogged'): newIslog;

    function RequireAuth({ children }) {
        let location = useLocation();
        if (!isLoggedIn) {
          return <Navigate to="/login" state={{ from: location }} replace />;
        } else {
          return children;
        }
      }

    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/users" element={
                        <RequireAuth>
                            <UsersPage />
                        </RequireAuth>
                        
                    }/>
                    <Route path="/loans" element={
                        <RequireAuth>
                            <LoansPage />
                        </RequireAuth>
                        
                    } />
                    <Route path="/add_loan" element={
                        <RequireAuth>
                            <AddLoanPage />
                        </RequireAuth>
                    } />
                    <Route path="/" element={
                        null
                    } />
                    <Route path="*" element={
                        <RequireAuth>
                            <PublicPage />
                        </RequireAuth>
                        
                    } />
                    
                    
                    
                      
                </Route>
            </Routes>
        </>
    );
}

export default App;
