//https://semantic-ui.com/elements/loader.html
import React  from 'react';
const LoadingOverlay = (props) => {
  const { mode,showTxt} = props;
  return (
    <>
      {mode === "large" && (
        <div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
          <div className="ui active dimmer">
            <div className="ui text loader">
            <h1 style= {{fontFamily: 'KoHo', fontWeight: 'bold', fontSize:'4em', color: 'grey'}}>... Loading ...</h1>   
            </div>
          </div> 
        </div>
      )}
      {mode === "mini" && (
        <div className="ui segment" style={{width:240,height:200,backgroundColor:'transparent'}}>
          <div className="ui active inverted dimmer">
            <div className="ui text loader" style={{fontFamily: 'KoHo',fontWeight:'bold',fontSize:20}}>Loading ...</div>
          </div>
          <p></p>
        </div>
      )}
      {mode === "small" && (
        <div className="ui segment" style={{width:'100%'}}>
          <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
          </div>
          <p></p>
        </div>
      )}
  
      {mode === "white" && (
      <div style={{ width: "100%", height: "100%", backgroundColor: "gray" }} >
			  <div className="ui active dimmer" style={{color:"orange!important"}}>
            <div className="ui large text  "  style={{color:"orange",fontSize:30}}>Loading ...</div>
          </div>
		</div>
      )}
      {mode === "orange" && (
      <div style={{ width: "100%", height: "100%", backgroundColor: "gray" }} >
			  <div className="ui active dimmer" style={{color:"orange!important"}}>
            <div className="ui large text"  style={{color:"orange",fontSize:30}}>{showTxt}</div>
          </div>
		  </div>
      )}
      {mode === "loison" && (
      <div style={{ width: "100%", height: "100%", backgroundColor: "white",textAlign:'center' }} >
        <img src={process.env.PUBLIC_URL + "/assets/layout/images/logosonia.png"} style= {{marginTop: '200px', marginBottom:'100px', 
		   	width: '30%', }}/>
          <h1 style= {{fontFamily: 'KoHo', fontWeight: 'bold', fontSize:30, color: 'grey'}}>Loading..</h1>
     
		</div>
      )}
    </>
  );
};

export default LoadingOverlay;
