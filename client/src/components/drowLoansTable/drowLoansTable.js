import React, { useState } from "react";
import {
    TableRow,
    Table,
    TableCell,
    TableBody,
    TableContainer,
    TableHead,
    Paper,
} from "@mui/material";

const DrowLoansTable = (props) => {
    const { data } = props;
    const [table, setTable] = useState(null);
    console.log(props);
    setTable(
        data.map((row) => (
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
        )),
    );

    if (!data) return;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell align="center">How much</TableCell>
                        <TableCell align="center">date of creation</TableCell>
                        <TableCell align="right">reason</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{table}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default DrowLoansTable;
