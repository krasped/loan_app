/**
 * @module gotService
 */

import { useDispatch } from 'react-redux';
function GotService() {
    const dispatch = useDispatch();
    this._apiBase = "";

    const logout = (responce) => {
        if (responce === 'redirect'){
            localStorage.removeItem('token');
            localStorage.removeItem('isLogged');
            localStorage.removeItem('userId');
            dispatch({ type: "AUTORIZATION_STATUS", payload: localStorage.getItem('isLogged') });
            dispatch({ type: "USER_ID", payload: localStorage.getItem('userId') });
            dispatch({ type: "USER_TOKEN", payload: localStorage.getItem('token') });
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
            logout(json);
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
            console.log(response);
            let json = await response.json();
            console.log("success", JSON.stringify(json));
            logout(json);
            return json;
        } catch (error) {
            console.error("error: ", error);
        }
    };
}

export default GotService;
