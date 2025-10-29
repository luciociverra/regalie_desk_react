import React from "react";

import "pages/scheduler/templateComponents/slotItemTemplate.css";
 
//Questo è il componente che definisce la prima colonna della tabella a Sinistra
const LeftItemTemplate = ({	  schedulerData,
							  slot,
							  width,
							  deskData
						  }) => 
	{
		const {resources,deskItems,lotti} = deskData;
		// resources totalizzatore id name img deskItems=tutti i dati
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
		const background = productionCategory.color && `${productionCategory.color}cc`;
		return (
			<>
			{ productionCategory.type ==="P" && 
	        <div  style={{width,backgroundColor:background,height:'100%'}}>
			<img style={{height: '50px', width: '40px'}} src={imgSource} />
			<div style={{lineHeight:0.9}}>{productionCategory.name}</div>
			</div>
			}
			</>
		);
	 
};

export default LeftItemTemplate;
