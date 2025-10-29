import React, { useState, useEffect, createRef } from "react";
import { Button, Input } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { log } from "api";

export const AppNumAddetti = ({ open, setOpen, setNumAddetti,handleReset }) => {

  const [localNum, setLocalNum] = useState("");
  const [error, setError] = useState("");
  const numAddettiRef = createRef();
  useEffect(() => {
    if(open) {
      setLocalNum("");
      setError("");
      numAddettiRef.current.focus();
    }
  }, [open]);

  const onKeyDownOper = (e) => {
    log(e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      if(numOk()) {
       setNumAddetti(localNum);
       setError("");
       closeOverlay();
      } else {
        setLocalNum("");
        setError("Numero addetti non valido !")
      }
    }
  };

  const numOk = () => {
    try {
      let v=parseInt(localNum);
      return v<21;
    } catch(e){
      return false;
    }
  };

  const handleChange = (e, { name, value }) => {
    log("handleChange " + value);
    setLocalNum(value);
  };

  const closeOverlay = () => {
    setOpen(false);
  };

  const resetProcess = () => {
    setOpen(false);
    handleReset();
  };

  return (
    <Modal
      className="desk-overlay-panel"
      //mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
      size="mini"
      onClose={() => closeOverlay()}
      poppermodifiers={[
        {
          name: "preventOverflow",
          options: {
            boundariesElement: "window",
          },
        },
      ]}
      open={open}
    >
      <div
        style={{
          textAlign: "center",
          width: "100%",
          border: "px solid black",
          padding: 10,
          height: 300,
          backgroundColor:'#ECBFC2',
          marginTop: 0,
          overflowY: 'none', overflowX: 'none'
        }}
      >
        <p style={{fontWeight:'bold',fontSize:20}}>NUMERO ADDETTI</p>

        <Input
          style={{ width: '25%', minWidth: 150, border: 'px solid grey', fontSize: '1.3em', borderRadius: 5, height: 60 }}
          icon='users'
          iconPosition='left'
          placeholder='Numero'
          name="numAddetti"
          value={localNum}
          onChange={handleChange}
          onKeyDown={onKeyDownOper}
          ref={numAddettiRef} />

        <div style={{ marginTop: 40,textAlign:'center',width:'100%' }}>
          <Button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              resetProcess();
            }}
            style={{
              backgroundColor: "#edede9",
              color: "black",
              width:140,
              border: "1px solid black",
            }}
          >
            Annulla operazione
          </Button>
        </div>
        <div style={{marginTop: 10,color:"red",fontWeight:'bold',fontSize:20}}>
           {error} 
          </div>
      </div>

    </Modal>
  );
};

