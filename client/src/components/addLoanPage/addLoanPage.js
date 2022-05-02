/**
 * @module addLoanPage
 *
 */

import React, { useState, useEffect } from "react";
import {
    Stack,
    TextField,
    Box,
    Button,
    Autocomplete,
    styled,
} from "@mui/material";
import GotService from "../server";
import { useSnackbar } from "notistack";

export default function LoansPage() {
    /**
     * @function enqueueSnackbar
     * @param message - write mesagge what do you want
     * @param options - @example { variant:'success' } or variant: 'warning' ...error warning info
     * @example enqueueSnackbar('This is a success message!', { 'success' });
     */
    const { enqueueSnackbar } = useSnackbar(); //for message to user
    const Div = styled("div")(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));

    const got = new GotService();

    const [event, setEvent] = useState("");
    const [loans, setLoans] = useState([]);
    const [ghosts, setGhosts] = useState([]);
    const [other, setOther] = useState("");
    const [table, setTable] = useState(null);
    const [newUser, setNewUser] = useState("");
    const [allUsersArr, setAllUsersArr] = useState([]);
    const [id, setId] = useState(1);

    const getAllUsers = async () => {
        const users = await got.getResource("users/all/login");
        setAllUsersArr(users.users);
    };

    const handleChangeNewUser = (e) => {
        setNewUser(e.target.value);
    };

    const returnArrOfGhost = (arr , allUsers ) => {
        let allUsersArr = allUsers.map(item => item.login);//массив логинов всех пользователей
        let usersInLoans = Array.from( // массив уникальных логинов в заемах
            new Set(arr.map((item) => item.login)),
        ).map((item) => {
            return { login: item };
        }) 
        let newUser = usersInLoans.filter(item => allUsersArr.indexOf(item.login) === -1); // если пользователь в заемах но не в списке пользователе
        return newUser;
    }

    const handleChangeUsersArr = (id, key, value) => {
        const newLoans = loans.map((item) => {
            if (item.id === id) {
                item[key] = value;
            }
            return item;
        });
        setLoans(newLoans);
    };

    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };

    const handleChangeOther = (event) => {
        setOther(event.target.value);
    };

    const addOtherUser = () => {
        if (newUser) {
            setId(id + 1);
            const user = { id, login: newUser };
            setLoans([...loans, user]);
            setNewUser("");
            if (allUsersArr.map((x) => x.login).indexOf(user.login) === -1) {
                enqueueSnackbar(
                    "вы создали логин для пользователя, которого пока не существует",
                    { variant: "warning" },
                );
            }
        } else
            enqueueSnackbar("введите нового пользователя", {
                variant: "warning",
            });
    };
    /**
     *
     * @param {String|Number} rId
     */
    const deleteInput = (rId) => {
        let newUsers = loans.filter((item) => item.id !== rId);
        setLoans(newUsers);
    };

    const getAllParanetrsFromPage = () => {
        return { event, loans, other };
    };
    /**
     *
     * @param {String} event
     * @param {Array} loans
     * @param {string} other
     */

    const isOk = (loans, field) => {
        let ok = true;
        loans.forEach((x) => {
            if (x[field] === undefined || x[field] === "") {
                ok = false;
            }
        });
        return ok;
    };
    const checkFormFielsd = (loans) => {
        let isOk = true;
        return isOk;
    };

    const handleClickSendForm = async () => {
        const { event, loans, other } = getAllParanetrsFromPage();
        if (loans.length === 0) {
            enqueueSnackbar("need to add user", { variant: "warning" });
        } else {
            if (!isOk(loans, "reason")) {
                enqueueSnackbar("заполните все поля со звездочкой", {
                    variant: "warning",
                });
            } else {
                if (loans.length === 1) {
                    // one user
                    //проверка на себя
                    if (loans[0].login === localStorage.getItem("login")) {
                        //if user it I
                        enqueueSnackbar("введите пользователя кроме себя", {
                            variant: "error",
                        });
                    } else {
                        //one user, not me
                        if (!isOk(loans, "howMach")) {
                            enqueueSnackbar(
                                "когда введен один пользователь должно быть заполнено пле сколько",
                                { variant: "error" },
                            );
                        } else {
                            //прошло все проверки, можно считать и отправлять
                            let sendObj = changeLoansBeforeSending(
                                event,
                                loans,
                                other,
                            );
                            try {
                                let resultSendGhost = await sendGhostUsersToDB(
                                    returnArrOfGhost(loans, allUsersArr)
                                );
                                let result = await sendComplitedLoansToDB(
                                    sendObj,
                                );
                                console.log(result, resultSendGhost);
                                enqueueSnackbar(
                                    "заемы добавлены можете проверить вкладку заемы",
                                    {
                                        variant: "success",
                                    },
                                );
                            } catch (e) {
                                enqueueSnackbar(
                                    `что то пошло не так сообщение: ${e}`,
                                    {
                                        variant: "error",
                                    },
                                );
                            }

                            handleClearForm();
                        }
                    }
                } else {
                    //несоклько пользователей
                    let sendObj = changeLoansBeforeSending(event, loans, other);
                    try {
                        let resultSendGhost = await sendGhostUsersToDB(
                            returnArrOfGhost(loans, allUsersArr)
                        );
                        let result = await sendComplitedLoansToDB(sendObj);
                        console.log(result, resultSendGhost);
                        enqueueSnackbar(
                            "заемы добавлены можете проверить вкладку заемы",
                            {
                                variant: "success",
                            },
                        );
                    } catch (e) {
                        enqueueSnackbar(`что то пошло не так сообщение: ${e}`, {
                            variant: "error",
                        });
                    }
                    handleClearForm();
                }
            }
        }
        //в каждую добваить
    };
    const sendGhostUsersToDB = async (data) => {
        let result = await got.postResource("add_loan/addGhostUsers", data);
        return result;
    };
    /**
     *
     * @param {*} data
     * @returns promice promice from db request
     */
    const sendComplitedLoansToDB = async (data) => {
        let result = await got.postResource("add_loan/add", data);
        return result;
    };

    /**
     * @function changeLoansBeforeSending - compare array of component to send from parameters
     * @param {String} event
     * @param {Array} loans
     * @param {string} other
     * @returns {Array} final array
     */
    const changeLoansBeforeSending = (event, loans, other) => {
        const aeparatedArr = separateSumForUsers(loans);
        let finalLoans = aeparatedArr.map((item) => {
            let newItem = item;
            let reason = `${event ? "Event:" + event : ""} Details: ${
                item.reason
            }; ${other ? "Other:" + other : ""} `;
            newItem.reason = reason;
            return newItem;
        });
        return finalLoans;
    };

    const sumRowOfColulmn = (arr, nameOfColumn) => {
        return arr.map((item) => item[nameOfColumn]).reduce((a, b) => a + b);
    };

    const separateSumForUsers = (loans) => {
        let newLoans = loans.slice();
        let bank = sumRowOfColulmn(newLoans, "howMach"); //банк должен быть больше либо равен 0, если меньше то придется у создателя вычитать
        newLoans.push({
            login: localStorage.getItem("login"),
            howMach: bank < 0 ? -bank : 0,
            reason: "Cоздатель заема. ",
        }); //добавление меня по умолчанию ни на что не влияет
        let arrOfUniqueUsersFromLoans = Array.from(
            new Set(newLoans.map((item) => item.login)),
        );

        let separatedLoans = arrOfUniqueUsersFromLoans.map((uniq) => {
            // после этого у нас массив с уникальными логинами separatedLoans
            let user = { login: uniq };
            let arrByLogins = newLoans.filter((item) => item.login === uniq); //массив объектов с одинаковыми логинами
            user.howMach = sumRowOfColulmn(arrByLogins, "howMach");
            user.reason = sumRowOfColulmn(arrByLogins, "reason");
            return user;
        });
        let sumForEachUser = Math.floor(bank / separatedLoans.length);

        let newSeparatedLoans = separatedLoans.map((item) => {
            let newItem = {};
            Object.assign(newItem, item);
            let total = item.howMach - sumForEachUser;
            newItem.howMach = total;
            return newItem;
        });
        let loansMore = newSeparatedLoans.filter((item) => item.howMach > 0);
        let loansLess = newSeparatedLoans.filter((item) => item.howMach < 0);
        let finalLoans = [];
        //каждый к каждому создание новых заемов

        loansMore.forEach((moreItem) => {
            //изменить подсчен не поровну на всех а учесть индивидуальные траты -
            let item = {};
            Object.assign(item, moreItem);
            loansLess.forEach((lessItem) => {
                item.howMach = Math.floor(
                    -(lessItem.howMach / loansMore.length),
                );
                let newLoan = {};
                Object.assign(newLoan, item);
                newLoan.secondUser = lessItem.login;
                finalLoans.push(newLoan);
            });
        });
        loansLess.forEach((lessItem) => {
            //считает отрицательные заемы, положительные просто поменть 2 пользователя местами
            let item = {};
            Object.assign(item, lessItem);
            item.howMach = Math.floor(lessItem.howMach / loansMore.length);
            loansMore.forEach((moreItem) => {
                let newLoan = {};
                Object.assign(newLoan, item);
                newLoan.secondUser = moreItem.login;
                finalLoans.push(newLoan);
            });
        });
        return finalLoans;
    };

    const handleClearForm = () => {
        setNewUser("");
        setId(1);
        setLoans([]);
        setEvent("");
        setOther("");
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
                    onChange={(e) =>
                        handleChangeUsersArr(row.id, "login", e.target.value)
                    }
                    label="* users"
                    value={row.login}
                    disabled
                />
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    type="number"
                    onChange={(e) =>
                        handleChangeUsersArr(
                            row.id,
                            "howMach",
                            e.target.valueAsNumber,
                        )
                    }
                    label="how mach"
                />
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    onChange={(e) =>
                        handleChangeUsersArr(
                            row.id,
                            "reason",
                            e.target.value + " ",
                        )
                    }
                    label="* details"
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
                        options={allUsersArr.map((option) => option["login"])}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField {...params} label="select user login" />
                        )}
                        onBlur={handleChangeNewUser}
                        value={newUser}
                    />

                    <Button
                        variant="outlined"
                        onClick={() => addOtherUser(newUser)}
                    >
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
                    <Button variant="outlined" onClick={handleClickSendForm}>
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
            <Div>{"* Поля со звездочкой обязательны к заполнению"}</Div>
        </>
    );
}
