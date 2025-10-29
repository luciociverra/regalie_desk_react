import React, {
    useState,
    useEffect,
    useRef,
  } from "react";
  import "./MainPanel.css";
  import { Button, Checkbox, Form, Icon } from "semantic-ui-react";
  import { apiRequest, jAlert, log } from "api";
  
  export const UserEdit = (props) => {
    const [error, setError] = useState("");
    const [rows, setRows] = useState([]);
    const {currentItem, reloadList} = props;
    const [values, setValues] = useState({
      id: null,
      userName: "",
      userDesc: "",
      statusActive: true,
      roles: "",
    });

    useEffect(() => {
      clearVariables();
    }, []);
  
    useEffect(()=>{
      if (!!currentItem)
         setValues(currentItem);
      getRoles();  
    },[currentItem]);
  
  
    const handleChange = (e, { name, value }) => {
      setError('');
      let newArray = { ...values, [name]: value };
      setValues(newArray);
    };
  
    const clearVariables = ()=>{
      log("clear variables");
      setError("");
      setValues({ ...values, id: null, userName: "", userDesc:"", statusActive: true, roles: "" });
    };
    const setRole= (event)=>{
        setValues({ ...values, roles: event.target.value });
    };

    const getRoles = async () => {
    const response = await apiRequest({
      method: "GET",
      url: "/usergroup",
      data: values,
    });
    if (response.status !== 200) {
      setError("operazione fallita");
    } else { 
      setRows(response.data);
    }
    };
  
    const inviaDati = async () => {
      const response = await apiRequest({
        method: "POST",
        url: "/userdata",
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
      if (values.userName.trim()=== "" || values.userDesc.trim()=== "" || values.roles.trim()=== "") {
        setError('Tutti i campi devono essere completi');
      } 
      else {
        inviaDati();
      }
    };
  
  
    const eliminaDati = async () => {
      const response = await apiRequest({
        method: "DELETE",
        url: "/userdata/" + values.id
  
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
          <Form.Field>
            <label>Codice</label>
            <Form.Input
              name="userName"
              value={values.userName}
              onChange={handleChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Descrizione utente</label>
            <Form.Input
              name="userDesc"
              value={values.userDesc}
              onChange={handleChange}
            />
          </Form.Field>

          <Form.Field>
          <label>Stato corrente</label>
          <div className="ui toggle checkbox loison">
            <input type="checkbox" name="public" checked={values.statusActive} onChange={()=>changeStatusSwitch()} /> 
            <label>Non Attivo / Attivo</label>
          </div>
          </Form.Field>
          

          <Form.Field>
          <label>Gruppo di abilitazioni</label>
          <select className="ui dropdown" style={{marginTop: 20}} value={!!values.roles ? parseInt(values.roles):''} onChange={(e)=> setRole(e)} >
            <option value="">Gruppo</option>
            {rows.map((item,index) => {
               return (                                
                 <option key={index}  value={item.id}>{item.ablCode}</option>
              )})
            }
          </select>
          </Form.Field>


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
              icon= 'check'
              className="primary"
              onClick={inviaDatiAction}
              style={{ marginRight: 10, marginTop: 50, width: 120 }}
            >
              <Icon name='check'  />
              Aggiungi{" "}
            </Button>
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
  