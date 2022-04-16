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
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import GotService from "../server";
import Spiner from "../spiner";

export default function LoansPage() {
    const got = new GotService();

    const [table, setTable] = useState(null);
    const [allOrMy, setAllOrMy] = useState(true); //true equel allLoans
    const [searchValue, setSearchValue] = useState("");
    const [loginHowDateReason, setLoginHowDateReason] = useState("login"); // login how date reason

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

    const updateUser = async function (url, data) {
        let dbPromise = await got.getResource(url);
        console.log(dbPromise);
        let table = await renderTable(dbPromise[data]);

        setTable(table);
        // dispatch({ type: "UPDATE_USER", payload: table });
    };

    const renderTable = (data) => {
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
    // const dispatch = useDispatch();
    // const userTable = useSelector((state) => state.user.user);

    // const updateUser = async function () {
    //     let dbPromise = await got.getResource("user");
    //     let table = await renderTable(dbPromise);
    //     dispatch({ type: "UPDATE_USER", payload: table });
    // };

    // const renderTable = (data) => {
    //     if (!data) return ;
    //     return data.map((row) => (
    //         <TableRow
    //             key={row.id}
    //             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //         >
    //             <TableCell component="th" scope="row">
    //                 {row.id}
    //             </TableCell>
    //             <TableCell align="center">{row.firstName}</TableCell>
    //             <TableCell align="right">{row.lastName}</TableCell>
    //             <TableCell align="right">{row.email}</TableCell>
    //         </TableRow>
    //     ));
    // };

    // useEffect(() => {
    //     updateUser();
    // }, []);

    const handleChangeLoginHowDateReason = (e) => {
        setLoginHowDateReason(e.target.value);
    };
    const handleCangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    }

    useEffect(() => {
        searchData(
            allOrMy,
            searchValue,
            loginHowDateReason,
            
        );
    }, [allOrMy, searchValue, loginHowDateReason]);

    useEffect(() => {
        updateUser("loans/all", "loans");
    }, []);

    return (
        <>
            {!table ? <Spiner /> : null}

            <Stack spacing={2} direction="row" alignItems="center">
                <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                >
                    <Button onClick={() => setAllOrMy(false)}>My loans</Button>
                    <Button onClick={() => setAllOrMy(true)}>All loans</Button>
                </ButtonGroup>
                <Box>
                    <TextField
                        value = {searchValue}
                        onChange={handleCangeSearchValue}
                        label={"search..."}
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
                            value={loginHowDateReason}
                            label="search..."
                            onChange={handleChangeLoginHowDateReason}
                        >
                            <MenuItem value={"login"}>user</MenuItem>
                            <MenuItem value={"how"}>how much</MenuItem>
                            <MenuItem value={"date"}>days ago</MenuItem>
                            <MenuItem value={"reason"}>reason</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Stack>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Login</TableCell>
                            <TableCell align="center">How much</TableCell>
                            <TableCell align="center">
                                date of creation
                            </TableCell>
                            <TableCell align="right">reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{table}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
