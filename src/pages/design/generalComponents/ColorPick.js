import React from "react";
import { ChromePicker } from "react-color";
import { jAlert} from "api";
import reactCSS from "reactcss";
import { Button } from 'semantic-ui-react';
 
class ColorPick extends React.Component {
  state = {
    viewPicker: false,
    color: {
        rgb:{
            r: 33,
            b: 143,
            g: 34,
            a: 1, 
        },
        hex:'#21228f',
        hsl:{
            a: 1,
            h: 239,
            l: 0,
            s: 5,
        }
    },
    colorTesto: '#000000'
  };

  handleOnClick = () => {
    this.setState({
      viewPicker: !this.state.viewPicker,
    });
  };

  handleOnClose = () => {
    this.setState({
      viewPicker: false,
    });
  };

  handleOnChange = (color) => {
    this.setState({
      color: {
        rgb:color.rgb,
        hex:color.hex,
        hsl:color.hsl
    },
    });
    // Passing the selected color to parent component
    setTimeout(() => {
      //SetTimeout added to update color correctly
      //this.props.onColorSelect(this.state.color);
    });
  };
  
  colorTesto = (color) => {
    this.setState({colorTesto:color});
  };
 
  handleOnReset = () => {
    this.props.colorReset();
    this.handleOnClose();
  };
  conferma = () => {
   this.props.colorChange(this.state.color.hex,this.state.colorTesto);
   this.handleOnClick();
  };
  render() {
    const styles = reactCSS({
      default: {
        cover: {
          position: "fixed",
          background: "white",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          border: "px solid orange",
          boxShadow: "inset 0 3px 10px rgba(0,0,0,0.16), 0 4px 10px rgba(0,0,0,0.45)",
	        borderRadius: 10,
          zIndex: 0,
          width:300
        },
        popover: {
          position: "absolute",
          width: 200,
          zIndex: 999,
          border: "1px solid gray",
        },
        cmd: {
          color:'black',fontWeight:'bold',fontSize:14,cursor:"pointer", borderRadius: 10,marginTop:7,width:210
        },
      },
    });

    return (
      <div>
        <Button className="ui button" onClick={this.handleOnClick}  style={{ padding:0,cursor:'pointer',borderRadius:10,padding:2,border: '1px solid black'}}
         title="Personalizza colore elemento">
					<img src={process.env.PUBLIC_URL + "/assets/layout/images/colora.png"} style= {{width:40 }}/>
					</Button>
        {this.state.viewPicker ? (
          <div style={styles.popover} >
             
           <div style={styles.cover} onClick={this.handleOnClose} />

             
           <div style={{color:'black',zIndex:999,position:'relative',top:-10,left:0,fontWeight:'bold',textAlign:'left'}}>
              PREVIEW</div>
            <div style={{color:this.state.colorTesto,backgroundColor:this.state.color.hex,
             margin:'0 auto',
             marginBottom:30,marginLeft:10,marginTop:10,
             border:'1px solid gray',zIndex:999,width:210,
             position:'relative',bottom:10,left:0,fotWeight:'bold',height:40,paddingTop:5,fontSize:18,fontWeight:'bold',borderRadius:8,textAlign:'center'}}>
              Preview
           </div>

            <div style={{color:'black',border:'0px solid red',zIndex:999,position:'relative',top:-10,left:0,fontWeight:'bold',textAlign:'left'}}>
              SFONDO</div>
            <ChromePicker
              color={this.state.color.rgb}
              onChange={this.handleOnChange}
              disableAlpha
            />
           
           <div style={{color:'black',border:'px solid red',zIndex:999,position:'relative',top:-10,left:0,fontWeight:'bold',textAlign:'left'}}>
           TESTO
            
            <div style={{width:'100%',display:'table',height:40,border:'px solid red',paddingTop:10}}>
             <div style={{display:'table-row'}} className={'cellFont'}>

             <div style={{width:'25%', display:'table-cell',textAlign:'center'}}>
             <div onClick={(e)=>this.colorTesto('#000000')} style={{backgroundColor:'#000000'}} className="btColor"></div></div>
             
             <div style={{width:'25%', display:'table-cell',textAlign:'center'}}>
             <div onClick={(e)=>this.colorTesto('#FFFFFF')} style={{backgroundColor:'#FFFFFF'}} className="btColor"></div></div>
             
             <div style={{width:'25%', display:'table-cell',textAlign:'center'}}>
             <div onClick={(e)=>this.colorTesto('#FF0000')} style={{backgroundColor:'#FF0000'}} className="btColor"></div></div>
            
             <div style={{width:'25%', display:'table-cell',textAlign:'center'}}>
             <div onClick={(e)=>this.colorTesto('#FFFF00')} style={{backgroundColor:'#FFFF00'}} className="btColor"></div></div>
             
             <div style={{width:'25%', display:'table-cell',textAlign:'center'}}>
             <div onClick={(e)=>this.colorTesto('#00Ea38')} style={{backgroundColor:'#00Ea38'}} className="btColor"></div></div>
            
             </div>
	      	  </div>
            <p></p>
            <p>
            <button style={styles.cmd} onClick={(e)=>this.conferma()} title="Salva queste impostazioni">Conferma nuovo colore</button>
           </p><p>
            <button style={styles.cmd} onClick={(e)=>this.handleOnReset()} title="Utilizza colori standard">Ritorna al colore standard</button>
            </p>
            <p>
            <button style={styles.cmd} onClick={(e)=>this.handleOnClose()} title="Annulla">Chiudi finestra</button>
            </p>
           </div>

          
          
        </div>
        
        ) : null}
      </div>
    );
  }
}


export default ColorPick;