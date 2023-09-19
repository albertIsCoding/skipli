import React from "react";

function Form(){

    return (
        <div className="container">
            <form className="number-form" action="/" method="post">
               
                <input type="text" name="phoneNumber" placeholder="phone number" required="True"/>
                <input type="submit" value="submit"/>
  
            </form>

            <form className="code-form" id="access-code-validate" action="/validate" method="post">

                <input type="text" name="accessCode" placeholder="access code" required="True"/>  
                <input type="submit" value="validate"/>

            </form>
        </div>
    )
}

export default Form