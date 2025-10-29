import React from 'react'
import { Label, Menu, Tab } from 'semantic-ui-react';

const panes = [
  {
    menuItem: { key: 'Reports', icon: 'folder', content: 'Report' },
    render: () => <Tab.Pane> </Tab.Pane>,
  },
]

const IndexReport = () =>
<div style={{padding: '20px',marginTop:70}}>
 <Tab panes={panes} />
</div>

export default IndexReport