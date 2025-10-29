import React, { useState, useEffect,useContext } from "react";
import {SessionContext} from "components/SessionContext";
  
  import "./MainPanel.css";
  import  { RepartiCmb } from "./RepartiCmb.js";
  import { Button, Checkbox, Form, Icon } from "semantic-ui-react";
  import { apiRequest, jAlert, log } from "api";
  
  export const UserEdit = (props) => {
    const {sessionInfo} = useContext(SessionContext);
    const [error, setError] = useState("");
    const {currentItem, reloadList} = props;
    const [values, setValues] = useState({
      id: null,
      name: "",
      surname: "",
      intPrefix: "39",
      contactPhone: "",
      homePhone: "",
      email: "",
      zone: 0,
      notes: "",
      statusActive: true,
      roles: "",
    });

    useEffect(() => {
      clearVariables();
    }, []);
  
    useEffect(()=>{
      if (!! currentItem) //selezionato DA LISTA
      {
         setValues(currentItem);
       } 
    },[currentItem]);
  
  
    const handleChange = (e, { name, value }) => {
      setError('');
      let newArray = { ...values, [name]: value };
      setValues(newArray);
    };
  
    const [depa, setDepa] = useState({
      id: null,
      zoneDesc: "",
      zoneTime: "",
    });

    const clearVariables = ()=>{
      log("clear variables");
      setValues({ ...values,
         id: null,
         name: "",
         surname:"",
         intPrefix: "39",
         contactPhone:"", 
         homePhone:"",
         email:"",
         zone: 0,
         notes:"",
         statusActive: true, 
         roles: "" });
    };
    const setReparto= (event)=>{
        setValues({ ...values, zone: event.target.value });
    };

    const inviaDati = async () => {
      const response = await apiRequest({
        method: "POST",
        user: sessionInfo.user,
        url: "/employee",
        data: values,
      });
      if (response.status !== 200) {
        setError("operazione fallita");
      } else { 
          reloadList(); 
          clearVariables();
      }
    };

    const inviaDatiAction = ()=>{
      if (values.name.trim()=== "" || values.surname.trim()=== "" || values.intPrefix.trim()=== ""
          || values.contactPhone.trim()=== "")  {
        setError('Tutti i campi devono essere completi');
      } 
      else {
        inviaDati();
      }
    };
  
    const eliminaDati = async () => {
      const response = await apiRequest({
        method: "DELETE",
        user: sessionInfo.user,
        url: "/employee/" + values.id
  
      });
      if (response.status !== 200) {
        setError("operazione fallita");
      }
    };
  
    const eliminaDatiAction = async (aId) => {
      if(!window.confirm('Sei sicuro di voler cancellare?')) return;
        await eliminaDati(aId).then(()=> clearVariables()+reloadList());
    };

    const changeStatusSwitch = ()=>{
        if(values.statusActive){
            setValues({ ...values, statusActive:false });
        } else {
            setValues({ ...values, statusActive:true });
        }
    }
  
    return (
      <div
        className="divMain"
        style={{
          backgroundColor: "white",
          height: "100%",
          padding: 30,
          border: "px solid red",
        }}
      >
        <Form>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Nome</label>
            <Form.Input
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Cognome</label>
            <Form.Input
              name="surname"
              value={values.surname}
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>

        <Form.Group >
        <Form.Field>
            <label>Suff.</label>
            <Form.Input
              name="contactPhone"
              value={values.intPrefix}
              onChange={handleChange}
              style={{width: 60}}
            />
          </Form.Field>
          
          <Form.Field>
            <label>Telefono</label>
            <Form.Input
              name="contactPhone"
              value={values.contactPhone}
              onChange={handleChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Telefono fisso</label>
            <Form.Input
              name="homePhone"
              value={values.homePhone}
              onChange={handleChange}
            />
          </Form.Field>
          </Form.Group>


        <Form.Group widths='equal'>
          <Form.Field>
            <label>Email</label>
            <Form.Input
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </Form.Field>

          <Form.Field>
          <label>Reparto</label>
           <RepartiCmb setReparto={setReparto} currReparto={!!values.zone ? parseInt(values.zone):''}/>
          </Form.Field>

          </Form.Group>

          <Form.Field>
          <label>Stato corrente</label>
          <div className="ui toggle checkbox loison">
            <input type="checkbox" name="public" checked={values.statusActive} onChange={()=>changeStatusSwitch()} /> 
            <label>Non Attivo / Attivo</label>
          </div>
          </Form.Field>

          <Form.TextArea name="notes" label='Note' placeholder=''  value={values.notes}  onChange={handleChange}/> 

          <div className="divMain">
            <div
              style={{
                display: "table-cell",
                width: "50%",
                textAlign: "center",
                padding: 5,
              }}
            >
              {error !== "" && (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "red",
                    color: "white",
                    fontSize: "1.2em",
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        </Form>
  
        {! values.id ? (
          <div
            className="divMain"
            style={{
              display: "table-row",
              width: "50%",
              textAlign: "center",
              padding: 5,
            }}
          >
            <Button
              className="primary"
              onClick={inviaDatiAction}
              style={{ marginRight: 10, marginTop: 50, width: 120 }}
            >
              <Icon name='check'  />Aggiungi</Button>
          </div>
        ) : (
          <div
            className="divMain"
            style={{
              display: "table-row",
              width: "50%",
              textAlign: "center",
              padding: 5,
            }}
          >
              
            <Button
              className="primary"
              onClick={inviaDatiAction}
              style={{ marginRight: 10, marginTop: 50, width: 120 }}
            >
               <Icon name='pencil'  />
              Modifica{" "}
            </Button>
            <Button
              secondary
              onClick={eliminaDatiAction}
              style={{ marginRight: 10, width: 120 }}
            >
              {" "}
              <Icon name='trash alternate outline'  />
              Elimina{" "}
            </Button>
  
            <Button
              onClick={clearVariables}
              style={{ marginLeft: 40, marginTop: 50, width: 120 }}
            >
              <Icon name='add'  />
              Nuovo{" "}
            </Button>
          </div>
        )}
      </div>
    );
  };
  