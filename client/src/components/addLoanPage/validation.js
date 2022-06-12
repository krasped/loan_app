
    const isOk = (loans, field) => {
        let ok = true;
        loans.forEach((x) => {
            if (x[field] === undefined || x[field] === "") {
                ok = false;
            }
        });
        return ok;
    };

    const sumRowOfColulmn1 = (arr, nameOfColumn) => {
        return arr.map((item) => item[nameOfColumn]).reduce((a, b) => a + b);
    };
    const sumRowOfColulmn2 = (arr, nameOfColumn, conditionName) => {
        if (!conditionName) {
            return arr.map((item) => +item[nameOfColumn]).reduce((a, b) => a + b,0);
        } else {
            return arr
                .map((item) => {
                    let value =
                        item[conditionName] &&
                        item[conditionName] !== "" &&
                        +item[conditionName] !== 0
                            ? +item[conditionName]
                            : +item[nameOfColumn];
                    return value;
                })
                .reduce((a, b) => a + b);
        }
    };

export default function Validation (loans, totalSum){
    let result = true;



    return result;
}