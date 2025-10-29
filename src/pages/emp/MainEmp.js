import React, {
  useState,
  useMemo,
  useCallBack,
  useEffect,
  useRef,
} from "react";
import "./MainPanel.css";
import { Button, Checkbox, Form, Icon, Input, Item } from "semantic-ui-react";

import { RepartiEdit } from "./RepartiEdit";
import { RepartiList } from "./RepartiList";
import { UserList } from "./UserList";
import { UserEdit } from "./UserEdit";
import { CallList } from "./CallList";

export const MainEmp = (props) => {
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const [currentItem, setCurrentItem] = useState(null);
  const [forceReload, setForceReload] = useState(0);
  const [totals, setTotals] = useState("");
  
  const calculateHeight = () => {
    return 500;
  };

  const setItem = (item) => {
    setCurrentItem(item);
  };

  const reloadList = () => {
    setCurrentItem(null);
    setSearch("");
    setForceReload(forceReload + 1);
  };

  useEffect(() => {
     reloadList();
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
              {headerTitle}
            </div>
          </div>
        </div>

        <div className="divMain">
          <div className="divRow">
            <div className="divCell" style={{ width: "100%" }}>
             {/*} {props.tabIndex === 3 && (
                <ActionEdit currentItem={currentItem} reloadList={reloadList} />
              )}
              */}
               {props.tabIndex === 1 && (
               <UserEdit   currentItem={currentItem}  reloadList={reloadList} />
               )}
               {props.tabIndex === 2 && (
               <RepartiEdit   currentItem={currentItem}  reloadList={reloadList} />
               )}
            </div>
          </div>
        </div>

        <div className="divMain"></div>

        <div className="divMain"></div>
      </div>
    );
  };

  const drawRicerca = () => {
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
              </Input> <span style={{paddingLeft:20}}>{totals}</span>
            </div>
          </div>
        </div>

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
              {props.tabIndex === 1 && (
                <UserList
                  search={search}
                  setItem={setItem}
                  forceReload={forceReload}
                  setTotals={setTotals}
                />
              )}
             {props.tabIndex === 2 && (
                <RepartiList
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

        <div
          style={{
            display: "table-cell",
            width: "50%",
            padding: 5,
            border: "px solid blue",
          }}
        >
          {drawEditing("Editing")}
        </div>
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
