import React from 'react'
import {Tab } from 'semantic-ui-react';
import { MainEmp } from './MainEmp';
import { CallList } from './CallList';
 

const panes = [
  {
    menuItem: { key: 'utenti', icon: 'users', content: 'Dipendenti' },
    render: () => <Tab.Pane><MainEmp  tabIndex={1} /></Tab.Pane>,
  },
  {
    menuItem: { key: 'reparti', icon: 'warehouse', content: 'Reparti' },
    render: () => <Tab.Pane><MainEmp tabIndex={2}/></Tab.Pane>,
  },
  {
    menuItem: { key: 'azioni', icon: 'phone volume', content: 'Chiamate' },
    render: () => <Tab.Pane><CallList tabIndex={3}/></Tab.Pane>,
  },
 {/*
  {
    menuItem: { key: 'azioni', icon: 'thumbtack', content: 'Azioni' },
    render: () => <Tab.Pane><MainEmp tabIndex={3}/></Tab.Pane>,
  },
*/}
   
]

const IndexEmp = () =>
<div style={{padding: '20px',marginTop:0}}>
 <Tab panes={panes} />
</div>

export default IndexEmp