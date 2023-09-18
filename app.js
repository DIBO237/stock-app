const axios = require("axios");
const express = require("express");
const app = express();
const PORT = 4000;
const { TotalPCR, TotalVPC,netChange } = require("./utils/calculations");
const Logs = require("./models/Logs");
const moment = require("moment");
const Settings = require("./models/settings");
const path = require("path");
require('moment-timezone');
const { Op } = require('sequelize');
const _ = require('lodash');

// Set the timezone to Kolkata (Asia/Kolkata)
const kolkataTimezone = 'Asia/Kolkata';

// Get the current date and time in Kolkata timezone

// Importing required libraries
const cron = require("node-cron");


app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let PREVIOUS_POI = 0
let PREVIOUS_COI = 0
let CURRENT_ROW = 0


let PREVIOUS_POI_total = 0

let PREVIOUS_COI_total = 0

let PREVIOUS_change = 0




function isWithinAllowedTimeRange() {
  const format = 'hh:mm:ss A';
  const currentTime = moment(); // Get the current time as a moment object.

  const beforeTime = moment('09:10:00 AM', format);
  const afterTime = moment('03:50:00 PM', format);

  const isWithinRange = currentTime.isBetween(beforeTime, afterTime);

  console.log("TIME",isWithinRange)

  return isWithinRange;
}
// app.get("/", (req, res) => {
//   return res.status(200).json({ message: "OK" });
// });

const RunCorn = async () => {

// Get the current date and time in Kolkata timezone
const nowInKolkata = moment().tz(kolkataTimezone);

// Format the date as you wish (here we use "dddd" to get the day of the week)
const day = nowInKolkata.format("dddd");

  console.log("Running")

 

  const general = await Settings.findOne({id:1})
  console.log("Running")
  if(!_.isEmpty(general) && general.dataValues.switch === true) { 
     
     return console.log("ON")
  }
  console.log("Running")
  if (day === "Sunday") {
    return console.log("STOP");
  } 
  console.log("Running")
  if (day === "Saturday") {
    return console.log("STOP");
  }
  console.log("Running")
   
  
  const isAllowed = isWithinAllowedTimeRange();
  console.log("Running")
if (isAllowed) {
  // Your function code here
  return console.log("Function cannot be executed now.");
}

console.log("dsds")
  try {
    const { data, error } = await axios.get(
      "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY"
    );

    console.log("CALLS ,", data?.filtered.CE);
    console.log("PUTS ,", data?.filtered.PE);

    const CE_DATA = data?.filtered.CE || 0;
    const PE_DATA = data?.filtered.PE || 0;

    const CE_totOI = CE_DATA?.totOI || 0;
    const PE_totOI = PE_DATA?.totOI || 0;
    const CE_totVOL = CE_DATA?.totVol || 0;
    const PE_totVOL = PE_DATA?.totVol || 0;



    const datass = {
      PCR: TotalPCR(CE_totOI, PE_totOI) || 0,
      VPC: TotalVPC(CE_totVOL, PE_totVOL) || 0,
    };
    const today = moment().startOf('day').toDate();
    const Datas = await Logs.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
        },
      },
    })



    const totalROws = Datas.length 
      
    
    const colorMAthsPCR = datass.PCR >  PREVIOUS_POI_total ? "#17ff00" : "#C70039";

    const colorMAthsVCR = datass.VPC <  PREVIOUS_COI_total ? "#17ff00" : "#C70039";

    let netchanges = netChange(PREVIOUS_COI,PREVIOUS_POI,CE_totOI,PE_totOI,totalROws)

    const colorMAthsChange = parseFloat(netchanges) >  PREVIOUS_change ? "#17ff00" : "#C70039";


  console.log(Math.pow(netchanges))
    const datas = {
      pvcr: TotalVPC(CE_totVOL, PE_totVOL).toString() || "0",
      pcr: TotalPCR(CE_totOI, PE_totOI).toString() || "0",
      puts: JSON.stringify(PE_DATA),
      calls: JSON.stringify(CE_DATA),
      Change:parseFloat(netchanges),
      color_pcr: colorMAthsPCR,
      color_vcr:colorMAthsVCR,
      color_chng: colorMAthsChange
    };

    console.log("hello",datas)

    try {

      if(PREVIOUS_COI === CE_totOI && PREVIOUS_POI === PE_totOI ) return console.log("duplicate")
      const Logss = await Logs.create(datas);
       
       PREVIOUS_COI = CE_totOI
       PREVIOUS_POI = PE_totOI
       PREVIOUS_POI_total = datass.PCR
       PREVIOUS_COI_total = datass.VPC
       PREVIOUS_change = parseFloat(netchanges)
       console.log("User created:", Logss.toJSON());
    } catch (err) {
      console.error("Error creating user:", err.message);
    }

    //console.log(datas);
    if (error) {
      console.log(error);
    }
  } catch (e) {
    console.log(e);
  }
};

app.get("/nse/switch", async (req, res) => {


  try {
    const general = await Settings.findOne({id:1})
    if(_.isEmpty(general)) { 

      const Logss = await Settings.create({switch:true});
      console.log("User created:", Logss.toJSON());

      return res.status(200).json({code:200,switch:true,message:"Switch successfully on"})
        
    }

    console.log(general.dataValues.switch)
    if(general.dataValues.switch === true) { 
      console.log("off")
      const Logss = await general.update({switch:false});
      console.log("User created:", Logss.toJSON());

      return res.status(200).json({code:200,switch:false,message:"Switch successfully off"})
        
    }

    if(general.dataValues.switch === false) { 
      
      const Logss = await general.update({switch:true});
      console.log("User created:", Logss.toJSON());

      return res.status(200).json({code:200,switch:true,message:"Switch successfully On"})
        
    }


    
  } catch (err) {
    console.error("Error creating user:", err.message);
  }
   
});



app.get("/", async (req, res) => {
  const today = moment().startOf('day').toDate();
    try{
      
      const G_settings = await Settings.findOne({id:1})

      const Datas = await Logs.findAll({
        where: {
          createdAt: {
            [Op.gte]: today,
          },
        },
      })
        

      
      const jsonData = Datas.map(data => data.toJSON());
      //console.log(jsonData)
       if(_.isEmpty(Datas)) { 
        return res.render("webview",{title:"hellow" , data:[] , Switch:G_settings.dataValues.Switch})
         
       }

       const date= { 
         record:jsonData
       } 
  

       //return res.json(Datas)
        return res.render("webview",{title:"hellow" , data:jsonData,Switch:G_settings.dataValues.Switch})

    }

    catch (err) {

       
      return res.render('failed', {message: err.message});
     }
  
   
});




cron.schedule("*/05 * * * * *", RunCorn);

app.listen(PORT, () => console.log("sdsd"));
