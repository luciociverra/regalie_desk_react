import React, { useState, useEffect } from "react";
import { apiRequest,jAlert } from "api";
function NatAperte() {
  const [lista, setLista] = useState([]);
 
  const aggiornaLista = async () => {
    try {
     const response = await apiRequest({
                   method: "GET",
                   url: "/regalie_aperte",
                   user: 'pc-tempi_regalie'
                 });
      setLista(response.data);
    } catch (error) {
      console.error("Errore aggiornamento lista:", error);
    } finally {
    }
  };

  useEffect(() => {
    // Primo caricamento
    aggiornaLista();
    // Aggiornamento ogni 20 secondi
    const interval = setInterval(() => {
      aggiornaLista();
    }, 20000);
    // Pulizia timer quando il componente viene smontato
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
    <p></p><p style={{fontSize:18}}>attività aperte (si aggiorna ogni 20 secondi)</p><p></p>
    <div style={{marginTop:40,margin: '0 auto',width:500}}>
      <table style={{
      border: '1px solid black',
      borderCollapse: 'collapse',
      fontFamily: 'Verdana',
      fontSize: '16px',
      width: '100%'
    }}>
      <tbody>
        <tr style={{backgroundColor:'#f1f1c1',color:'black'}}>
            <td style={{ border: '1px solid black', padding: '6px', width: 150 }}>operatore</td>
            <td style={{ border: '1px solid black', padding: '6px', width: 200 }}>nat</td>
            <td style={{ border: '1px solid black', padding: '6px', width: 40 }}>qta</td>
            <td style={{ border: '1px solid black', padding: '6px', width: 150 }}>iniziato il</td>
        </tr>

        {lista.map((item) => (
          <tr key={item.id}>
            <td style={{ border: '1px solid black', padding: '6px'   }}>
              {item.idOperatore}
            </td>
            <td style={{ border: '1px solid black', padding: '6px' }}>
              {item.codNat} 
            </td>
              <td style={{ border: '1px solid black', padding: '6px'}}>
              {item.qta}
            </td>
            <td style={{ border: '1px solid black', padding: '6px'}}>
              {item.dataInizio}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <br/>
    <center><a href="#" onClick={()=>aggiornaLista()}> AGGIORNA SUBITO</a></center>
    </div>
    </div>
  );
}

export default NatAperte;