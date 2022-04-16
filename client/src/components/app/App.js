import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Navigate, Routes, Route} from "react-router-dom";
import Layout from "../layout";
import UsersPage from "../usersPage";
import PublicPage from "../publicPage";
import LoginPage from "../loginPage";
import AddLoanPage from "../addLoanPage";
import LoansPage from "../loansPage";



function App() {
//   const dispatch = useDispatch();
//     const isLoggedIn = useSelector((state) => state.autorization.isLoggedIn);

//     function isLogined (children) { 
//       if(!localStorage.getItem('isLogged')){
//           return <Navigate to='/login' replace />;
//       } else return children;
//   }
    
//     useEffect(() => {
//         dispatch({ 
//         type: "USER_EMAIL", 
//         payload: (localStorage.getItem('email'))?localStorage.getItem('email'): false });
//     });
//     console.log('hello');

    // const useRouts = (isAuthentificated) => {
    //     if (isAuthentificated){
    //         return
    //     }

    //     return(

    //     )
    // }
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/loans" element={<LoansPage />} />
                    <Route path="/add_loan" element={<AddLoanPage />} />
                    <Route path="*" element={<PublicPage />} />  
                </Route>
            </Routes>
        </>
    );
}

export default App;
