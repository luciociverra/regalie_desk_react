import React, {useContext} from "react";
import { Tab } from 'semantic-ui-react';
import { MainPanel } from './MainPanel';
import {SessionContext} from "components/SessionContext";

const IndexUser = () => {

  const {isAuthorized} = useContext(SessionContext);
  const panes = [];
  if(isAuthorized("MNU_UTENTI")) {
    panes.push(
     {
      menuItem: { key: 'utenti', icon: 'users', content: 'Utenti' },
      render: () => <Tab.Pane><MainPanel  tabIndex={1} showSearchInput={true}/></Tab.Pane>,
    },
    {
      menuItem: { key: 'abilitazioni', icon: 'clipboard outline', content: 'Abilitazioni' },
      render: () => <Tab.Pane><MainPanel tabIndex={2} showSearchInput={true}/></Tab.Pane>,
    },
    {
      menuItem: { key: 'azioni', icon: 'thumbtack', content: 'Azioni' },
      render: () => <Tab.Pane><MainPanel tabIndex={3} showSearchInput={true}/></Tab.Pane>,
    },
   /*
    {
      menuItem: { key: 'motivseconda', icon: 'thumbtack', content: 'Motivazioni 2^ scelta' },
      render: () => <Tab.Pane><MainPanel tabIndex={4}/></Tab.Pane>,
    }
    */
     
     
     
    );
  }
  
  if(isAuthorized("MNU_TASKS")) {
    panes.push( 
    {
      menuItem: { key: 'tasks', icon: 'clock', content: 'Operazioni Pianificate' },
      render: () => <Tab.Pane><MainPanel tabIndex={4} showSearchInput={true}/></Tab.Pane>,
    });
  }

  if(isAuthorized("MNU_ORDINI_OC")) {
    panes.push( 
    {
      menuItem: { key: 'motivseconda', icon: 'cloud upload', content: 'Import ordini' },
      render: () => <Tab.Pane><MainPanel tabIndex={5} showSearchInput={false}/></Tab.Pane>,
    });
  }
  return (  
  <div style={{padding: '20px',marginTop:10}}>
       <Tab panes={panes} />
  </div>
  )
};
export default IndexUser