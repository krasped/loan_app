import React, { useState, useEffect } from "react";
import {
    MenuItem,
    Stack,
    TextField,
    Box,
    FormControl,
    Select,
    InputLabel,
    Button,
    ButtonGroup,
    TableContainer,
    TableHead,
    TableRow,
    Table,
    Paper,
    TableCell,
    TableBody,
    IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import GotService from "../server";
import Spiner from "../spiner";
import { useTranslation } from 'react-i18next';


export default function UsersPage() {
    const got = new GotService();
    const { t } = useTranslation();

    const [table, setTable] = useState(null);
    const [loansTable, setLoansTable] = useState(null);

    const [usersData, setUsersData] = useState([]);
    const [loansByUserData, setLoansByUserData] = useState([]);

    const [selectedLogin, setSelectedLogin] = useState("");
    const [friends, setFriends] = useState([]);

    const [allOrFriends, setAllOrFriends] = useState(true); //true equel allUsers
    const [searchValue, setSearchValue] = useState("");
    const [loginPhoneName, setLoginPhoneName] = useState("login"); // login name phone

    const curentUserId = localStorage.getItem("userId");

    const isContact = (id) => {
        let isOk = false;
        friends.forEach((element) => {
            if (element._id === id) {
                isOk = true;
            }
        });
        return isOk;
    };

    const searchData = ( //midlware for drow table
        searchValue = "",
        loginPhoneName = "login",
        data,
    ) => {
        console.log(allOrFriends, searchValue, loginPhoneName, data);
        if (searchValue === "") {
            return data;
        }else {
            let result ;
            switch(loginPhoneName){
                case 'login':
                    result = data.filter((item) => {
                        let finalData = item['login'].toLowerCase();
                        return finalData.indexOf(searchValue.toLowerCase()) !== -1 
                    })
                    break;
                case 'phone':
                    result = data.filter((item) => {
                        let finalData = item['phone'] + '';
                        return finalData.indexOf(searchValue +'') !== -1; 
                    })
                    break;
                case 'firstName':
                    result = data.filter((item) => {
                        let finalData = item['firstName'].toLowerCase();
                        return finalData.indexOf(searchValue.toLowerCase()) !== -1 
                    })
                    break;
                default: return data;
            }
            return result;
        }

        
    };

    const updateDataFromDb = async function (url, res, obj) {
        let dbPromise;
        console.log(url, obj);
        if (!obj) {
            dbPromise = await got.getResource(url);
        } else {
            dbPromise = await got.postResource(url, obj);
        }
        switch (res) {
            case "loans":
                setLoansByUserData(dbPromise[res]);
                break;
            case "contacts":
                setFriends(dbPromise["users"][res]);
                break;
            case "users":
                setUsersData(dbPromise[res]);
                break;
            default:
                console.log(t("usersPage.somethingGoesWrong"));
        }
    };

    const renderTable = (data) => {
        if (!data) return;
        return data.map((row) => (
            <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleChangeSelectedLogin(row.login)}
                    >
                        {selectedLogin === row.login ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>

                <TableCell component="th" scope="row" align="center">
                    {row.login}
                </TableCell>
                <TableCell align="center">{row.firstName}</TableCell>
                <TableCell align="center">{row.phone}</TableCell>
                <TableCell align="right">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleAddOrRemoveContact(row._id)}
                    >
                        {isContact(row._id) ? (
                            <PersonRemoveAlt1Icon />
                        ) : (
                            <PersonAddAlt1Icon />
                        )}
                    </IconButton>
                </TableCell>
            </TableRow>
        ));
    };

    const renderLoansTable = (data) => {
        if (!data) return;
        return data.map((row) => (
            <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {row.login}
                </TableCell>
                <TableCell align="center">{row.howMach}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
            </TableRow>
        ));
    };

    const handleChangeLoginPhoneName = (e) => {
        setLoginPhoneName(e.target.value);
    };

    const handleAddOrRemoveContact = async (_id) => {
        let url = isContact(_id) ? "users/removeContact" : "users/addContact";
        console.log(_id);
        let result = await got.postResource(url, {
            _id: curentUserId,
            contactId: _id,
        });
        console.log(result);
        updateDataFromDb("users/contacts", "contacts", { _id: curentUserId });
    };

    const handleChangeSelectedLogin = (login) => {
        setSelectedLogin(login);
    };
    const handleCangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    // useEffect(() => {
    //     searchData(allOrFriends, searchValue, loginPhoneName, usersData);
    // }, [allOrFriends, searchValue, loginPhoneName]);

    useEffect(() => {
        allOrFriends
            ? updateDataFromDb("users/all", "users")
            : updateDataFromDb("users/contacts", "contacts", {
                  _id: curentUserId,
              });
        // updateUser("loans/all", "loans");
    }, [allOrFriends, searchValue, loginPhoneName]);

    useEffect(() => {
        setLoansTable(renderLoansTable(loansByUserData));
        setTable(allOrFriends ? renderTable(searchData(searchValue, loginPhoneName, usersData)) : renderTable(searchData(searchValue,loginPhoneName, friends)));
    }, [loansByUserData, usersData, friends]);

    useEffect(() => {
        updateDataFromDb("users/loans", "loans", { login: selectedLogin }); //строчка для плоучения нужного займа
    }, [selectedLogin]);

    return (
        <>
            {!table ? <Spiner /> : null}

            <Stack spacing={2} direction="row" alignItems="center">
                <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                >
                    <Button onClick={() => setAllOrFriends(false)}>
                        {t("usersPage.myContacts")}
                    </Button>
                    <Button onClick={() => setAllOrFriends(true)}>
                        {t("usersPage.allUsers")}
                    </Button>
                </ButtonGroup>
                <Box>
                    <TextField
                        value={searchValue}
                        onChange={handleCangeSearchValue}
                        label={t("usersPage.search...")}
                        className="search"
                        margin="normal"
                    />
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="demo-simple-select-label">
                            {t("usersPage.lookFor")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={loginPhoneName}
                            label={t("usersPage.lookFor")}
                            onChange={handleChangeLoginPhoneName}
                        >
                            <MenuItem value={"login"}>{t("usersPage.login")}</MenuItem>
                            <MenuItem value={"phone"}>{t("usersPage.phone")}</MenuItem>
                            <MenuItem value={"firstName"}>{t("usersPage.firstName")}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Stack>
            <Stack spacing={2} direction="row" alignItems="center">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"></TableCell>
                                <TableCell align="center">{t("usersPage.login")}</TableCell>
                                <TableCell align="center">{t("usersPage.firstName")}</TableCell>
                                <TableCell align="center">{t("usersPage.phone")}</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{table}</TableBody>
                    </Table>
                </TableContainer>

                <TableContainer component={Paper}>
                    {t("usersPage.loansOfUser")}: {selectedLogin}
                    <Table sx={{ minWidth: 200 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("usersPage.login")}</TableCell>
                                <TableCell align="center">{t("usersPage.howMach")}</TableCell>
                                <TableCell align="center">
                                    {t("usersPage.dateOfCreation")}
                                </TableCell>
                                <TableCell align="right">{t("usersPage.reason")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{loansTable ? loansTable : null}</TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    );
}
