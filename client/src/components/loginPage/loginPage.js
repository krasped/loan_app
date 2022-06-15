import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Container,
    DialogContentText
} from "@mui/material";

import GotService from "../server";

const LoginPage = () => {
    const { enqueueSnackbar } = useSnackbar(); //for message to user
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const got = new GotService();
    const [open, setOpen] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [openQuestion, setOpenQuestion] = useState(false);
    const [isUserAgree, setIsUserAgree] = useState(true);


    const [registrationLogin, setRegistrationLogin] = useState("");
    const [registrationFirstName, setRegistrationFirstName] = useState("");
    const [registrationPhone, setRegistrationPhone] = useState("");
    const [registrationPassword, setRegistrationPassword] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickOpenQuestion = () => {
        setOpenQuestion(true);
      };

    const handleCloseQuestion = (isAgree = false) => {
        setIsUserAgree(isAgree);
        setOpenQuestion(false);
        afterUserConfirm(registrationLogin,
            registrationFirstName,
            registrationPhone,
            registrationPassword,)
    };

    const getGhostLoginArr = async () => {
        let result = await got.getResource("auth/ghosts");
        return result.ghosts.map((item) => item.login);
    };

    const getUsersKeyArr = async (key) => {
        let result = await got.getResource(`auth/all/login`);
        console.log(result);
        return result.users.map((item) => item[key]);
    }

    const handleClose = () => {
        setRegistrationLogin("");
        setRegistrationFirstName("");
        setRegistrationPhone(0);
        setRegistrationPassword(""); 
        setOpen(false);
    };
/////разобраться с валидацией
    const isValidData = async(login, firstName, phone, password) => {
        // console.log((login.length > 0) && (usersArr.indexOf(login) !== -1) && (phone.length > 0) && (!isNaN(phone)) && (password.length >= 6));

        
          let usersArr = await getUsersKeyArr('login');
          let phoneArr = await getUsersKeyArr('phone');
          console.log(usersArr, phoneArr);
        
        if((login.length > 0) && (usersArr.indexOf(login) === -1) && (phoneArr.indexOf(phone) === -1) && !!phone && (!isNaN(phone)) && (password.length >= 6)){
            console.log(1)
           return true; 
        }else if((usersArr.indexOf(login) !== -1) || (phoneArr.indexOf(phone) !== -1)){
            enqueueSnackbar(t("loginPage.alreadyExists"), {
                variant: "warning",
            });
            return false
        }else{
            console.log(1);
            enqueueSnackbar(t("loginPage.invalidData"), {
                variant: "warning",
            });
            return false
        }
    
    };
    
    const afterUserConfirm = async (login, firstName, phone, password) => {
        let responce;
        try{
            if (isUserAgree) {
                responce = await got.postResource("auth/register", {
                    login,
                    firstName,
                    phone,
                    password,
                });
                if (!responce) {
                    throw new Error();
                } else {
                    enqueueSnackbar(t("loginPage.userCreated"), {
                        variant: "success",
                    });
                    handleClose();
                }
            } else {
                enqueueSnackbar(
                    t("loginPage.changeLogin"),
                    {
                        variant: "warning",
                    },
                );
            }
        }
        catch(e){
            enqueueSnackbar(
                t("loginPage.serverError"),
                {
                    variant: "error",
                },
            );  
        }
            
    }

    const handleAdd = async (login, firstName, phone, password) => {
        if (await isValidData(login, firstName, +phone, password)) {
            try {
                let ghostsArr = await getGhostLoginArr();
                if (ghostsArr.indexOf(login) !== -1) {
                    handleClickOpenQuestion();
                }
                else{setIsUserAgree(true); afterUserConfirm(login, firstName, phone, password)}
            } catch (e) {
                console.log(e);
                enqueueSnackbar(
                    t("loginPage.serverError"),
                    {
                        variant: "error",
                    },
                );
            }
 
        } else {
            console.log(1)
            enqueueSnackbar(t("loginPage.invalid"), {
                variant: "warning",
            });
        }
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

    const addLoginDataToStore = () => {
        dispatch({
            type: "AUTORIZATION_STATUS",
            payload: localStorage.getItem("isLogged"),
        });
        dispatch({ type: "USER_ID", payload: localStorage.getItem("userId") });
        dispatch({
            type: "USER_TOKEN",
            payload: localStorage.getItem("token"),
        });
    };

    const handleLogin = async (login, password) => {
        const getTokenId = await got.postResource("auth/login", {
            login,
            password,
        });

        if (getTokenId.token !== undefined) {
            localStorage.setItem("token", getTokenId.token);
            localStorage.setItem("isLogged", true);
            localStorage.setItem("userId", getTokenId.userId);
            localStorage.setItem("login", getTokenId.login);
            // return <Navigate to="/login" replace />
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("isLogged");
            localStorage.removeItem("userId");
            localStorage.removeItem("login");
        }

        addLoginDataToStore();
        setLogin("");
        setPassword("");
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {t("loginPage.registration")}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t("loginPage.feedInformation")}</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={handleChangeRegistrationLogin}
                        value={registrationLogin}
                        autoFocus
                        margin="dense"
                        label={t("loginPage.login")}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={handleChangeRegistrationFirstName}
                        value={registrationFirstName}
                        margin="dense"
                        label={t("loginPage.firstName")}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={handleChangeRegistrationPhone}
                        value={registrationPhone}
                        margin="dense"
                        label={t("loginPage.phone")}
                        type="tel"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={handleChangeRegistrationPassword}
                        value={registrationPassword}
                        margin="dense"
                        label={t("loginPage.password")}
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        {t("loginPage.cancel")}
                    </Button>
                    <Button
                        onClick={() => {
                            handleAdd(
                                registrationLogin,
                                registrationFirstName,
                                registrationPhone,
                                registrationPassword,
                            );
                        }}
                    >
                        {t("loginPage.createAccaunt")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openQuestion}
                onClose={handleCloseQuestion}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t("loginPage.ghost")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("loginPage.isItYou")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseQuestion(false)}>{t("loginPage.cancel")}</Button>
                    <Button onClick={() => handleCloseQuestion(true)} autoFocus>
                        {t("loginPage.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Container maxWidth="sm">
                <TextField
                    onChange={handleChangeLoginLogin}
                    value={login}
                    autoFocus
                    margin="dense"
                    label={t("loginPage.login")}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    onChange={handleChangeLoginPassword}
                    value={password}
                    margin="dense"
                    label={t("loginPage.password")}
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
                    <Link
                        to="/"
                        color="white"
                        style={{ textDecoration: "none", color: "blue" }}
                    >
                        {t("loginPage.logIn")}
                    </Link>
                </Button>
            </Container>
        </>
    );
};

export default LoginPage;
