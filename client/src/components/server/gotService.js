
function GotService() {
    this._apiBase = "http://localhost:5000/";

    const logout = (responce) => {
        if (responce === 'redirect'){
            localStorage.removeItem('isLogged');
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
            return json;
        } catch (error) {
            console.error("error: ", error);
        }
    };
}

export default GotService;
