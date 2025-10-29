import React, {
  useState,
  useEffect,
} from "react";
import "./MainPanel.css";

import { Button,   Form, TextArea } from "semantic-ui-react";
import { apiRequest, jAlert, log } from "api";
import { Icon } from 'semantic-ui-react';
import LoadingOverlay from 'components/LoadingOverlay';
 
export const TaskEdit = (props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading]= useState(false);
  const { currentItem, reloadList,setItem } = props;
  const [values, setValues] = useState({
    id: null,
    desc: "",
  });

  const [log, setLog] = useState([]);

  useEffect(() => {
    if (currentItem) {
       setValues(currentItem);
       goTask(currentItem);
    } 
  }, [currentItem]);
  
 
  const goTask = async(aTaskId) =>{
    setItem("");
    setError('operazione iniziata ......');
    setIsLoading(true);

    const response = await apiRequest({
        method: "GET",
        url: "/task/"+aTaskId
    });
    setIsLoading(false);
    if (response.status !== 200) {
        setError('operazione fallita')
    }   else {
        setError('operazione conclusa');
        setLog(response.data.rows);
    }
};
  const clear = () => {
    setValues({ ...values, id: null, desc:""  });
    setLog([]);
    setError("");
  };

  return (
    <div
      className="divMain"
      style={{
        backgroundColor: "white",
        height: "100%",
        padding: 10,
        marginTop: 20,
        border: "0px solid red",
      }}
    >
      <Form>
        <div style={{overflow:'auto',height:400}}>
        {  
          log.map((item,index) => {
          return <div style={{heigh:12}} key={index}>({index})  {item}</div>   
          })
        }
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
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "1.2em",
                  border:'1px solid black'
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </Form>

        <div
          className="divMain"
          style={{
            display: "table-row",
            width: "50%",
            textAlign: "center",
            padding: 5,
          }}
        >
          <Button className="primary" onClick={(e)=> clear()} style={{ marginRight: 10, width: 120 }}>
          <Icon name='check'  />Clear 
          </Button>
          { isLoading &&
					<LoadingOverlay mode={'orange'} showTxt={'Executing job..'}/>
           }
        </div>
      
      
    </div>
  );
};
