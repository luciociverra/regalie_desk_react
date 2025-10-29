import React, { useState,useEffect,useContext } from 'react';
import moment from "moment";
import { Button, Icon, Form, Table } from 'semantic-ui-react';
import {apiRequest,jAlert,log,jLog} from "api";
import {SessionContext} from "components/SessionContext";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
/*
  https://codesandbox.io/s/y2o1okoo99
*/
import "./logs.css";
 
export default function LogsView() {
  const [list, setList] = useState(null);
  const [error, setError] = useState([]);
  const [utenti, setUtenti] = useState([]);
  const [eventi, setEventi] = useState([]);
  const [dates, setDates] = useState([]);
  const {sessionInfo, logOff ,isAuthorized,haveMainMenu} = useContext(SessionContext);
  const handleDatesChange = (event, data) => setDates(data.value);
 
  const [values, setValues] = useState({
    user: "",
    event: "",
    status: "",
    dtInit: moment(new Date()).format("YYYY-MM-DD"),
    dtEnd: moment(new Date()).format("YYYY-MM-DD"),
  });
  
    useEffect(()=>{
      getParams();
      riceviEventi();
    },[]);
    
    const setParam= (name, event)=>{
      setValues({ ...values, [name]: event.target.value });
    };

    const getParams = async () => {
      const response = await apiRequest({
        method: "GET",
        url: "/logsparams",
      });
      if (response.status !== 200) {
        setError("operazione fallita");
      } else { 
        setUtenti(response.data.users);
        setEventi(response.data.events);
      }
      };

    const riceviEventi = async() =>{
      setError("");
      const response = await apiRequest({
        method: "POST",
        url: "/logslist",
        data: values,
        user: sessionInfo.user,
      });
      if (response.status !== 200) {
         setError('operazione fallita')
      }   else {
          setList(response.data);
      }
    };

    const cercaAction = async ()=>{ 
      if (! dates.length) {
        setError("data non impostata"); return;
      }
       
      values.dtInit= moment(dates[0].toString()).format("YYYY-MM-DD");
       if (dates.length>1) {
        values.dtEnd=  moment(dates[1].toString()).format("YYYY-MM-DD");
       } 
       else {
        values.dtEnd= moment(dates[0].toString()).format("YYYY-MM-DD");
       }
      const esito=await riceviEventi();
    }
     
    let date =["2022-07-25T22:00:00.000Z","2022-07-27T22:00:00.000Z"];
    
    
  return (
   <>
   <div>
      
    </div>
    <div className="divMain" style={{maxWidth:600,paddingLeft:10}}>
    
    <div className="divRow">
    <div className="divCell">Seleziona range di date</div>
    <div className="divCell">Tipologia</div>
    <div className="divCell">Utente</div>
    <div className="divCell">Evento</div>
    <div className="divCell"></div>
    </div>

    <div className="divRow">
    <div className="divCell">
    <SemanticDatepicker onChange={handleDatesChange} type="range"  format="DD/MM/YY" /></div>
    <div className="divCell"> 
          <select className="ui dropdown" style={{marginTop: 20}} value={values.status} onChange={(e)=> setParam('status', e)} >
            <option value="">Tutti</option>
                 <option key={1}  value={'E'}>Errori</option>
                 <option key={2}  value={'A'}>Corretta</option>
          </select> 
    </div>

    <div className="divCell"> 
          <select className="ui dropdown" style={{marginTop: 20}} value={values.user} onChange={(e)=> setParam('user', e)} >
          <option value="">Tutti</option>
          {utenti.map((users,indexUser) => {
               return (                                
                 <option key={indexUser} >{users}</option>
              )})
            }
          </select>
    </div>

    <div className="divCell"> 
          <select class="ui dropdown" style={{marginTop: 20}} value={values.event}  onChange={(e)=> setParam('event', e)} >
          <option value="">Tutti</option>
          {eventi.map((events, indexEven) => {
               return (                                
                 <option key={indexEven}>{events}</option>
              )})
            }
          </select>
     </div> 
    <div className="divCell"> 
      <Button
            className="primary"
            style={{ marginRight: 10, marginTop: 10, width: 120 }}
            onClick={()=>cercaAction()}
          >
          <Icon name='search'  />
            Cerca{" "}
      </Button>
    </div>

    </div>
    <div className="divRow" style={{color:'red',fontSize:16,pddingLeft:20}}>
      {error}
    </div>  
    </div>
  
 
    
    <div style={{overflowY:'auto',border: '1px solid grey', marginTop: 15, width: 'auto',height:'80%'}}>
    
    <Table striped>
      <Table.Header>
        <Table.Row>
        <Table.HeaderCell>Data</Table.HeaderCell>
        <Table.HeaderCell>Utente</Table.HeaderCell>
        <Table.HeaderCell>Esito</Table.HeaderCell>
        <Table.HeaderCell>Evento</Table.HeaderCell>
        <Table.HeaderCell>Descrizione</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      {list && list.length && (    
      <Table.Body>

        {list.map((item, index)=>  
        <Table.Row key={index}>
        <Table.Cell>{moment(item.eventDate). format("YYYY-MM-DD HH:mm:ss")}</Table.Cell>
        <Table.Cell>{item.eventUser}</Table.Cell>
        <Table.Cell>
        {item.eventStatus=== 'E' ? ( 
          <Icon name= "dot circle" color= "red"></Icon>
        ) : (
          <Icon name= "dot circle" color= "green"></Icon> 
        )}
        </Table.Cell>
        <Table.Cell>{item.eventName}</Table.Cell>
        <Table.Cell>{item.eventText}</Table.Cell>
        
        </Table.Row>
        )}
        </Table.Body>
		  )}
    </Table>
    </div>
			


</>
  );
}
