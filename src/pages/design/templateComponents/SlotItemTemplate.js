import React from "react";
import Utils from "../Utils";
import "./slotItemTemplate.css";
import { jLog,log } from "api";
const getQtQliTot=(item)=> {
	if(item.tipologiaTot.toLocaleLowerCase()==="ls") return item.qta *2;
	return item.qta;
}
//Questo è il componente che definisce la prima colonna della tabella a Sinistra
const SlotItemTemplate = ({	  schedulerData,
							  slot,
							  width,
							  deskData
						  }) => 
	{
		const {resources,deskItems,lotti,customColors} = deskData;
		//resources totalizzatore id name img deskItems=tutti i dati
		//console.log(JSON.stringify(slot));
		//log("slotName----:"+slot.slotName +"  "+lotti.length);
		//let marginTop=slot.slotName==="Panettoni"?15:0; 
		let productionCategory = resources.find(e => String(e.id) === String(slot.slotId));
		let imgSource= process.env.PUBLIC_URL + "/assets/layout/images/" + productionCategory.img
		let totLS=0;
	
		// SE STO DISEGNANDO IL TOTALE LIEVITATI....
		if(productionCategory.id==="totLs")
		{  deskItems.filter((elem) => elem.groupId === "totLs").forEach(elem => totLS+=elem.qta)
		}
		 
	 	//let aStyle="rotateTitle";
		const background = productionCategory.color && `${productionCategory.color}cc`;
		//if(productionCategory.name==="Panettoni") aStyle="rotateTitleP";
		return (
			<>
			{ productionCategory.type ==="P" && 
	        <div  style={{width,backgroundColor:background,height:'100%'}}>
			<img style={{height: '50px', width: '40px'}} src={imgSource} />
			<div style={{lineHeight:0.9}}>{productionCategory.name}</div>
			</div>
			}
			{ productionCategory.type ==="T" && 
	        <div style={{width,backgroundColor:background,height:'100%'}}>
			<div style={{paddingTop:10}}>Tot. </div>
			 { totLS > 0 && 
			   <div style={{paddingTop:10}}>{Utils.roundTwo(totLS*2)}</div>
			 }
			</div>
			}
			</>
		);
	 
};

export default SlotItemTemplate;
