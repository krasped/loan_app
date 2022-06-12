import { useTranslation } from "react-i18next";


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
    const { t } = useTranslation();
    let result = { isOk: true, message: "" };
    const setResult = (isOk, message) => {
        result = { isOk, message };
    };

    let totalTotalAmount = sumRowOfColulmn(loans, "loan", "sumAmount");
    let totalPay = sumRowOfColulmn(loans, "pay");
    //минимум 2 заемщика
    if(loans.length < 2){
        setResult(false, "минимум 2 пользователя")
    } 
    //есть общая сумма
    if (totalSum && totalSum !== "" && totalSum !== "0") {
        if(+totalTotalAmount > +totalSum){
            setResult(
                  false,
                  "общая сумма не может быть меньше суммы затрат и долгов",
              )
        }
        if(totalPay > totalSum){
                setResult(
                  false,
                  "общая сумма не может быть меньше суммы внесенных денег",
              )
        }
        
           
        if(totalPay > totalSum){
            setResult(
                  false,
                  "общая сумма не может быть меньше суммы внесенных денег",
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
                  "потратил на себя не может быть больше всего должен",
                )
            }
        }
            
            if(!item.details && item.details !== ''){
                setResult(
                false,
                "должно быть заполнено поле детали",
                )
            }
        })
    console.log(3)
    return result;
}
