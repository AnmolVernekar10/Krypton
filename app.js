//                                        ***************** This is for the Long position*****************
// LONG ----> Buy now and sell at higher Price. Here Price -> Buying Price
//                                                   Target-> Price to sell at
//                                                   Stoploss -> Price to sell at if price goes down(Max Loss to bear)
//                                                   Amount -> Money invested


// Getting information from binance regarding crypto
let ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');

// status and profit/loss
let statu = document.getElementById('st');
let p_l =document.getElementById('l');


ws.onmessage = (event) => {
  let stockObject =JSON.parse(event.data);
  
  // Values Obtained from user
  var g = localStorage.getItem("price");
  var tar = localStorage.getItem("target");
  var sl = localStorage.getItem("stoploss");
  var amt = localStorage.getItem("Amount");
 
  // Rounding off current market price
  var z = Math.round(stockObject.p * 100)/ 100;

  // For Long ,if target price not mentioned then choose target as Maximum and Stoploss as minimum 
  if (tar == 0 ){
    tar = 99999;
  }
  if (sl == 0){
    sl = 0;
  }

  // This checks if the current Price(z) has reached the price entered by the user or not , If yes the make the status as Executed if not executed
  if(z == g && statu.innerText!=="__CLOSED")
  {
    statu.innerText = "_EXECUTED";
  }
  // This checks if the current Price(z) has reached the price entered by the user or not , If not then keep the status as Pending
  else if(z!==g && statu.innerText !== "_EXECUTED" && statu.innerText!=="__CLOSED")
  {
    statu.innerText = "_PENDING_";
  }

  // Checks if the status is executed or not, if yes then calculates the profit
  if (statu.innerText !=="__CLOSED" && statu.innerText!=="_PENDING_"){
    var t = Math.round(((z-g)/g)*amt*10*100)/100
    localStorage.setItem("pro",t)
  }
  // If closed then store the calculated profit
  if (statu.innerText =="__CLOSED"){
    var d = localStorage.getItem("pro")
    localStorage.setItem("profit",d)

  }

  // If current price has gone above the target price , then automatically set the status to Closed
  if (tar <= z && statu.innerText=="_EXECUTED")
  {
    statu.innerText = "__CLOSED";
   
  }// If current price has gone below the stoploss price , then automatically set the status to Closed
  else if (sl >= z && statu.innerText=="_EXECUTED")
  {
    statu.innerText = "__CLOSED";
  }

  // If status not closed or pending i.e executed and val(t) >0 ,then show the profit in green with Val(t)
  if (t >0 && statu.innerText!=="__CLOSED" && statu.innerText!=="_PENDING_"){
    p_l.innerText ='+'+ t 
    document.getElementById('l').style.color = "green";
  }
  // If status not closed or pending i.e executed and val(t)<0 ,then show the Loss in red with Val(t)
  else if (statu.innerText!=="__CLOSED" && t < 0 && statu.innerText!=="_PENDING_"){
    p_l.innerText=t
    document.getElementById('l').style.color="red";
  }
}