/**
 * @module addLoanPage
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
import NewUser from "./NewUser";
import GotService from "../server";
import Validation from "./validation.js";
import CalcTotalForEachUser from "./calcTotalFunction.js";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const got = new GotService();

    const [event, setEvent] = useState("");
    const [totalSum, setTotalSum] = useState("");
    const [loans, setLoans] = useState([]);
    const [other, setOther] = useState("");
    const [table, setTable] = useState(null);
    const [newUser, setNewUser] = useState("");
    const [allUsersArr, setAllUsersArr] = useState([]);
    const [id, setId] = useState(1);

    const getAllUsers = async () => {
        const users = await got.getResource("users/all/login");
        setAllUsersArr(users.users);
    };

    const handleChangeTotalSum = (e) => {
        setTotalSum(e.target.value);
    };
    const handleChangeNewUser = (e) => {
        setNewUser(e.target.value);
    };
    const handleChangeEvent = (e) => {
        setEvent(e.target.value);
    };
    const handleChangeOther = (event) => {
        setOther(event.target.value);
    };

    // const sumRowOfColulmn = (arr, nameOfColumn) => {
    //     return arr.map((item) => item[nameOfColumn]).reduce((a, b) => a + b);
    // };

    const returnArrOfGhost = (arr, allUsers) => {
        let allUsersArr = allUsers.map((item) => item.login); //массив логинов всех пользователей
        let usersInLoans = Array.from(
            // массив уникальных логинов в заемах
            new Set(arr.map((item) => item.login)),
        ).map((item) => {
            return { login: item };
        });
        let newUser = usersInLoans.filter(
            (item) => allUsersArr.indexOf(item.login) === -1,
        ); // если пользователь в заемах но не в списке пользователе
        return newUser;
    };

    const handleChangeUsersArr = (id, key, value) => {
        const newLoans = loans.map((item) => {
            if (item.id === id) {
                item[key] = value;
            }
            return item;
        });
        setLoans(newLoans);
    };

    const addAuthorToLoan = () => {
        setId(id + 1);

        const user = {
            id,
            login: localStorage.getItem("login"),
            pay: 0,
            loan: 0,
            sumAmount: 0,
            reason: "",
            howMach: 0,
            isPay: true,
        };
        setLoans([...loans, user]);
        setNewUser("");
    };

    const addOtherUser = () => {
        if (newUser) {
            setId(id + 1);
            const user = {
                id,
                login: newUser,
                pay: 0,
                loan: 0,
                sumAmount: 0,
                reason: "",
                howMach: 0,
                isPay: false,
            };
            setLoans([...loans, user]);
            setNewUser("");
            if (allUsersArr.map((x) => x.login).indexOf(user.login) === -1) {
                enqueueSnackbar(t("addLoanPage.createLoginMessage"), {
                    variant: "warning",
                });
            }
        } else
            enqueueSnackbar(t("addLoanPage.newUserMessage"), {
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
        return { event, loans, other, totalSum };
    };
    /**
     *
     * @param {String} event
     * @param {Array} loans
     * @param {string} other
     */

    // const isOk = (loans, field) => {
    //     let ok = true;
    //     loans.forEach((x) => {
    //         if (x[field] === undefined || x[field] === "") {
    //             ok = false;
    //         }
    //     });
    //     return ok;
    // };
    const handleClickSendForm = async () => {
        const { event, loans, other, totalSum } = getAllParanetrsFromPage();
        let {isOk, message} = Validation(loans, totalSum);
        if (isOk){
            console.log('устраивает');
        } else {
            enqueueSnackbar(t(message), {
                variant: "warning",
            });
        };

        // if (Validation(loans, totalSum)) {
        //     let sendObj = changeLoansBeforeSending(
        //         event,
        //         loans,
        //         other,
        //         totalSum,
        //     );
        //     console.log(sendObj);
        //     try {
        //         let resultSendGhost = await sendGhostUsersToDB(
        //             returnArrOfGhost(loans, allUsersArr),
        //         );
        //         let result = await sendComplitedLoansToDB(sendObj);
        //         console.log(result, resultSendGhost);
        //         enqueueSnackbar(t("addLoanPage.loansAdded"), {
        //             variant: "success",
        //         });
        //     } catch (e) {
        //         enqueueSnackbar(`${t("addLoanPage.somethingError")} ${e}`, {
        //             variant: "error",
        //         });
        //     }
        // }

        //далее отправляем заемы, выделяем госты функция естьуже, отправляем госты
        // handleClearForm();
    };

    // const handleClickSendForm = async () => {
    //     const { event, loans, other, totalSum } = getAllParanetrsFromPage();
    //     if (loans.length === 0) {
    //         enqueueSnackbar(t("addLoanPage.needAddUserMessage"), {
    //             variant: "warning",
    //         });
    //     } else {
    //         if (!isOk(loans, "reason")) {
    //             enqueueSnackbar(t("addLoanPage.needAddFields*"), {
    //                 variant: "warning",
    //             });
    //         } else {
    //             if (loans.length === 1) {
    //                 // one user
    //                 //проверка на себя
    //                 if (loans[0].login === localStorage.getItem("login")) {
    //                     //if user it I
    //                     enqueueSnackbar(t("addLoanPage.needAddFields*"), {
    //                         variant: "error",
    //                     });
    //                 } else {
    //                     //one user, not me
    //                     if (!isOk(loans, "howMach")) {
    //                         enqueueSnackbar(
    //                             t("addLoanPage.oneUserNeedHowMach"),
    //                             { variant: "error" },
    //                         );
    //                     } else {
    //                         //прошло все проверки, можно считать и отправлять
    //                         let sendObj = changeLoansBeforeSending(
    //                             event,
    //                             loans,
    //                             other,
    //                             totalSum,
    //                         );
    //                         try {
    //                             let resultSendGhost = await sendGhostUsersToDB(
    //                                 returnArrOfGhost(loans, allUsersArr),
    //                             );
    //                             let result = await sendComplitedLoansToDB(
    //                                 sendObj,
    //                             );
    //                             console.log(result, resultSendGhost);
    //                             enqueueSnackbar(t("addLoanPage.loansAdded"), {
    //                                 variant: "success",
    //                             });
    //                         } catch (e) {
    //                             enqueueSnackbar(
    //                                 `${t("addLoanPage.somethingError")} ${e}`,
    //                                 {
    //                                     variant: "error",
    //                                 },
    //                             );
    //                         }

    //                         handleClearForm();
    //                     }
    //                 }
    //             } else {
    //                 //несоклько пользователей
    //                 let sendObj = changeLoansBeforeSending(
    //                     event,
    //                     loans,
    //                     other,
    //                     totalSum,
    //                 );
    //                 try {
    //                     let resultSendGhost = await sendGhostUsersToDB(
    //                         returnArrOfGhost(loans, allUsersArr),
    //                     );
    //                     let result = await sendComplitedLoansToDB(sendObj);
    //                     console.log(result, resultSendGhost);
    //                     enqueueSnackbar(t("addLoanPage.loansAdded"), {
    //                         variant: "success",
    //                     });
    //                 } catch (e) {
    //                     enqueueSnackbar(
    //                         `${t("addLoanPage.somethingError")} ${e}`,
    //                         {
    //                             variant: "error",
    //                         },
    //                     );
    //                 }
    //                 handleClearForm();
    //             }
    //         }
    //     }
    //     //в каждую добваить
    // };
    const sendGhostUsersToDB = async (data) => {
        let result = await got.postResource("add_loan/addGhostUsers", data);
        return result;
    };

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
    const changeLoansBeforeSending = (event, loans, other, totalSum) => {
        const loansWithHowMach = CalcTotalForEachUser(loans, totalSum);
        let separatedArr = separateLoansToSend(loansWithHowMach);

        let finalLoans = separatedArr.map((item) => {
            let { login, secondUser, howMach } = item;
            let newItem = { login, secondUser, howMach };
            //подправить переносы строки
            let reason = `
                ${event ? t("addLoanPage.event") + ":" + event + ";" : ""} 
                ${t("addLoanPage.details")}: ${item.reason}; 
                ${other ? t("addLoanPage.other") + ":" + other : ""} `;
            newItem.reason = reason;
            return newItem;
        });
        return finalLoans;
    };

    const separateLoansToSend = (loans) => {
        const sumRowOfColulmn = (arr, nameOfColumn) => {
            return arr
                .map((item) => item[nameOfColumn])
                .reduce((a, b) => a + b);
        };

        let loansMore = loans.filter((item) => item.howMach > 0); //взяли
        let loansLess = loans.filter((item) => item.howMach < 0); // дали
        let loansMoreSummHowMach = sumRowOfColulmn(loansMore, "howMach");
        console.log(loansMoreSummHowMach);
        let finalLoans = [];
        //каждый к каждому создание новых заемов

        loansMore.forEach((moreItem) => {
            //изменить подсчен не поровну на всех а учесть индивидуальные траты -
            let item = {};
            Object.assign(item, moreItem);
            loansLess.forEach((lessItem) => {
                item.howMach =
                    Math.floor(
                        (lessItem.howMach / loansMoreSummHowMach) *
                            moreItem.howMach *
                            100,
                    ) / 100;
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

            loansMore.forEach((moreItem) => {
                item.howMach =
                    -Math.floor(
                        (moreItem.howMach / loansMoreSummHowMach) *
                            lessItem.howMach *
                            100,
                    ) / 100;
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
        setTotalSum("");
    };
    //render new user
    const renderUsersInputs = (loans) => {
        console.log("rerender");
        const tabl = loans.map((row) => (
            <Box key={row.id}>
                <NewUser
                    user={row}
                    changeUser={handleChangeUsersArr}
                    deleteUser={deleteInput}
                />
            </Box>
        ));
        setTable(tabl);
    };
    //drow author on page default
    useEffect(() => {
        if (loans.length == 0) addAuthorToLoan();
    }, []);

    useEffect(() => {
        CalcTotalForEachUser(loans, totalSum, renderUsersInputs);
        getAllUsers();
    }, [loans, totalSum]);
    return (
        <>
            <Box>
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    label={t("addLoanPage.event")}
                    margin="normal"
                    onChange={handleChangeEvent}
                    value={event}
                />
                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    label={t("addLoanPage.totalAmount")}
                    margin="normal"
                    type="number"
                    onChange={handleChangeTotalSum}
                    value={totalSum}
                />

                <Stack spacing={2} direction="row" alignItems="center">
                    <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        options={allUsersArr.map((option) => option["login"])}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("addLoanPage.selectUserlogin")}
                            />
                        )}
                        onBlur={handleChangeNewUser}
                        value={newUser}
                    />

                    <Button
                        variant="outlined"
                        onClick={() => addOtherUser(newUser)}
                    >
                        {
                            t("addLoanPage.addNewUser")
                        }
                    </Button>
                </Stack>

                {table}

                <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    label={t("addLoanPage.other")}
                    margin="normal"
                    onChange={handleChangeOther}
                    value={other}
                />

                <Box>
                    <Button variant="outlined" onClick={handleClickSendForm}>
                        {t("addLoanPage.create")}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleClearForm()}
                    >
                        {t("addLoanPage.clearForm")}
                    </Button>
                </Box>
            </Box>
            <Div>{t("addLoanPage.fieldsWith*Should")}</Div>
        </>
    );
}
