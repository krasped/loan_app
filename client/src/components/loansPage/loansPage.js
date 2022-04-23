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
    const [sortBy, setSortBy] = useState('standart')

    const [allLoansData, setAllLoansData] = useState([]);
    const [myLoansData, setMyLoansData] = useState([]);

    const curentUserId = localStorage.getItem("userId");

    const sortByKey = (arr, key = 'login') => {
        let newArr = arr;
        newArr.sort((a,b) => a[key] > b[key] ? 1 : -1);
        return newArr;
    }

    const transformDateToDaysAgo = (data) => {
        let newData = data.map((item) => {
            item.date = Math.floor((Date.now() - Date.parse(item.date))/1000/60/60/24) + ' days ago';
            return item;
        })
        return newData;
        // date.toISOString().split('T')[0]//data in format yyyy-mm-dd
    }


    const searchData = (
        //midlware for drow table
        searchValue = "",
        loginHowDateReason = "login",
        data,
        sortBy
    ) => {
        let newData = data;
        if(sortBy === 'login') newData = sortByKey(newData);
        if (searchValue === "") {
            return newData;
        } else {
            let result;
            switch (loginHowDateReason) {
                case ("login"):
                    result = newData.filter((item) => {
                        let finalData = item["login"].toLowerCase();
                        return (
                            finalData.indexOf(searchValue.toLowerCase()) !== -1
                        );
                    });
                    break;
                case "howMach":
                    result = newData.filter((item) => {
                        let finalData = item["howMach"] + "";
                        return finalData.indexOf(searchValue + "") !== -1;
                    });
                    break;
                case "date":
                    result = newData.filter((item) => {
                        let finalData = item["date"].toLowerCase();
                        return (
                            finalData.indexOf(searchValue.toLowerCase()) !== -1
                        );
                    });
                    break;
                case "reason":
                    result = newData.filter((item) => {
                        let finalData = item["reason"].toLowerCase();
                        return (
                            finalData.indexOf(searchValue.toLowerCase()) !== -1
                        );
                    });
                    break;
                default:
                    return newData;
            }
            return result;
        }
    };

    const updateDataFromDb = async function (url, res, obj) {
        let dbPromise;
        if (!obj) {
            dbPromise = await got.getResource(url);
        } else {
            dbPromise = await got.postResource(url, obj);
        }
        switch (res) {
            case "allLoans":
                setAllLoansData(transformDateToDaysAgo(dbPromise["loans"]));
                break;
            case "myLoans":
                setMyLoansData(transformDateToDaysAgo(dbPromise["loans"]));
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
                <TableCell component="th" scope="row">
                    {row.login}
                </TableCell>
                <TableCell align="center">{row.howMach}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
            </TableRow>
        ));
    };

    const handleChangeLoginHowDateReason = (e) => {
        setLoginHowDateReason(e.target.value);
    };
    const handleCangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    }
    const handleChangeSortBy = (e) => {
        setSortBy(e.target.value);
    }

    useEffect(() => {
        allOrMy
            ? updateDataFromDb("loans/all", "allLoans")
            : updateDataFromDb("loans/my", "myLoans", {
                  _id: curentUserId,
              });
    }, [allOrMy, searchValue, loginHowDateReason, sortBy]);


    useEffect(() => {
        setTable(allOrMy ? renderTable(searchData(searchValue, loginHowDateReason, allLoansData, sortBy)) : renderTable(searchData(searchValue, loginHowDateReason, myLoansData, sortBy)));
    }, [allLoansData, myLoansData]);
    // useEffect(() => {
    //     updateUser("loans/all", "loans");
    // }, []);

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
                            label="LookFor"
                            onChange={handleChangeLoginHowDateReason}
                        >
                            <MenuItem value={"login"}>login</MenuItem>
                            <MenuItem value={"sortLogin"}>sortLogin</MenuItem>
                            <MenuItem value={"howMach"}>how much</MenuItem>
                            <MenuItem value={"date"}>days ago</MenuItem>
                            <MenuItem value={"reason"}>reason</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="demo-simple-select-label">
                            sort by
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-seStandart"
                            value={sortBy}
                            label="sort by"
                            onChange={handleChangeSortBy}
                        >
                            <MenuItem value={"standart"}>Standart</MenuItem>
                            <MenuItem value={"login"}>Login</MenuItem>
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
