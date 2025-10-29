import React, { useState, useEffect, useRef } from "react";
import "./MainPanel.css";
import { apiRequest } from "api";

export const RepartiCmb = (props) => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getReparti();
  }, []);

  const getReparti = async () => {
    const response = await apiRequest({
      method: "GET",
      url: "/empzone",
    });
    if (response.status !== 200) {
      alert("recupero lista reparti operazione fallita");
    } else {
      setRows(response.data);
    }
  };
  return (
    <select
      className="ui dropdown"
      style={{ borderRadius: 5 }}
      value={props.currReparto}
      onChange={(e) => props.setReparto(e)}
    >
      <option value="">Tutti i reparti</option>
      {rows.map((item, index) => {
        return (
          <option key={index} value={item.id}>
            {item.zoneDesc} {item.zoneTime}
          </option>
        );
      })}
    </select>
  );
};
