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

export default function UsersPage() {
    const got = new GotService();

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

    const searchData = (
        allOrFriends,
        searchValue = "",
        loginPhoneName = "login",
        data,
    ) => {
        console.log(allOrFriends, searchValue, loginPhoneName);
        if (searchValue === "") {
            return;
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
                console.log("что то пошло не так");
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

    useEffect(() => {
        searchData(allOrFriends, searchValue, loginPhoneName, usersData);
    }, [allOrFriends, searchValue, loginPhoneName]);

    useEffect(() => {
        allOrFriends
            ? updateDataFromDb("users/all", "users")
            : updateDataFromDb("users/contacts", "contacts", {
                  _id: curentUserId,
              });
        // updateUser("loans/all", "loans");
    }, [allOrFriends]);

    useEffect(() => {
        setLoansTable(renderLoansTable(loansByUserData));
        setTable(allOrFriends ? renderTable(usersData) : renderTable(friends));
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
                        My contacts
                    </Button>
                    <Button onClick={() => setAllOrFriends(true)}>
                        All users
                    </Button>
                </ButtonGroup>
                <Box>
                    <TextField
                        value={searchValue}
                        onChange={handleCangeSearchValue}
                        label="search..."
                        className="search"
                        margin="normal"
                    />
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="demo-simple-select-label">
                            LookFor
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={loginPhoneName}
                            label="LookFor"
                            onChange={handleChangeLoginPhoneName}
                        >
                            <MenuItem value={"login"}>login</MenuItem>
                            <MenuItem value={"phone"}>phone</MenuItem>
                            <MenuItem value={"firstName"}>name</MenuItem>
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
                                <TableCell align="center">Login</TableCell>
                                <TableCell align="center">Firstname</TableCell>
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{table}</TableBody>
                    </Table>
                </TableContainer>

                <TableContainer component={Paper}>
                    Loans of user: {selectedLogin}
                    <Table sx={{ minWidth: 200 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>login</TableCell>
                                <TableCell align="center">how mach</TableCell>
                                <TableCell align="center">
                                    date of creation
                                </TableCell>
                                <TableCell align="right">reason</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{loansTable ? loansTable : null}</TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    );
}
