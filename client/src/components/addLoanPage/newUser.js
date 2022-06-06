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
    const {
        id,
        login,
        pay = 0,
        loan = 0,
        sumAmount = 0,
        details = "",
        howMach = 0,
        isPay = false,
    } = user;
    const { t } = useTranslation();
    console.log(user);
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
                vlaue={pay}
                label={
                    "внес сумму"
                    // t("addLoanPage.howMach")
                }
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                type="number"
                onChange={(e) => changeUser(id, "loan", e.target.value)}
                vlaue={loan}
                label={
                    "потратил на себя"
                    // t("addLoanPage.howMach")
                }
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                type="number"
                onChange={(e) =>
                    changeUser(id, "sumAmount", e.target.value)
                }
                vlaue={sumAmount}
                label={
                    "всего должен"
                    // t("addLoanPage.howMach")
                }
            />
            <TextField
                id="demo-helper-text-misaligned-no-helper"
                onChange={(e) => changeUser(id, "reason", e.target.value + " ")}
                vlaue={details}
                label={t("addLoanPage.details") + " *"}
            />

            

            <TextField
                id="demo-helper-text-misaligned-no-helper"
                vlaue={howMach}
                label={"рассчет"}
                disabled
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPay}
                        onChange={(e) => changeUser(id, "isPay", e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
                label="оплатил остаток"
            />
            <Button variant="outlined" onClick={() => deleteUser(id)}>
                {t("addLoanPage.delete")}
            </Button>
        </Box>
    );
}
