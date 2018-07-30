var contractAddress;
var ReceivedContributionEvent;
var ProposalSubmittedEvent;
var ProposalApprovedEvent;
var ProposalRejectedEvent;
var myContract;
var abi;
var WithdrawPerformedEvent;
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
    abi = [{"constant":false,"inputs":[],"name":"endContributionPeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalanceFunc","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listContributors","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_valueInWei","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"getContributorAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listOpenBeneficiariesProposals","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_valueInWei","type":"uint256"}],"name":"submitProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_signer","type":"address"},{"name":"_beneficiary","type":"address"}],"name":"getSignerVote","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"getBeneficiaryProposal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contributor","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ReceivedContribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_approver","type":"address"},{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ProposalApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_approver","type":"address"},{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ProposalRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"WithdrawPerformed","type":"event"}];
    myContract = web3.eth.contract(abi);
    contractAddress = myContract.at("0xc89ce4735882c9f0f0fe26686c53074e09b0d550");
    lContributors();
    openBenListFunc();
    ReceivedContributionEvent = contractAddress.ReceivedContribution();
    ReceivedContributionEvent.watch((err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res);
            console.log(res.args._contributor + " " + res.args._valueInWei.toNumber());
            document.getElementById('contributorsList').innerHTML = "Loading...";
            lContributors();
        }
    })
    
}

function sendEther(){
    var contributeAmount = document.getElementById('contributeText');
    web3.eth.sendTransaction({from: web3.eth.coinbase, to: "0xc89ce4735882c9f0f0fe26686c53074e09b0d550", value: web3.toWei(contributeAmount.value,'wei')},(err,res)=>{
        if(!err){
            console.log(res);
        }
    })
}
function getContractBal(){
    contractAddress.contractBalanceFunc.call((err,res)=>{
        if(!err){
            console.log(res.toNumber());
            
        }
    })
}
function lContributors(){
    contractAddress.listContributors.call((err,res)=>{
        document.getElementById('contributorsList').innerHTML = " ";
        if(!err){
            for(var i=0;i<res.length;i++){
                document.getElementById('contributorsList').innerHTML += res[i] + "<br>";
            }
        }
    })
}
function contributorAmt(){
    var contri = document.getElementById('contributorAmtText');
    contractAddress.getContributorAmount.call(contri.value,(err,res)=>{
        if(!err){
            document.getElementById('contributorAmtResult').innerHTML = "Contributed: " + res.toNumber(); 
        }
    })
}
function endContriPeriod(){
    contractAddress.endContributionPeriod({from: web3.eth.defaultAccount, gas: 4712388},(err,res)=>{
        if(!err){
            console.log("Contribution Period Ended");
        }else{
            console.log(err);
        }
    })
}
//---------------------------------------------------------------------------------------------------------------------------------------------
function submitProposalFunc(){
    var amt = document.getElementById('submitProposalText');
    contractAddress.submitProposal(amt.value,(err,res)=>{
        if(!err){
            console.log(res);
            ProposalSubmittedEvent = contractAddress.ProposalSubmitted();
            ProposalSubmittedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    console.log(res.args._beneficiary,res.args._valueInWei.toNumber());
                    document.getElementById('openBenList').innerHTML = "Loading...";
                    openBenListFunc();
                }
            });
        }else{
            console.log("Proposal Not Submitted Successfully");
            console.log(err);
        }
    })
}
function openBenListFunc(){
    contractAddress.listOpenBeneficiariesProposals.call((err,res)=>{
        if(!err){
            document.getElementById('openBenList').innerHTML = " ";
            for(var i=0;i<res.length;i++){
                document.getElementById('openBenList').innerHTML += res[i] + "<br>";
            }
        }
    })
}
function benAmtFunc(){
    var addr = document.getElementById('benAmtText');
    contractAddress.getBeneficiaryProposal.call(addr.value,(err,res)=>{
        if(!err){
            document.getElementById('benAmtResult').innerHTML = "Beneficiary Amount: "+res.toNumber();
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------------------//
function approveBen(){
    var addr= document.getElementById('voteText');
    contractAddress.approve(addr.value,(err,res)=>{
        if(!err){
            console.log(res);
            ProposalApprovedEvent = contractAddress.ProposalApproved();
            ProposalApprovedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    console.log(res.args._approver+ " " + res.args._beneficiary+ " " + res.args._valueInWei);
                    openBenListFunc();
                }
            })
        }else{
            console.log("Voting not Successful");
            console.log(err);
        }
    })
}
function rejectBen(){
    var addr= document.getElementById('voteText');
    contractAddress.reject(addr.value,(err,res)=>{
        if(!err){
            console.log(res);
            ProposalRejectedEvent = contractAddress.ProposalRejected();
            ProposalRejectedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    console.log(res.args._approver+ " " + res.args._beneficiary+ " " + res.args._valueInWei);
                    openBenListFunc();
                }
            })
        }else{
            console.log("Voting not Successful");
            console.log(err);
        }
    })
}
function signerVoteFunc(){
    var signerAddr = document.getElementById('signerAddrText');
    var benAddr = document.getElementById('benAddrText');
    contractAddress.getSignerVote(signerAddr.value,benAddr.value,(err,res)=>{
        if(!err){
            if(res.toNumber() == 0){
            document.getElementById('signerVoterResult').innerHTML = 'He has not Voted';
            }else if(res.toNumber() == 1){
                document.getElementById('signerVoteResult').innerHTML = 'He has Voted Approved';
            }else{
                document.getElementById('signerVoteResult').innerHTML = 'He has Voted Rejected';
            }
        }
    })
}
//---------------------------------------------------------------------------------------------------------------------------------//
function withdrawBenAmount(){
    var val = document.getElementById('withdrawText');
    contractAddress.withdraw(val.value,(err,res)=>{
        if(!err){
            console.log(res);
            WithdrawPerformedEvent = contractAddress.WithdrawPerformed();
            WithdrawPerformedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    console.log(res.args._beneficiary+" "+res.args._valueInWei);
                }
            })
        }else{
            console.log("Withdraw not Successful");
            console.log(err);
        }
    })
}
