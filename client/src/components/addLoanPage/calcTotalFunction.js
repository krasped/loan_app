const sumRowOfColulmn = (arr, nameOfColumn, conditionName) => {
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
            .reduce((a, b) => a + b,0);
    }
};

const numUsersHasSumAmount = (loans) => {
    let count = 0;
    loans.forEach((item) => {
        if (
            item["sumAmount"] &&
            item["sumAmount"] !== "" &&
            +item["sumAmount"] !== 0
        )
            count++;
    });
    return count;
};

export default function calcTotalForEachUser(loans, totalSum, cb) {
    let loanArr = loans.slice();
    let newLoans;

    console.log(loans, totalSum);
    if (totalSum && totalSum !== "") {
        newLoans = calcWithTotalSum(loanArr, totalSum);
    } else {
        newLoans = calcWithoutTotalSum(loanArr);
    }
    let finalLoans = changeHowMachUsersWithCheckbox(newLoans);
    if (cb) {
        cb(finalLoans);
    } else {
        return finalLoans;
    }
}

const userWithHowMach = (user, totalSum) => {
    console.log(totalSum)
    let pay = user.pay !== "" ? +user.pay : 0;
    let loan = user.loan !== "" ? +user.loan : 0;
    let sumAmount = user.sumAmount !== "" ? +user.sumAmount : 0;
    // let newUser = user.slice();
    console.log(user.sumAmount, user.sumAmount === 0);
    if (sumAmount !== 0) {
        console.log(pay, user.sumAmount)
        user.howMach = user.sumAmount - pay;
        console.log(1, user);
        return user;
    } else {
        user.howMach = totalSum - pay + loan;
        console.log(2, user);
        return user;
    }
};

const changeHowMachUsersWithCheckbox = (arr) => {

    let loans = arr.slice();
    let totalHowMach = sumRowOfColulmn(loans, "howMach");//should be >=0
    if(totalHowMach == 0) {
        return loans
    }else {
        let checkedUsers = [];
        loans.forEach((item) => {
            if(item.isPay) checkedUsers.push(item.login);
            
        })
        if(checkedUsers.length == 0) checkedUsers.push(localStorage.getItem('login'));
        totalHowMach /= checkedUsers.length;
        let newLoans = loans.map((item) => {
            let newItem = item
            let idx = checkedUsers.indexOf(item.login);
            if(idx !== -1){
                newItem.howMach = item.howMach - totalHowMach;
            } 
            return item;            
        })
        return newLoans;
    }
}

const calcWithTotalSum = (loans, totalSum) => {
    let bank = totalSum;

    if (loans && loans.length > 0) {
        let totalTotalAmount = sumRowOfColulmn(loans, "loan", "sumAmount");
        bank -= totalTotalAmount; //вычитаем из суммы для деления на всех
        bank /= (loans.length - numUsersHasSumAmount(loans)); //убираем из деления на всех пользователей с всего должен
        //нужно проверить чтобы после вычитания если количество отсвшихся заемов 0 то банк не должен быть больше 0
        //так же банк не может быть отрицательным
        let loansWithHowMach = loans.map((item) => {
            return userWithHowMach(item, bank);
        });

        return loansWithHowMach;
    } else return loans;
};
const calcWithoutTotalSum = (loans) => {
    let bank = 0;
    if (loans && loans.length > 0) {
        let totalTotalAmount = sumRowOfColulmn(loans, "loan", "sumAmount");
        let totalTotalPay = sumRowOfColulmn(loans, "pay");
        bank =
            totalTotalPay >= totalTotalAmount
                ? (totalTotalPay - totalTotalAmount) /
                  (loans.length - numUsersHasSumAmount(loans))
                : 0;
        let loansWithHowMach = loans.map((item) => {
            return userWithHowMach(item, bank);
        });
        return loansWithHowMach;
    } else return loans;
};
