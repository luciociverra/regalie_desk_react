import React,{useState,useEffect,createRef} from "react";
import { Input} from 'semantic-ui-react';
import { apiRequest,jAlert,remoteTest,log } from "api";
import {AppNumAddetti} from "./AppNumAddetti";

export const AppRegalie = ()=>{
 
    const [values, setValues] = useState({ idOperatore: "", codNat: "", numOperatori:0});
    const [error, setError] = useState("");
    const [msg, setMsg]  = useState("");
    const [open,setOpen] = useState(false);
   
    const [loading, setLoading] = useState(false);
    const inputUserRefOperatore =  createRef();
    const inputUserRefRiga = createRef();
    
    useEffect(() => {
      log("AppRegalie.js UE focus operatore"); 
      inputUserRefOperatore.current.focus();
    }, []);
 
    const handleReset = () => {
      setError('');
      setMsg("");
      setValues({ idOperatore: "", codNat: "",numOperatori:0});
      window.location.reload(true);
    };   
   
    const handleError=(text) =>{
      setError(text);
      setValues({ idOperatore: "", codNat: "",numOperatori:0});
      inputUserRefOperatore.current.focus();
      return false;
    }
    
    const handleChange = (e, { name, value }) => {
        //log("handleChange "+value);
        setError('');
        let newArray = { ...values, [name]: value.toUpperCase() };
        setValues(newArray);
    };    

    const onKeyDownOper = (e) => {
      //log(e.key);
      if (e.key === "Enter") {
        e.preventDefault();
        inputUserRefRiga.current.focus();
      }
    };

    const onKeyDownRiga = (e) => {
      //log(e.key);
      if (e.key === "Enter") {
        e.preventDefault();
        log("Enter submit data")
        submitData();
        inputUserRefOperatore.current.focus();
      }
    };

    const setNumAddetti = (aValue) => {
      values.numOperatori=aValue;
      submitData();
      inputUserRefOperatore.current.focus();
    };
    // controllo credenziali (solo utente  su database dopo eventuale verifica AD)
    const submitData = async ()=>{
          setMsg("");
          log(" submitData inizio invio dati num operatore:"+values.numOperatori +" idOperatore:"+values.idOperatore+" codNat:"+values.codNat);
          //
          if(values.idOperatore.trim()==="" || values.codNat.trim()==="")
          {
            setError("Mancano i dati"); return;
          }
        
          let operValid=false;
          if(values.idOperatore.toLocaleUpperCase().startsWith("A") ||
            values.idOperatore.toLocaleUpperCase().startsWith("C") ||
            values.idOperatore.toLocaleUpperCase().startsWith("M") 
          ) operValid=true;
        /* anche alfa numerico
          if(! isNumber(values.codNat))
          {
            return handleError("Numero riga non valido");
          }
        */  
          if(! operValid)
          {
            setError("Codice operatore non valido");
            setValues({ idOperatore: "", codNat: "",numOperatori:0});
            return;
          }
          setLoading(true);
          
          const a= await remoteTest();
          if(! a) {
            log("test remoto fallito");
            setLoading(false);
            setError("Application server (API) not ready");
            return;
          }
          log("test remote passato");
          // devo chiedere gli addetti ?
          if( values.idOperatore.toLocaleUpperCase().startsWith("C") && values.numOperatori===0) {
            const chiedoAddetti= await addettiVerify();
            if(chiedoAddetti) {
              setLoading(false);
              setOpen(true);
              return;
            }
          }
          //
          try 
          {
            log("chiamate a dati -----> /regalie")
            const response = await apiRequest({
              method: "POST",
              url: "/regalie",
              data: values,
              user: 'pc-tempi_regalie'
            });
            if (response.status !== 200) {
              setError("Attenzione servizio di registrazione non disponibile - contattare l'assistenza");
            } else {
              if(response.data.rc==="0"){
                setError(response.data.msg);
                return;
              }
          
              setMsg(response.data.msg);
              log("risposta ok pulisco");
              setValues({ idOperatore: "", codNat: "", numOperatori:0});
            }
          } catch(e){}
          finally{
            setLoading(false);
          }
      }

      const addettiVerify = async () => {
        log("addettiVerify ");
        try {
          const response = await apiRequest({
            method: "POST",
            url: "/addettiregalie",
            data: values,
            user: 'pc-tempi_regalie'
          });
          if (response.status !== 200) {
            setError("Attenzione servizio di registrazione non disponibile - contattare l'assistenza");
            return false;
          }
          return response.data.rc==="1";
        }
        catch (err) {
          alert(err);
          return false;
        }
      }

      function isNumber(char) {
        if (typeof char !== 'string')  return false;
          if (char.trim() === '') 	    return false;
          return !isNaN(char);
      }
      return (
      <>
      <div style= {{backgroundColor: '#fffffe', textAlign: 'center', height: '100vh'}}>
              
      <img src={process.env.PUBLIC_URL + "/assets/layout/images/logosonia.png"}
          style={{marginTop: '60px', marginBottom:'60px',width:'20%' }}
          alt='logo' />

            <div style={{marginBottom: 20}}>
              <Input 
              style={{width: '25%', minWidth:250, border: '1px solid grey', fontSize:'1.3em', borderRadius: 5, height: 60}}
              icon='user' 
              iconPosition='left' 
              placeholder='Codice operatore'
              name="idOperatore"
              value={values.idOperatore}
              onChange={handleChange}
              onKeyDown={onKeyDownOper}
              ref={inputUserRefOperatore} />  
            </div>

            <div>
              <Input 
              style={{width: '25%',minWidth:250,border: '1px solid grey', fontSize:'1.3em',borderRadius: 5, height: 60}}
              icon='barcode' 
              iconPosition='left' 
              placeholder='Barcode'
              name='codNat'
              value={values.codNat}
              onChange={handleChange} 
              onKeyDown={onKeyDownRiga}
              ref={inputUserRefRiga}   
              />  
            </div>

            <div style={{marginTop: 30}}>
            { 
              loading ? 
            <h2> ...verify ...</h2>
              :
            <h2>
              
            </h2>
            }
            </div>
            
            <div style={{marginTop: 30,color:"#34eb55",fontWeight:'bold',fontSize:'1.6em'}}>
            {msg} 
            </div>
            <div style={{marginTop: 0,color:"red",fontWeight:'bold',fontSize:'1.6em'}}>
            {error} 
            </div>
            
            <div style={{marginTop: 10 }}>
            <button className="huge ui button"  
              onClick={handleReset} style={{cursor:'pointer',borderRadius:20,backgroundColor:'#ECBFC2'}}>Reset</button>
            </div>
            <AppNumAddetti open={open} setOpen={setOpen} setNumAddetti={setNumAddetti} handleReset={handleReset}/>
          </div>
        
        </>
      )
}