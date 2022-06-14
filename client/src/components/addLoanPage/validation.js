
// import { useTranslation } from "react-i18next";


const sumRowOfColulmn = (arr, nameOfColumn, conditionName) => {
    if (!conditionName) {
        return arr
            .map((item) => +item[nameOfColumn])
            .reduce((a, b) => a + b, 0);
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
            .reduce((a, b) => a + b, 0);
    }
};

export default function Validation(loans, totalSum) {
    // const { t } = useTranslation();
    let result = { isOk: true, message: "" };
    const setResult = (isOk, message) => {
        result = { isOk, message };
    };

    let totalTotalAmount = sumRowOfColulmn(loans, "loan", "sumAmount");
    let totalPay = sumRowOfColulmn(loans, "pay");
    //минимум 2 заемщика
    if(loans.length < 2){
        setResult(false, "validation.twoUsers")
    } 
    //есть общая сумма
    if (totalSum && totalSum !== "" && totalSum !== "0") {
        if(+totalTotalAmount > +totalSum){
            setResult(
                  false,
                  "validation.totalMoreSumLoans",
              )
        }
           
        if(totalPay > totalSum){
            setResult(
                  false,
                  "validation.totalMorePay",
              )
        }
            
        console.log(1);
    } else {
        console.log(2);
    }

    loans.forEach((item) => {
        console.log(4)
        console.log((+item.sumAmount)!==0)
        if((+item.sumAmount)!==0){
            if(+item.loan > +item.sumAmount){
                setResult(
                  false,
                  "validation.totalMoreLoan",
                )
            }
        }
            console.log(item, item.reason)
            if((!item.reason) || (item.reason == '')){
                setResult(
                false,
                "validation.shouldDetails",
                )
            }
        })
    console.log(3)
    return result;
}
