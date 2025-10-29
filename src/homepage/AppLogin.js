import React,{useContext, useState,useEffect,createRef} from "react";
import { Input, Button } from 'semantic-ui-react';
import { apiRequest,log,host,jAlert,remoteTest } from "api";
import {SessionContext} from "components/SessionContext";
 
export const AppLogin = ()=>{
    const {sessionInfo,setLoginData,logOff,isLoginValid} = useContext(SessionContext);
    const [values, setValues] = useState({ user: "", password: "", });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputUserRef = createRef();
    useEffect(() => {
       inputUserRef.current.focus();
    }, []);

    const handleChange = (e, { name, value }) => {
        setError('');
        let newArray = { ...values, [name]: value };
        setValues(newArray);
    };    
    // controllo credenziali (solo utente  su database dopo eventuale verifica AD)
    const veryFyUser = async ()=>{
        if(values.user.trim()==="" || values.password.trim()==="")
        {
          setError("Mancano le credenziali di accesso"); return;
        }
        setLoading(true);
        const a= await remoteTest();
        if(! a) {
          setLoading(false);
          setError("Application server (API) not ready"); return;
          return;
        }
        
        try 
        {
        const response = await apiRequest({
            method: "POST",
            url: "/login",
            data: values,
            user: values.user.trim(),
          });
          if (response.status !== 200) {
            alert('Attenzione servizio di login non disponibile');
          } else {
            loginValidate(response.data)
          }
        } catch(e){}
        finally{
          setLoading(false);
        }
    }
/*
  btoa(): creates a Base64-encoded ASCII string from a "string" of binary data 
  atob(): decodes a Base64-encoded string("atob" should be read as "ASCII to binary").
  const headers = new HttpHeaders(credentials ? {
            authorization : 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});

        this.http.get('user', {headers: headers}).subscribe(response => {
            if (response['name']) {
                this.authenticated = true;
            } else {
                this.authenticated = false;
            }
            return callback && callback();
        });
*/
    const loginValidate=(aData)=>{
      if(!! aData.error)
      {
        setError(aData.error); return;
      }
      
      const defaultSessionInfo = {
        user: undefined,
        userName: '',
        loginPhase: "ok",
        company: "",
        abilitazioni:[],
        homeMenu:[],
        lotti:[],
        deskParam:[],  
        lottiToPrint:[] 
      };
      defaultSessionInfo.user=aData.user;
      defaultSessionInfo.userName=aData.ragSoc;
      defaultSessionInfo.abilitazioni=aData.abilitazioni;
      defaultSessionInfo.homeMenu=aData.homeMenu;
      log("loginValidate salvo informazioni in SessionContext")
      setLoginData(defaultSessionInfo);
    }

    return (
    <>
    <div style= {{backgroundColor: '#fffffe', textAlign: 'center', height: '100vh'}}>
		<img src={process.env.PUBLIC_URL + "/assets/layout/images/logosonia.png"}
         style= {{marginTop: '60px', marginBottom:'20px',width:'30%', }}/>

          <div style={{marginBottom: 20,}}>
            <Input 
            style={{width: '18%', border: '1px solid grey', fontSize:'1.2em', borderRadius: 5, height: 50}}
            icon='user' 
            iconPosition='left' 
            placeholder='Utente'
            name="user"
            value={values.user}
            onChange={handleChange}
            ref={inputUserRef} />  
          </div>

          <div >
            <Input 
             style={{width: '18%', border: '1px solid grey', fontSize:'1.2em',borderRadius: 5, height: 50}}
             icon='key' 
             iconPosition='left' 
             placeholder='Password'
             type='password' 
             name="password"
             value={values.password}
             onChange={handleChange} />  
          </div>

          <div style={{marginTop: 30}}>
           { 
            loading ? 
            <Button 
            style={{width: '18%', border: '1px solid grey', borderRadius: 5, height: 55,fontSize:23,backgroundColor:'#f09f7c'}}
            > ...verify ...
            </Button>
            :
           <Button 
            style={{width: '18%', border: '1px solid grey', borderRadius: 5, height: 55,fontSize:23,backgroundColor:'#f09f7c'}}
            onClick={veryFyUser}>Login
           </Button>
          }
          </div>
          <div style={{marginTop: 30,color:"red",fontWeight:'bold',fontSize:'1.5em'}}>
           {error} 
          </div>
         
        </div>
      
      </>
    )
}