import React, {
  useState,
  useMemo,
  useCallBack,
  useEffect,
  useRef,
} from "react";
import "./MainPanel.css";
import { Button, Checkbox, Form } from "semantic-ui-react";
import { apiRequest, jAlert, log } from "api";
import { Icon } from 'semantic-ui-react';

export const AbilEdit = (props) => {
  const [error, setError] = useState("");
  const [row, setRow] = useState([]); // lista funzioni disponibili
  const [rowSetted, setRowSetted] = useState([]); //lista funzioni già aggiunte alla abilitazione
  
  const { currentItem, reloadList } = props;
  const [values, setValues] = useState({
    id: null,
    ablCode: "",
    ablCodeDesc: "",
  });

  useEffect(() => {
    if (!!currentItem) {
      setValues(currentItem);
      riceviDatiFunzioni();
      riceviDatiFunzioniSetted();
    } 
  }, [currentItem]);
  // pulisce dati in prmo accesso
  useEffect(() => {
    clearVariables();
  }, []);

  const handleChange = (e, { name, value }) => {
    setError('');
    let newArray = { ...values, [name]: value };
    setValues(newArray);
  };

  const riceviDatiFunzioni = async() =>{ 
    const response = await apiRequest({
        method: "GET",
        url: "/userfunction"
    });
    if (response.status !== 200) {
        setError('operazione fallita')
    }   else {
        setRow(response.data);
    }
};

const riceviDatiFunzioniSetted = async() =>{ 
 
  const response = await apiRequest({
      method: "GET",
      url: "/usergrouplist_setted/"+currentItem.id
  });
  if (response.status !== 200) {
      setError('operazione fallita')
  }   else {
      setRowSetted(response.data);
  }
};
  const clearVariables = () => {
    setValues({ ...values, id: null, ablCode: "", ablCodeDesc: "" });
  };

  const inviaDati = async () => {
    const response = await apiRequest({
      method: "POST",
      url: "/usergroup",
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
    if (values.ablCode.trim()=== "" || values.ablCodeDesc.trim()=== "") {
      setError('Tutti i campi devono essere completi');
    } 
    else {
      inviaDati();
    }
  };

  const eliminaDati = async () => {
    const response = await apiRequest({
      method: "DELETE",
      url: "/usergroup/" + values.id,
    });
    if (response.status !== 200) {
      setError("operazione fallita");
    }
  };

  const addGroup = async (idAbl, idFunz) => {
    const groups= {
      idAbl: idAbl,
      idFunz: idFunz
    };
   
    const response = await apiRequest({
      method: "POST",
      url: "/usergrouplist",
      data: groups
    });

    if (response.status !== 200) {
      setError("operazione fallita");
    }
    riceviDatiFunzioniSetted();
  };

  const deleteGroup = async (idFunz) => {
    const response = await apiRequest({
      method: "DELETE",
      url: "/usergrouplist/" + idFunz,
    });

    if (response.status !== 200) {
      setError("operazione fallita");
    }
    riceviDatiFunzioniSetted();
  };

  const eliminaDatiAction = async (aId) => {
    if(!window.confirm('Sei sicuro di voler cancellare?')) return;
    await eliminaDati(aId).then(() => clearVariables() + reloadList());
  };

  // bottone - se gia' impostata 
  const btSelect = (idAbl, idFunz) => {
    const isJustSetted=rowSetted.find(v => v.idFunz === idFunz);
    if (!isJustSetted){
    return <Button class="ui yellow button" compact icon='add' style={{backgroundColor: "#d14119"}} onClick={()=>addGroup(idAbl, idFunz)}></Button>
    } else {
      return <Button class="ui yellow button" compact icon='minus' style={{backgroundColor: "#97cca6"}} onClick={()=>deleteGroup(isJustSetted.id)}></Button>
    }
  };

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
      <Form>
        <Form.Group>
          <Form.Input
            label="Tipo"
            name="ablCode"
            value={values.ablCode.toUpperCase()}
            onChange={handleChange}
            style={{ width: "110px" }}
          />

          <Form.Input
            label="Descrizione"
            name="ablCodeDesc"
            value={values.ablCodeDesc}
            onChange={handleChange}
            style={{ width: "310px" }}
          />
        </Form.Group>

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
        <div
          className="divMain"
          style={{
            display: "table-row",
            width: "50%",
            textAlign: "center",
            padding: 5,
          }}
        >
          <Button className="primary" onClick={inviaDatiAction} style={{ marginRight: 10, marginTop: 186,width: 120 }}>
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
          <Button className="primary" onClick={inviaDatiAction} style={{ marginRight: 10, width: 120 }}>
          <Icon name='pencil'  />
            Modifica{" "}
          </Button>
          <Button secondary onClick={eliminaDatiAction}  style={{ marginRight: 10, width: 120 }}
          >
            {" "}
            <Icon name='trash alternate outline'  />
            Elimina{" "}
          </Button>

          <Button  onClick={clearVariables} style={{ marginLeft: 50,  width: 120 }}>
          <Icon name='add'  />
            Nuovo{" "}
          </Button>

          <div className="divMain"
           style={{
              textAlign: "left",
              height: 180,
              border: "0px solid blue",
              marginTop: 30
            }}
          >
            <div style={{ overflow: "auto", height: 290, border: "1px solid grey", borderRadius: 5, backgroundColor: 'white', padding: 10 }}>
              <ul style={{listStyleType: "none",padding:0}}>
			      	{row.map((item,index) => {
              return (
							<li key={index} className="liList">		
							<div className="divMain">
							<div className="divRow" style={{borderBottom:'1px solid red'}}>
							<div className="divCell" style={{width:'80%'}}>{item.full}</div>
							<div className="divCell" style={{width:'20%',textAlign:'center'}}>{btSelect(values.id, item.id)}</div>
							</div>
							</div>
							</li>
							)})
            }
				</ul>	
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
