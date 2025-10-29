import React, {
  useState,
  useEffect,
} from "react";
import "./MainPanel.css";

 
export const OrderImportLog = (props) => {
  const { responseData } = props;
  useEffect(() => {
  }, [responseData]);
  
  return (
    <div
      className="divMain"
      style={{
        backgroundColor: "white",
        height: "100%",
        padding: 10,
        marginTop: 0,
        border: "0px solid red",
      }}
    >
    { responseData?.rc===1 &&
     <>
     <div style={{heigth:20,width:600,backgroundColor:'red',color:'white',paddingLeft:10}}>
      Attenzione ERRORE
     </div>
     <div style={{heigth:20,width:600,backgroundColor:'red',color:'white',paddingLeft:10}}>
      {responseData.msgOut}
     </div>
     </>

    }

 { responseData?.rc===0 &&
     <>
     <div style={{heigth:20,width:600,backgroundColor:'#aeeb34',color:'black',paddingLeft:10}}>
      Operazione completata con successo
     </div>
     <div style={{heigth:20,width:600,backgroundColor:'#aeeb34',color:'black',paddingLeft:10}}>
      {responseData.msgOut}
     </div>
     </>

    }
    <p></p>
      <div style={{overflow:'auto',height:400}}>
      {
      responseData && responseData.log &&
        responseData.log.map((item,index) => {
        return <div style={{heigh:12}} key={index}>{item}</div>   
        })
      }
      </div>
    </div>
  );
};
