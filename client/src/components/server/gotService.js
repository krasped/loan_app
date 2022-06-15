/**
 * @module gotService
 */

import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

function GotService() {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    this._apiBase = '';
    // this._apiBase = "http://localhost:5000/";// убрать при деплое


    const logout = (responce, resOk) => {
        if (responce.redirect && responce.redirect === 'redirect'){
            localStorage.removeItem('token');
            localStorage.removeItem('isLogged');
            localStorage.removeItem('userId');
            dispatch({ type: "AUTORIZATION_STATUS", payload: localStorage.getItem('isLogged') });
            dispatch({ type: "USER_ID", payload: localStorage.getItem('userId') });
            dispatch({ type: "USER_TOKEN", payload: localStorage.getItem('token') });
        }else {
            
        }
        if(!resOk){
            enqueueSnackbar(t("loginPage.invalid"), {
                variant: "warning",
            });
        }
    }
    

    const getUserToken = () =>{
        return (localStorage.getItem('token'))?localStorage.getItem('token'): '';
    }

    this.getResource = async function (url = "") {
        try {
            const response = await fetch(`${this._apiBase}${url}`, {
                method: 'GET', 
                headers: new Headers({
                    'Authorization': 'Bearer ' + getUserToken(),
                    'Content-Type': 'application/json'
                })
            });
            let json = await response.json();
            logout(json, response.ok);
            return json;
        } catch (error) {
            console.error("error: ", error);
        }
    };

    this.postResource = async (url = "", data) => {
        try {
            const response = await fetch(`${this._apiBase}${url}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: new Headers({
                    'Authorization': 'Bearer ' + getUserToken(),
                    'Content-Type': 'application/json'
                })
            });
            let json = await response.json();
            // console.log("success", JSON.stringify(json));
            logout(json, response.ok);
            return json;
        } catch (error) {
            console.error("error: ", error);
        }
    };
}

export default GotService;
