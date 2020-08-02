const express = require("express");
const app = new express();
const cors = require('cors');
const ipLocator = require('ip-locator');
const weather = require('weather-js');

app.use(cors());

app.get("/", (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ipLocator.getDomainOrIPDetails(`${ip}`,'json', function (err, data) {
    if(data == "The IP address is part of a reserved range") {
      return res.status(400).json({
        resp_code : 400,
        Error:data
        });
    };
     console.log(data);
      weather.find({search: data.city, degreeType: 'C'}, function(err, result) {
        
    if(err) {
      return res.status(400).json({
        resp_code : 400,
        Error:err
        });
    };
    resultdata= JSON.stringify(result);
        console.log(resultdata);
        return res.json({
          resp_code : 200,
          Ip_details: data,
          weather_forecast:result
          });
    
  });
 
    
  });
  
});

app.all("*", (req, res) => {
  res.status(200).json({
   resp_code : 204,
   resp_message : "Not a valid endpoint !"
   });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>
console.log(`Server is listening on port ${PORT}`)
);
