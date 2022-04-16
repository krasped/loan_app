import { Link, Outlet } from "react-router-dom";
import {Stack, Button, CssBaseline, AppBar, Toolbar, Container , Box } from "@mui/material";
import { useSelector } from 'react-redux';

export default function Layout() {

    const isLoggedIn = true;
    // useSelector((state) => state.autorization.isLoggedIn);
    const email = useSelector((state) => state.autorization.userEmail);

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
                            <Button variant="contained">
                                Log out
                            </Button>
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
