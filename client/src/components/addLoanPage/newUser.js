import React from "react";
import {
    TextField,
    Box,
    Button,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function NewUser(props) {
    const { user, changeUser, deleteUser } = props;
    let {
        id,
        login,
        pay = 0,
        loan = 0,
        sumAmount = 0,
        reason = "",
        howMach,
        isPay = false,
    } = user;
    const { t } = useTranslation();
    return (
        <Box
            key={id}
            sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
            }}
        >
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                label={t("addLoanPage.users") + " *"}
                value={login}
                disabled
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                type="number"
                onChange={(e) => changeUser(id, "pay", e.target.value)}
                value={pay}
                label={t("newUser.amountDeposited")}
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                type="number"
                onChange={(e) => changeUser(id, "loan", e.target.value)}
                value={loan}
                label={t("newUser.spentOnHimself")}
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                type="number"
                onChange={(e) => changeUser(id, "sumAmount", e.target.value)}
                value={sumAmount}
                label={t("newUser.totalAmount")}
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                onChange={(e) => changeUser(id, "reason", e.target.value)}
                value={reason}
                label={t("addLoanPage.details") + " *"}
            />

            <TextField
                id="demo-helper-text-misaligned-no-helper"
                value={howMach}
                label={t("newUser.calculaded")}
                disabled
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPay}
                        onChange={(e) =>
                            changeUser(id, "isPay", e.target.checked)
                        }
                        inputProps={{ "aria-label": "controlled" }}
                    />
                }
                label={t("newUser.paidRest")}
            />
            {localStorage.getItem("login") === login ? null : (
                <Button variant="outlined" onClick={() => deleteUser(id)}>
                    {t("addLoanPage.delete")}
                </Button>
            )}
        </Box>
    );
}
