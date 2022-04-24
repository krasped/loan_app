import { Link, Outlet } from "react-router-dom";
import {Stack, Button, CssBaseline, AppBar, Toolbar, Container , Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";

export default function Layout() {
    const dispatch = useDispatch();
    // const isLoggedIn = true;
    const isLoggedIn = useSelector((state) => state.autorization.isLoggedIn);
    const email = useSelector((state) => state.autorization.userEmail);

    const addLoginDataToStore = () => {
        dispatch({ type: "AUTORIZATION_STATUS", payload: localStorage.getItem('isLogged') });
        dispatch({ type: "USER_ID", payload: localStorage.getItem('userId') });
        dispatch({ type: "USER_TOKEN", payload: localStorage.getItem('token') });
    }

    const logOut = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('isLogged');
            localStorage.removeItem('userId');
            addLoginDataToStore();
    }
    console.log("render layout")

    function renderButtons(isLoggedIn){
        if(isLoggedIn){
            return(
                <Box sx={{ flexGrow: 1 }}>
                    <Button variant="contained">
                    <Link to="users" color="white" style={{ textDecoration: 'none', color: "white" }}>
                        contacts
                    </Link>
                    </Button>
                    <Button variant="contained">
                        <Link to="loans" style={{ textDecoration: 'none', color: "white" }}>loans</Link>
                    </Button>
                    <Button variant="contained">
                        <Link to="add_loan" style={{ textDecoration: 'none', color: "white" }}>create loan</Link>
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
                            <Button variant="contained">
                                <Link to="login" style={{ textDecoration: 'none', color: "white" }}>Login</Link>
                            </Button>
                            {isLoggedIn?
                                <Button variant="contained" onClick={logOut}>
                                    Log out
                                </Button>:
                                null
                                }
                            
                        </Box>
                    </Stack>
                    </Box>
                    <Box sx={{ p: 1 ,ml: 'auto' }}>
                        {email?` email: ${email}`:null}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
    );
}
