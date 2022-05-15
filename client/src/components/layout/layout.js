import { Link, Outlet } from "react-router-dom";
import {Stack, Button, CssBaseline, AppBar, Toolbar, Container , Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import LanguageBtn from '../LanguageBtn';

export default function Layout() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.autorization.isLoggedIn);
    const { t } = useTranslation();
    const addLoginDataToStore = () => {
        dispatch({ type: "AUTORIZATION_STATUS", payload: localStorage.getItem('isLogged') });
        dispatch({ type: "USER_ID", payload: localStorage.getItem('userId') });
        dispatch({ type: "USER_TOKEN", payload: localStorage.getItem('token') });
    }

    const logOut = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('isLogged');
            localStorage.removeItem('userId');
            localStorage.removeItem('login');

            addLoginDataToStore();
    }

    function renderButtons(isLoggedIn){
        if(isLoggedIn){
            return(
                <Box sx={{ flexGrow: 1 }}>
                    <Button variant="contained">
                    <Link to="users" color="white" style={{ textDecoration: 'none', color: "white" }}>
                        {t("layout.contacts")}  
                    </Link>
                    </Button>
                    <Button variant="contained">
                        <Link to="loans" style={{ textDecoration: 'none', color: "white" }}>
                            {t("layout.loans")}
                        </Link>
                    </Button>
                    <Button variant="contained">
                        <Link to="add_loan" style={{ textDecoration: 'none', color: "white" }}>
                            {t("layout.createLoan")}
                        </Link>
                    </Button>
                </Box>
            )
        } else return null;
    }

    useEffect(() => {addLoginDataToStore()},[]);
    return (
        <>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar >
                    <Box sx={{flexGrow: 1, ml: 2 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                    >
                        {renderButtons(isLoggedIn)}
                        <Box
                            sx={{ mr: 'auto' }}
                        >
                            {!isLoggedIn?
                                <Button variant="contained">
                                    <Link to="login" style={{ textDecoration: 'none', color: "white" }}>
                                        {t("layout.login")}
                                    </Link>
                                </Button>:
                                <Button variant="contained" onClick={logOut}>
                                    {t("layout.logOut")}
                                </Button>
                            }
                            
                        </Box>
                    </Stack>
                    </Box>
                    <Box sx={{ p: 1 ,ml: 'auto' }}>
                        {localStorage.getItem('login') ? ` ${t("layout.hello")}  ${localStorage.getItem('login')}` : null}
                            <LanguageBtn/>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
    );
}
