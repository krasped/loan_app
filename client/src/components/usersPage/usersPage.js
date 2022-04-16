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
    TableBody
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import GotService from "../server";
import Spiner from "../spiner";

export default function UsersPage() {
    const got = new GotService();
    const [table, setTable] = useState(null);
    const [loansTable, setLoansTable] = useState(null);
    const [allOrFriends, setAllOrFriends] = useState(true); //true equel allUsers
    const [searchValue, setSearchValue] = useState('');
    const [loginPhoneName, setLoginPhoneName] = useState('login');// login name phone
    const [curentDateForTable, setCurentDateForTable] = useState('null');
    // const dispatch = useDispatch();
    // const userTable = useSelector((state) => state.user.user);

    const searchData = (allOrFriends, searchValue = '', loginPhoneName = 'login', data) => {
        console.log(allOrFriends, searchValue, loginPhoneName);
        if(searchValue === ''){
            return
        }
    }

    const updateUser = async function (url, data) {
        let dbPromise = await got.getResource(url);
        console.log(dbPromise);
        

        if(data === 'loans'){
            let table = await renderLoansTable(dbPromise[data]);
            setLoansTable(table)
        }else{
            let table = await renderTable(dbPromise[data]);
            setTable(table);
        }
        
        // dispatch({ type: "UPDATE_USER", payload: table });
    };

    const renderTable = (data) => {
        if (!data) return;
        return data.map((row) => (
            <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {row.login}
                </TableCell>
                <TableCell align="center">{row.firstName}</TableCell>
                <TableCell align="right">{row.phone}</TableCell>
            </TableRow>
        ));
    };

    const renderLoansTable = (data) => {
        if (!data) return;
        return data.map((row) => (
            <TableRow
                key={row.id}
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

    useEffect(() => {
        searchData(allOrFriends, searchValue, loginPhoneName, curentDateForTable);
    }, [allOrFriends, searchValue, loginPhoneName]);

    useEffect(() => {
        updateUser("users/all", "users");
        updateUser("loans/all", "loans");
        updateUser("loans/user", "loans");
    }, []);

    const handleChangeLoginPhoneName = (e) => {
        setLoginPhoneName(e.target.value);
    };
    const handleCangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    }
    // const loansTable = null;
    return (
        <>
            {!table ? <Spiner /> : null}

            <Stack spacing={2} direction="row" alignItems="center">
                <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                >
                    <Button onClick={() => setAllOrFriends(false)}>My contacts</Button>
                    <Button onClick={() => setAllOrFriends(true)}>All users</Button>
                </ButtonGroup>
                <Box>
                    <TextField
                        value = {searchValue}
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
                                <TableCell>Login</TableCell>
                                <TableCell align="center">Firstname</TableCell>
                                <TableCell align="right">Phone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{table}</TableBody>
                    </Table>
                </TableContainer>

                <TableContainer component={Paper}>
                    Loans of selected user
                    <Table sx={{ minWidth: 200 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>login</TableCell>
                                <TableCell align="center">how mach</TableCell>
                                <TableCell align="center">
                                    date of creation{" "}
                                </TableCell>
                                <TableCell align="right">reason</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{loansTable}</TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    );
}
