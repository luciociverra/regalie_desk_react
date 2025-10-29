import React, {
  useState,
  useEffect,
  useRef,
  useContext
} from "react";
import "./MainPanel.css";
import { Button, Checkbox, Form, Icon, Input, Item } from "semantic-ui-react";
import {SessionContext} from "components/SessionContext";
import { ActionEdit } from "./ActionEdit";
import { ActionList } from "./ActionList";
import { AbilEdit } from "./AbilEdit";
import { AbilList } from "./AbilList";
import { jAlert,log } from "api";
import { UserList } from "./UserList";
import { UserEdit } from "./UserEdit";
import { TaskList } from "./TaskList";
import { TaskEdit } from "./TaskEdit";
import { OrderImport } from "./OrderImport";
import { OrderImportLog } from "./OrderImportLog";
export const MainPanel = (props) => {
  const [error, setError] = useState("");
  const [search, setSearch] = useState(null);
  const searchRef = useRef();
  const [currentItem, setCurrentItem] = useState(null);
  const [forceReload, setForceReload] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const {isAuthorized} = useContext(SessionContext);
  const {tabIndex,showSearchInput} = props;
  const calculateHeight = () => {
    return 500;
  };

  const setItem = (item) => {
    setCurrentItem(item);
  };

  const reloadList = () => {
    setCurrentItem(null);
    setForceReload(forceReload + 1);
  };

  useEffect(() => {
      log("MainPanel useEffect");
  }, [currentItem]);
   

  const drawEditing = (headerTitle) => {
    return (
      <div className="divMain">
        <div className="divMain">
          <div className="divRow">
            <div
              className="header"
              style={{
                display: "table-cell",
                padding: 5,
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              { showSearchInput && headerTitle}
            </div>
          </div>
        </div>

        <div className="divMain">
          <div className="divRow">
            <div className="divCell" style={{ width: "100%" }}>
              {tabIndex === 5 && (
                <OrderImportLog  responseData={responseData}/>
              )}
              {tabIndex === 4 && (
                <TaskEdit currentItem={currentItem} reloadList={reloadList} setItem={setItem}/>
              )}
              
              {tabIndex === 3 && (
                <ActionEdit currentItem={currentItem} reloadList={reloadList} />
              )}

              {tabIndex === 2 && (
               <AbilEdit  currentItem={currentItem}  reloadList={reloadList} />
               )}
              
              {tabIndex === 1 && (
               <UserEdit  currentItem={currentItem}  reloadList={reloadList} />
               )}
            </div>
          </div>
        </div>

        <div className="divMain"></div>

        <div className="divMain"></div>
      </div>
    );
  };
  {/** BOX SX */}
  const drawRicerca = () => {
    return (
      <div className="divMain">
        { showSearchInput &&
        <div className="divMain">
          <div className="divRow">
            <div
              className="header"
              style={{
                display: "table-cell",
                padding: 5,
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              <Input
                icon
                placeholder="Search..."
                type="search"
                name="search"
                value={search}
                style={{
                  border: "1px solid grey",
                  borderRadius: 5,
                  height: 30,
                }}
                onChange={(e) => setSearch(e.target.value)}
              >
                <input />
                <Icon name="search" />
              </Input>
            </div>
          </div>
        </div>
        }
        <div
          className="divMain"
          style={{
            textAlign: "center",
            height: 300,
            maxHeight: 300,
            overflowY: "scoll",
            overflowX: "none",
          }}
        >
          <div className="divRow">
            <div className="divCell" style={{ width: "100%" }}>
            {tabIndex === 5 && (
                <OrderImport
                  setResponseData={setResponseData}
                />
              )}  
            {tabIndex === 4 && (
                <TaskList
                  search={search}
                  setItem={setItem}
                  forceReload={forceReload}
                />
              )}
              {tabIndex === 3 && (
                <ActionList
                  search={search}
                  setItem={setItem}
                  forceReload={forceReload}
                />
              )}

              {tabIndex === 2 && (
                <AbilList
                  search={search}
                  setItem={setItem}
                  forceReload={forceReload}
                />
              )}
              {tabIndex === 1 && (
                <UserList
                  search={search}
                  setItem={setItem}
                  forceReload={forceReload}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="content"
      style={{
        backgroundColor: "white",
        height: calculateHeight(),
        padding: 30,
      }}
    >
      {/** box intero  sinistra-destra*/}
      <div
        style={{
          display: "table",
          width: "100%",
          border: "1px solid black",
          borderRadius: "4px",
          height: "100%",
        }}
      >
        <div style={{ display: "table-cell", width: "50%", padding: 5 }}>
          {drawRicerca("Editing")}
        </div>

        <div style={{display: "table-cell",width: "50%",padding: 5,border: "px solid blue"}}>
          {drawEditing("Editing")}
        </div>
      </div>
      {/**riga in basso errore*/}
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

      <div className="divRow">
        <div
          style={{
            display: "table-cell",
            width: "100%",
            textAlign: "center",
            padding: 5,
          }}
        ></div>
      </div>
    </div>
  );
};
