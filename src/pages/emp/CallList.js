import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import moment from 'moment';
import 'moment/locale/it' ;
import "./MainPanel.css";
import { apiRequest, jAlert, log } from "api";
import { SessionContext } from "components/SessionContext";
import  { RepartiCmb} from "./RepartiCmb.js";
import { Button, Checkbox, Form, Icon, Input, Image } from "semantic-ui-react";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import LoadingOverlay from "components/LoadingOverlay";

export const CallList = (props) => {
  moment.locale('it')
  const [error, setError] = useState("");
  const [tmDefault,setTmDefault]=useState("");
  const [ntDefault,setNtDefault]=useState("");
  const { forceReload  } = props;
  const [list, setList] = useState([]);
  const [dates, setDates] = useState([]);
  const [zona, setZona] = useState(0);
  const [review, setReview] = useState(0);
  const [loading, setLoading] = useState(false);
  const {sessionInfo} = useContext(SessionContext);
  useEffect(() => {
    riceviDati();
  }, [forceReload,dates,zona]);

  useEffect(() => {
    log("review");
  }, [review]);

  const setReparto= (event)=>{
      setZona(event.target.value);
  };  
  const formatData= moment(dates).format("YYYY-MM-DD");
  
  const setTimeDefault = (e, { name, value }) => {
    setTmDefault(value.toUpperCase());
  };
  const setNotaDefault = (e, { name, value }) => {
    setNtDefault(value.toUpperCase());
  };


  const handleDatesChange = (event, data) => setDates(data.value);

  const changeFrom = (index, aValue) => {
    list[index].from=aValue;
    setReview(review +1);
  };
  const changeNota = (index, aValue) => {
    list[index].nota=aValue;
    setReview(review +1);
  };
  const changeChecked = (index) => {
    let oldValue=list[index].checked;
    if(oldValue ==="S")  
       list[index].checked= "N";
    else
       list[index].checked= "S";
       setReview(review +1);
   };

  const riceviDati = async () => {
    setLoading(true);
    let dataOut={zone:zona,date:moment(dates).format("YYYY-MM-DD")};
    const response = await apiRequest({
      method: "POST",
      user: sessionInfo.user,
      url: "emplist",
      data:dataOut
     //  url: "/turni/"+moment(dates).format("YYYYMMDD"),
    });
    if (response.status !== 200) {
      setError("operazione fallita");
    } else {
     //  jAlert(response.data);
      setList(response.data);
    }
    setLoading(false);
  };
 
  const invioMassivo = async() =>{
    setLoading(true);
    let listaturni= creaListaTurni()
   // jAlert(listaturni);
   const response = await apiRequest({
      method: "POST",
      url: "turni",
      data: listaturni,
      user: sessionInfo.user, 
    });

    if (response.status !== 200) {
        setError('operazione fallita')
    }   else {
        riceviDati();
    }
    setLoading(false);
  };

  const creaListaTurni= ()=>{
    let turniSelezionati= [];
    for (var item in list) {
      if (list[item].checked=== "S") {
        let turno = {"idEmp":list[item].id,"day": formatData, "phone":list[item].intPrefix+list[item].contactPhone ,
                     "time":list[item].from, "nota":list[item].nota };
        turniSelezionati.push(turno); 
      }
    }
    return turniSelezionati; 
  }    

  const impostaOraTutti = ()=>{
    if(tmDefault.length<4) { alert("Orario di default non corretto"); return;}
    const newArr = list.map(obj => {
      if (obj.checked === "S") {
        return {...obj, from:tmDefault};
      }
      return obj;
    });
    setList(newArr);
  }    

  const impostaNotaTutti = ()=>{
    const newArr = list.map(obj => {
      if (obj.checked === "S") {
        return {...obj, nota:ntDefault};
      }
      return obj;
    });
    setList(newArr);
  }

  const fleggaTutti = (aValue)=>{
    const newArr = list.map(obj => {
        return {...obj, checked:aValue };
    });
    setList(newArr);
  }
  
  return (
    <div
      className="divMain"
      style={{
        textAlign: "left",
        height: 300,
        maxHeight: 300,
        overflowY: "scoll",
        overflowX: "none",
        border: "0px solid blue",
      }}
    >
    <div>
       <label style={{marginRight: 10,fontWeight:'bold'}}>Giorno</label>
       <SemanticDatepicker onChange={handleDatesChange} type="basic"  format="DD/MM/YY" showToday= {true} locale="it-IT" />
       <label style={{marginRight: 10, marginLeft: 10,fontWeight:'bold'}}>Reparto</label>
       <RepartiCmb setReparto={setReparto} currReparto={zona}/>
    </div>

<div style={{display:'flex',paddingTop:10}}>
<label style={{fontWeight:'bold',marginRight:10,marginTop:10}}>
Orario inizio valido per tutti i collaboratori in lista (HH:MM) </label>
<Form.Input
            label=" "
            name="zoneTime"
            value={tmDefault} 
            onChange={setTimeDefault}
            style={{ width: "110px" }}
 />
  <Button
          style={{ width: 210, marginLeft:10,backgroundColor: "orange",cursor:'pointer',
          title:'Imposta a tutti i selezionati il medesimo orario di ingresso' }}
          onClick= {(e)=> impostaOraTutti()}
        >
          <Icon name="pin"   />
          <label style={{marginBottom: 10}}>Imposta orario a tutti</label> 
        </Button>
        </div>
        <div style={{display:'flex',paddingTop:10}}>
        <label style={{fontWeight:'bold',marginRight:10,marginTop:10}}>
Nota per tutti i collaboratori in lista</label>
<Form.Input
            label=" "
            name="zoneTime"
            value={ntDefault} 
            onChange={setNotaDefault}
            style={{ width: "300px" }}
 />
  <Button
          style={{ width:160, marginLeft:10,backgroundColor: "#f0e2d5",cursor:'pointer',
          title:'Imposta a tutti i selezionati la medesima nota' }}
          onClick= {(e)=> impostaNotaTutti()}
        >
          <Icon name="pin"   />
          <label style={{marginBottom: 10}}>Imposta a tutti</label> 
        </Button>   

         <Button
          style={{ width:180, marginLeft:120,backgroundColor: "#caffc2",cursor:'pointer',
          title:'Imposta tutti i flag di invio a <SI>' }}
          onClick= {(e)=> fleggaTutti("S")}
        >
          <Icon name="calendar check outline"   />
          <label style={{marginBottom: 10}}>Seleziona tutti</label> 
        </Button>    
        <Button
          style={{ width:180, marginLeft:10,backgroundColor: "#fccad9",cursor:'pointer',
          title:'Imposta tutti i flag di invio a <NO>' }}
          onClick= {(e)=> fleggaTutti("N")}
        >
          <Icon name="calendar times outline"   />
          <label style={{marginBottom: 10}}>De seleziona tutti</label> 
        </Button>           
</div>

      <div style={{marginTop: 30}}>

    {/* C:\Loison\loison_desk_react\public\assets\layout\images */}
      <div style={{fontWeight:'bold',fontSize:18,borderBottom:'2px solid black',
      borderTop:'2px solid black',width:210,textAlign:'center'}}> {moment(dates).format("dddd D MMMM YYYY")} </div> 
      
      <ul style={{ listStyleType: "none", padding: 0, marginTop: 10 }}>
        {list.length > 0 &&
          list.map((item, index) => {
            return (
              <li key={index} className="liList">
                <div className="divMain">                   
                  <div className="divRow">     
                  
                   <div className="divCell" style={{ width: "5%" }}>
                   {/*
                    <Image  src={process.env.PUBLIC_URL + "/assets/layout/images/face1.png"}  className="avatar" size="small" 
                    style={{ maxWidth:40}} circular />
                  */}
                   <Icon name="user" />
                    </div>
                    <div className="divCell" style={{ width: "10%", border: '0px solid red' }}>
                      {item.fullName}  
                    </div>
                    <div className="divCell" style={{ width: "20%", border: '0px solid red', paddingLeft: 20}}>
                      <label>dalle ore </label>
                    <Input value={item.from} onChange={(e)=>changeFrom(index, e.target.value)} style={{width: 70, marginRight: 10, marginLeft: 10}} placeholder= "orario inizio" /> 
                     {/*
                      <label>{""} alle {""} </label> 
                      <Input value={item.to} onChange={(e)=>changeTo(index, e.target.value)} style={{width: 70, marginLeft: 10}} placeholder= "orario fine" />
                     */}
                     {item.zoneDesc}
                    </div>
                   
                    <div className="divCell" style={{ width: "15%", border: '0px solid red' }}>
                   {item.intPrefix} -  {item.contactPhone}
                    </div>
                    <div className="divCell" style={{ display:'flex',width: "10%", border: '0px solid red' }}>
                     nota:
                     <Input value={item.nota} onChange={(e)=>changeNota(index, e.target.value)}
                      style={{width: 300, marginRight: 10, marginLeft: 10}} placeholder= "nota" /> 
                    </div>
                    <div
                      className="divCell"
                      style={{ width: "5%", textAlign: "center", border: '0px solid red', marginTop: 10 }}
                    >
                       <Checkbox value={item.checked} onChange={(e)=>changeChecked(index)}   checked={item.checked==='S'}/>
                    </div>
                    <div
                      className="divCell"
                      style={{ width: "10%", textAlign: "center", border: '0px solid red' }}
                    >
                      {/* 9 invio ok  */}
                      { item.esito ===1 &&
                       <><Icon name="thumbs down"  size='big' color="red"/> <span>In errore</span></>
                      }

                      { item.esito ===9 &&
                       <><Icon name="thumbs up"  size='big' color="green" title={"inviato da:"+item.sender +" in data "+item.datainvio}/>  Inviato</>
                      }
                      
                      { item.esito ===0 &&
                       <><Icon name="phone square"  size='big' color="orange"/> Da inviare</>
                      }
                       
                          
                    </div>
                    <div
                      className="divCell"
                      style={{ width: "10%", textAlign: "center", border: '0px solid red', marginTop: 10 }}
                    >
                      {item.orarioRichiesto && 
                       "Orario rich."
                      }
                    {item.orarioRichiesto}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      </div>
      <div
        className="divMain"
        style={{
          display: "table-row",
          width: "50%",
          textAlign: "center",
          padding: 5,
        }}
      >
        {! loading &&
        <Button
          style={{ width: 160, backgroundColor: "#25D366" ,cursor:'pointer'}}
          onClick= {(e)=> invioMassivo()}>
          <Icon name="whatsapp"   />
          <label style={{marginBottom: 10}}>Invia turni</label> 
        </Button>
        }
        { loading &&
        <p>Sending messages</p>
        }
      </div>
      {loading && (<LoadingOverlay mode={'large'} windowHeight={'100vh'}/>) }	
			
    </div>
  );
};
