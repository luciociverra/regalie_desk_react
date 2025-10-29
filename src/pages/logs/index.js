import React from 'react'
import { Label, Menu, Tab } from 'semantic-ui-react';
import LogsView  from './LogsView';

const panes = [
  {
    menuItem: { key: 'Logs1', icon: 'folder', content: 'Activity Logs' },
    render: () => <Tab.Pane><LogsView/></Tab.Pane>,
  },
  
  
]

const IndexLogs = () =>
<div style={{padding: '20px',marginTop:70}}>
 <Tab panes={panes} />
</div>

export default IndexLogs