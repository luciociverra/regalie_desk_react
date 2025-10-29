import React, {
  useState,
  useEffect,
} from "react";
import moment from "moment";
import axios from "axios";
import "./MainPanel.css";
import LoadingOverlay from 'components/LoadingOverlay';
import { Button,Form,Radio,Input,Icon} from "semantic-ui-react";
import { apiRequest, jAlert, log } from "api";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
 
export const OrderImport= (props) => {
  const [file, setFile] = useState(null);
  const hiddenFileInput = React.useRef(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading]= useState(false);
  
  //CREA NUOVO EVADI
  const [tipiOrdine, setTipiOrdine] = useState([]);
  const [currentTipoOrdine, setCurrentTipoOrdine] = useState('OC');
  //
  //CREA NUOVO EVADI
  const [orderType, setOrderType] = useState('nuovo');
  const handleOrterType = (e, { value }) => setOrderType(value);

  const [dateOrd, setDateOrd] = useState('');
//  const handleDatesChange = (event, data) => setDateOrd(data.value);
  const handleDatesChange = (event, data) =>{ 
    try {setDateOrd(moment(String(data.value)).format('YYYY-MM-DD'));
    } catch(e) {}
  }
  
 
  const [flagDividi, setFlagDividi] = useState('S');
  const handleFlagDividi = (e, { value }) => setFlagDividi(value);
  //
  const [evadiOrd, setEvadiOrd] = useState('');
  // 
  const [custOrd, setCustOrd] = useState('C009773');
  // 
  useEffect(()=>{
		caricaTipiOrdine();
    },[])
  //
  const handleHiddenChange = event => {
    const fileUploaded = event.target.files[0];
    setFile(fileUploaded);
  };
   
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const inviaDati = () => {
   setError("");
   if(isEmpty(custOrd)) { setError("Manca il codice cliente"); return; }
   if(isEmpty(dateOrd)) { setError("Manca la data ordine"); return; }
   if(orderType==="evasione" && isEmpty(evadiOrd))
      { setError("Manca l'ordine da evadere"); return;}
   if (!file)
      { setError("Manca la selezione del file da inviare"); return; }
   inviaDatiAction();
  }
  const caricaTipiOrdine = async() =>{
    const response = await apiRequest({
        method: "GET",
        url: "/tipiordine"
    });
    if (response.status !== 200) {
        setError('tipi ordine non caricati')
    }   else {
        setTipiOrdine(response.data);
    }
};
  function isEmpty(string) {
    return typeof string === 'string' && string.trim().length === 0;
  }
  
  const inviaDatiAction = () => {
    log("upload a order file "+file);
    props.setResponseData([]);
    setIsLoading(true);
    const formData = new FormData();
    
    formData.append("orderTypeCode", currentTipoOrdine);
    formData.append("custOrd", custOrd);
    formData.append("dateOrd", dateOrd);
    formData.append("evadiOrd", evadiOrd);
    formData.append("orderType", orderType);
    formData.append("flagDividi",flagDividi);
    formData.append("file", file);
  
    axios
    .post(process.env.REACT_APP_HOST+'/api/uplorder', formData)
    .then((res) => {
      props.setResponseData(res.data);
      setIsLoading(false);
    })
    .catch((err) => {alert("File Upload Error "+err); setIsLoading(false)});
  };
     
 
  return (
    <>
    <div className="padding15" style={{width:520,height:350,display:'table',border:'1px solid black'}}>
    <div style={{display:'table-row',padding:5}}>
			<div style={{width:'40%',display:'table-cell',textAlign:'left'}}>Tipo ordine</div>	
			<div style={{width:'60%',display:'table-cell',textAlign:'left'}}>
      <select className="ui dropdown" value={currentTipoOrdine} onChange={(e)=> setCurrentTipoOrdine(e.target.value)}>
      {
          tipiOrdine.map((elem)=> { 
          return(<option value={elem.code}>{elem.code} - {elem.description}</option>)
      })
      }
      </select>
      </div>
      </div>

			<div style={{display:'table-row',padding:5}}>
			<div style={{width:'40%',display:'table-cell',textAlign:'left'}}>Codice cliente</div>	
			<div style={{width:'60%',display:'table-cell',textAlign:'left'}}>
       <Input value={custOrd} onChange={(e) => setCustOrd(e.target.value)} style={{width:200}}/>
      </div>
      </div>

      <div style={{display:'table-row'}}>
			<div style={{display:'table-cell',textAlign:'left'}}>Data consegna</div>	
			<div style={{display:'table-cell',textAlign:'left'}}>
      <SemanticDatepicker onChange={handleDatesChange} type="basic" locale="it-IT" format="DD/MM/YYYY" /> 
      </div>
      </div>
      {/** */} 
      <div style={{display:'table-row'}}>
			 <div style={{display:'table-cell',textAlign:'left'}}>
       <Button onClick={handleClick}>Seleziona file Excel</Button>
       <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleHiddenChange}
        style={{ display: 'none' }}
      />
      </div>    
      <div style={{display:'table-cell',textAlign:'left'}}>
      <p>{file && `${file.name}`}</p>
      </div>    
      </div> 
      {/** */}  
      <div style={{display:'table-row'}}>
      <div style={{display:'table-cell',textAlign:'left'}}>Tipologia</div>	  
			<div style={{display:'table-cell',textAlign:'left'}}>
      <Form>
        <Form.Field>
          <Radio
            label='Nuovo ordine'
            name='radioGroup'
            value='nuovo'
            checked={orderType === 'nuovo'}
            onChange={handleOrterType}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Evadi ordine esistente'
            name='radioGroup'
            value='evasione'
            checked={ orderType === 'evasione'}
            onChange={handleOrterType}
          />
        </Form.Field>
      </Form>
      </div>	
		  </div>
      {/** attenzione  */}
      { orderType==="evasione" &&
      <>
      <div style={{display:'table-row',padding:5}}>
			<div style={{width:'40%',display:'table-cell',textAlign:'left'}}>Ordini da evadere</div>	
			<div style={{width:'60%',display:'table-cell',textAlign:'left'}}>
       <Input value={evadiOrd} onChange={(e) => setEvadiOrd(e.target.value)} style={{width:200}}/>
      </div>
      </div>

        <div style={{display:'table-row'}}>
          <div style={{display:'table-cell',textAlign:'left',vAlign:'top'}}>Dividi cartoni e pezzi</div>	  
          <div style={{display:'table-cell',textAlign:'left'}}>
           
              <Radio
                label='SI' name='radioGroup' value='S'
                checked={flagDividi === 'S'}
                onChange={handleFlagDividi}
                style={{paddingRight:20}}
              />
             
              <Radio
                label='NO' name='radioGroup' value='N'
                checked={ flagDividi === 'N'}
                onChange={handleFlagDividi}
              />
            
          </div>	
        </div>
        </>
       }
       
    </div>

    <div className="padding4" style={{width:450,display:'table',border:'0px solid black',paddingTop:10}}>
           <Button className="ui button" onClick={(event) => {
						  event.preventDefault()
							event.stopPropagation()
							inviaDati();
					 }} style={{width: 230, height: 35, backgroundColor: 'orange', color:'white',border: '1px solid black' }}>
						<Icon name='arrow up' style={{color: 'white'}}/>INVIA DATI</Button>	
		<p style={{fonSize:16,color:'red'}}>{error}</p>	
    </div>
    { isLoading &&
					<LoadingOverlay mode={'orange'} showTxt={'Executing job..'}/>
           }
    </>
);
}