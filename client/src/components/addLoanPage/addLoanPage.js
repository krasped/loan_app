import React, { useState, useEffect } from "react";
import { Stack, TextField, Box, Button,Autocomplete } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import GotService from "../server";
import Spiner from "../spiner";

export default function LoansPage() {
    const got = new GotService();

    
    
    const [event, setEvent] = useState("");
    const [loans, setLoans] = useState([]);
    const [other, setOther] = useState("");
    const [table, setTable] = useState(null);
    const [newUser, setNewUser] = useState('');
    const [allUsersArr, setAllUsersArr] = useState([]);
    const [id, setId] = useState(1);
    // const dispatch = useDispatch();
    // const userTable = useSelector((state) => state.user.user);

    // const updateUser = async function () {
    //     let dbPromise = await got.getResource("user");
    //     let table = await renderTable(dbPromise);
    //     dispatch({ type: "UPDATE_USER", payload: table });
    // };

    // const handleChangeLookForParametr = (e) => {
    //     setLookForParametr(e.target.value);
    // }

    const getAllUsers = async() => {
        const users = await got.getResource('users/all/login');
        setAllUsersArr(users.users);
    }

    const handleChangeNewUser = (e) => {

        console.log(e.target.value);
        setNewUser(e.target.value);
    }

    const handleChangeUsersArr = (id, key, value) => {
        const newLoans = loans.map((item) => {
            if (item.id === id) {
                item[key] = value;
            }
            return item;
        });
        console.log(loans);
        setLoans(newLoans);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    const handleChangeOther = (event) => {
        setOther(event.target.value);
    };

    const addOtherUser = () => {
        setId(id + 1);
        const user = { id, 'login': newUser  };
        setLoans([...loans, user]);
        setNewUser('');
    };

    const deleteInput = (rId) => {
        let newUsers = loans.filter((item) => item.id !== rId);
        setLoans(newUsers);
    };


    const  handleClickSendForm = async(event, loans, other) => {
        let result = await got.postResource(
            "add_loan/add",
             changeLoansBeforeSending(event, loans, other)    
        );
        console.log(result);
        handleClearForm();
    };

    
    const changeLoansBeforeSending = (event, loans, other) => {
        const newLoans = loans.map((item)=> {
            delete item.id;
            let reason = `Event: ${event}; Details: ${item.reason}; Other: ${other} `;
            item.reason = reason;
            return item;
        });
        console.log(newLoans);
        return [...newLoans];
    }

    const handleClearForm = () => {
        setLoans([]);
        setEvent('');
        setOther('');
    };

    const renderUsersInputs = () => {
        const tabl = loans.map((row) => (
            <Box
                key={row.id}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    "& > :not(style)": { m: 1 },
                }}
            >
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    onChange={(e) => handleChangeUsersArr(row.id, "login", e.target.value)}
                    label="users"
                    value = {row.login}
                    disabled
                />
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    type='number'
                    onChange={(e) => handleChangeUsersArr(row.id, "howMach", e.target.valueAsNumber)}
                    label="how mach"
                />
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    onChange={(e) => handleChangeUsersArr(row.id, "reason", e.target.value)}
                    label="details"
                />
                <Button variant="outlined" onClick={() => deleteInput(row.id)}>
                    delete
                </Button>
            </Box>
        ));
        setTable(tabl);
    };

    

    useEffect(() => {
        renderUsersInputs();
        getAllUsers();
    }, [loans]);
    return (
        <>
            <Box>
                
                    <TextField
                        id="demo-helper-text-misaligned-no-helper"
                        label="Event"
                        margin="normal"
                        onChange={handleChangeEvent}
                        value={event}
                    />
                

                <Stack spacing={2} direction="row" alignItems="center">
                    <Autocomplete
                        
                        id="free-solo-demo"
                        freeSolo
                        options={allUsersArr.map((option) => option['login'])}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Users login" />}
                        onBlur={handleChangeNewUser}
                        value={newUser}
                    />

                    <Button variant="outlined" onClick={() => addOtherUser(newUser)}>
                        Add new user
                    </Button>
                </Stack>

                {table}

                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    label="other"
                    margin="normal"
                    onChange={handleChangeOther}
                    value={other}
                />

                <Box>
                    <Button
                        variant="outlined"
                        onClick={() => handleClickSendForm(event, loans, other)}
                    >
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleClearForm()}
                    >
                        Clear Form
                    </Button>
                </Box>
            </Box>
        </>
    );
}
