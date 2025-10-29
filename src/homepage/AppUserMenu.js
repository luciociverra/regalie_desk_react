 
import React,{useContext, useState,useEffect,createRef} from "react";
import { Input, Button, List } from 'semantic-ui-react';
import { apiRequest,log,host,jAlert,remoteTest } from "api";
import {SessionContext} from "components/SessionContext";
 
import "./homepage.css";

export const AppUserMenu = (props)=>{
    const {openDesk} = props;
    const list= useContext(SessionContext).sessionInfo.homeMenu
    const [exitPath,setExitPath] = React.useState("/");
    const {sessionInfo, logOff ,isAuthorized, haveMainMenu} = useContext(SessionContext);
    useEffect(() => {
         
    }, [list]);
    
    const logout =(e)=> {
      e.preventDefault();
       // SessionContext reset
      let currentUser ={ user: sessionInfo.user};
      apiRequest({ 
        method: "POST",
        url: "/logout",
        data: currentUser}).then(()=>{
          logOff();
          window.location.replace(exitPath); //provoca il ritorno a index.html
      });
    }
  
   return (
    <>
    <div style= {{backgroundColor: '#fffffe', textAlign: 'center', height: '100vh'}}>
     <img src={process.env.PUBLIC_URL + "/assets/layout/images/logosonia.png"} style= {{marginTop: '100px', marginBottom:'100px', 
			width: '30%', }}/> 

      <div style={{marginTop: 0, border: '0px solid orange', marginBottom: '40px', width: '100%'}}>
          {list.map((item, index) => { 
            return (
           <div key={index} >  
             <Button className= "button-menu" onClick={() => openDesk(item.name)}>
              <p style={{fontSize: 18, color: '#fcfbfb'}}>{item.desc}</p>
            </Button>
            </div>
          )
          })
          }
          </div> 


          <button class="ui button exit-button" onClick={e =>logout(e)} className= "exit-button" style={{fontSize: 18}}>
            <i class="icon sign-out"></i>
            Logout
          </button>
       </div>
      </>
    )
}