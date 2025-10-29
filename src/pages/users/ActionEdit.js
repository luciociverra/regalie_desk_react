import React, {
  useState,
  useMemo,
  useCallBack,
  useEffect,
  useRef,
} from "react";
import "./MainPanel.css";
import { Button, Checkbox, Form, Icon } from "semantic-ui-react";
import { apiRequest, jAlert, jLog, log } from "api";

export const ActionEdit = (props) => {
  const [error, setError] = useState("");
  const { currentItem, reloadList } = props;
  const [rows, setRows] = useState([]);
  const [actionTypeList, setActionTypeList] = useState([
  {prog: 0, desc:"Non specificata"},
  {prog: 1, desc:"Menu 1° livello"},
  {prog: 2, desc:"Menu 2° livello"}
  ]);

  const [values, setValues] = useState({
    id: null,
    action: "",
    actionDesc: "",
    actionType:0
  });

  useEffect(() => {
    if (!!currentItem)
     setValues(currentItem);

  }, [currentItem]);
  // open window
  useEffect(() => {
    clearVariables();
  }, []);

  const handleChange = (e, { name, value }) => {
    setError('');
    let newArray = { ...values, [name]: value };
    setValues(newArray);
  };

  const clearVariables = () => {
    setValues({ ...values, id: null, action: "", actionDesc: "", actionType: 0 });
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
      url: "/userfunction",
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
    if (values.action.trim()=== "" || values.actionDesc.trim()=== "") {
      setError('Tutti i campi devono essere completi');
    } 
    else {
      inviaDati();
    }
  };

  const setType= (event)=>{
    setValues({ ...values, actionType: event.target.value });
};


  const eliminaDati = async () => {
    const response = await apiRequest({
      method: "DELETE",
      url: "/userfunction/" + values.id,
    });
    if (response.status !== 200) {
      setError("operazione fallita");
    }
  };

  const eliminaDatiAction = async (aId) => {
    if(true) {
      alert("Azione inibita per ragioni di sicurezza. Contattare Civerra Lucio");
      return;
    }
    if(!window.confirm('Sei sicuro di voler cancellare?')) return;
    await eliminaDati(aId).then(() => clearVariables() + reloadList());
  };

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
          <label>Azione</label>
          <Form.Input
            name="action"
            value={values.action.toUpperCase()}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Descrizione azione</label>
          <Form.Input
            name="actionDesc"
            value={values.actionDesc}
            onChange={handleChange}
          />
        </Form.Field>
        <div>
        <label>Tipologia azioni</label>
        <Form.Field>

        <select class="ui dropdown" style={{marginTop: 10}} value={!!values.actionType ? parseInt(values.actionType):0} onChange={(e)=> setType(e)} >
          {actionTypeList.map((item,index) => {
             return (                                
               <option key={index}  value={item.prog}>{item.desc}</option>
            )})
          }
        </select>
        </Form.Field>
        </div>

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

      {!values.id ? (
        <>

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
            style={{ marginRight: 10, marginTop: 110, width: 120 }}
          >
          <Icon name='check'  />
            Aggiungi{" "}
          </Button>
        </div>
        </>
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
            style={{ marginRight: 10, marginTop: 110, width: 120 }}
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
            style={{ marginLeft: 50, marginTop: 110, width: 120 }}
          >
             <Icon name='add'  />
            Nuovo{" "}
          </Button>
        </div>
      )}
    </div>
  );
};
