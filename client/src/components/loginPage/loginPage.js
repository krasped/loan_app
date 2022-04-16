import React, { useState } from "react";
import { useDispatch } from 'react-redux';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Container,
} from "@mui/material";

import GotService from "../server";

const LoginPage = () => {
    const got = new GotService();
    const [open, setOpen] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [registrationLogin, setRegistrationLogin] = useState("");
    const [registrationFirstName, setRegistrationFirstName] = useState("");
    const [registrationPhone, setRegistrationPhone] = useState("");
    const [registrationPassword, setRegistrationPassword] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = (login, firstName, phone, password) => {
        got.postResource(
            "auth/register",
            { login, firstName, phone, password }    
        );
        setRegistrationLogin('');
        setRegistrationFirstName('');
        setRegistrationPhone('');
        setRegistrationPassword('');
        handleClose();
    };

    const handleChangeRegistrationLogin = (event) => {
        setRegistrationLogin(event.target.value);
    };

    const handleChangeRegistrationFirstName = (event) => {
        setRegistrationFirstName(event.target.value);
    };

    const handleChangeRegistrationPhone = (event) => {
        setRegistrationPhone(event.target.value);
    };

    const handleChangeRegistrationPassword = (event) => {
        setRegistrationPassword(event.target.value);
    };

    const handleChangeLoginLogin = (event) => {
        setLogin(event.target.value);
    };

    const handleChangeLoginPassword = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (login, password) => {
        const getTokenId = await got.postResource(
            "auth/login",
            { login, password } 
        );
        
        if (getTokenId.token !== undefined){
            localStorage.setItem('token', getTokenId.token);
            localStorage.setItem('isLogged', true);
            localStorage.setItem('userId', getTokenId.userId);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('isLogged');
            localStorage.removeItem('userId');
        }
        setLogin('');
        setPassword('');
    }

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                registration
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>create accaunt</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={handleChangeRegistrationLogin}
                        value={registrationLogin}
                        autoFocus
                        margin="dense"
                        label="Login"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={handleChangeRegistrationFirstName}
                        value={registrationFirstName}
                        autoFocus
                        margin="dense"
                        label="First name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={handleChangeRegistrationPhone}
                        value={registrationPhone}
                        autoFocus
                        margin="dense"
                        label="phone"
                        type="tel"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={handleChangeRegistrationPassword}
                        value={registrationPassword}
                        autoFocus
                        margin="dense"
                        label="password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            handleAdd(registrationLogin, registrationFirstName, registrationPhone, registrationPassword);
                        }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
            <Container maxWidth="sm">
                <TextField
                    onChange={handleChangeLoginLogin}
                    value={login}
                    autoFocus
                    margin="dense"
                    label="login"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    onChange={handleChangeLoginPassword}
                    value={password}
                    autoFocus
                    margin="dense"
                    label="password"
                    type="password"
                    fullWidth
                    variant="standard"
                />
                <Button
                    variant="outlined"
                    onClick={() => {
                        handleLogin(login, password);
                    }}
                >
                    Login
                </Button>
            </Container>
        </>
    );
};

export default LoginPage;
