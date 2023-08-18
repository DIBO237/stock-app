
// TOTAL OL 
const TotalPCR = (toice,toipe) => { 
 
     let totalCE= parseInt(toice) 
     let totalPE= parseInt(toipe) 


     const totelOI = parseFloat(totalPE / totalCE)

     return totelOI

}

// TOTAL VOLUME

const TotalVPC = (toice,toipe) => { 
 
    let totalCE= parseInt(toice) 
    let totalPE= parseInt(toipe) 


    const totelOI = parseFloat(totalPE / totalCE)

    return totelOI

}

function netChange (previousCE, previousPE,currentCE, currentPE,currentRow) {

    const rows = currentRow +1
   
    const PE_CHANGE = parseFloat(currentPE - previousPE) 
    console.log("pE",PE_CHANGE)
    const CE_CHANGE = parseFloat(currentCE - previousCE)
    console.log("cE",CE_CHANGE)
     const GRoss_change = parseFloat(CE_CHANGE - PE_CHANGE)
     console.log(GRoss_change)
     console.log(rows)
     const net_change = parseFloat(GRoss_change / rows)
  
     return net_change
  }
  




module.exports = {TotalPCR,TotalVPC,netChange}