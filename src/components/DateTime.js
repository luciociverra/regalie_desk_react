import React, { useState, useMemo, useCallBack, useEffect, useRef } from "react";
import { Input } from "semantic-ui-react";

    const dateTime = ()=>{
        var showdate= new Date();
        var displaytodaysdate= showdate.getDate()+ '/'+ showdate.getMonth()+ '/'+showdate.getFullYear();
        return (
            <div>
                <Input type= "date" value={displaytodaysdate} readOnly= "false" />
            </div>
        )
    }

export default dateTime;
