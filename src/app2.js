var contractAddress;
var submitEvent;
var myContract;
var abi;
window.addEventListener('load',function(){
    
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        //web3.eth.defaultAccount = web3.eth.accounts[0];
    }
    if(!web3.isConnected()) {
  
        // show some dialog to ask the user to start a node
     
     } else {
      
        // start web3 filters, calls, etc
     }

})
var myInterval = setInterval(init,500);
function init(){
    clearInterval(myInterval);
    console.log(web3.eth.defaultAccount);
    abi = [{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTestMapping","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"setTestMapping","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"TestMappingEvent","type":"event"}];
    myContract = web3.eth.contract(abi);
    contractAddress = myContract.at("0x3104a188b3d6953648fbbaf330906a581d16a6de");
    submitEvent = contractAddress.TestMappingEvent();
    submitEvent.watch((err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res);
            document.getElementById('status').innerHTML = "Transaction Confirmed: " + res.args._addr + "-" + res.args._value;
        }
    })
}
var submitValueButton = document.getElementById('submitValueButton');
var getValueButton = document.getElementById('getValueButton');

function sendEther(){
    web3.eth.sendTransaction({from: web3.eth.coinbase,to: "0x3104a188b3d6953648fbbaf330906a581d16a6de", value:web3.toWei(100000,'wei')},function(err,res){
        if(err){
            console.log(err);
        }else{
            console.log(res);
        }
    });
}
function submitValue(){
    var submitValueText = document.getElementById('submitValueText');
    contractAddress.setTestMapping(submitValueText.value,(err,res) => {
        if(err){
            console.log(err);
        }else{
            document.getElementById('status').innerHTML = "Loading...";
        }
    })
    
}

function getValue(){
    contractAddress.getTestMapping.call((err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res.toNumber());
        }
    })
}

function contractBal(){
    web3.eth.getBalance("0x3104a188b3d6953648fbbaf330906a581d16a6de",(err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res.toNumber());
        }
    })
}