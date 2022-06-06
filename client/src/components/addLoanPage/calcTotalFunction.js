

const sumRowOfColulmn = (arr, nameOfColumn) => {
    console.log(arr)
    return arr.map((item) => item[nameOfColumn]).reduce((a, b) => a + b);
};
const isOk = (loans, field) => {
    let ok = true;
    loans.forEach((x) => {
        if (x[field] === undefined || x[field] === "") {
            ok = false;
        }
    });
    return ok;
};

export default function calcTotalForEachUser(loans, totalSum, cb) {
    let newLoans
    console.log(loans, totalSum);
    if(totalSum && totalSum!==''){
        newLoans = calcWithTotalSum(loans, totalSum);
    } else {
        newLoans = calcWithoutTotalSum(loans)
    }
    console.log(newLoans)
    if (cb){
        cb(newLoans);
    } else {
        return newLoans;
    }
    
}

const calcWithTotalSum = (loans, totalSum) => {
    let bank = totalSum;
    if(loans && loans.length>0){
        let totalPay = sumRowOfColulmn(loans, 'pay');
        
        return loans
    }else return loans;
    
    
}
const calcWithoutTotalSum = (loans) => {
    if(loans && loans.length>0){
        let totalPay = sumRowOfColulmn(loans, 'pay')
        return loans
    }else return loans;
}