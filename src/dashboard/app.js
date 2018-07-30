var contractAddress;
var ReceivedContributionEvent;
var ProposalSubmittedEvent;
var ProposalApprovedEvent;
var ProposalRejectedEvent;
var myContract;
var abi;
var WithdrawPerformedEvent;
var ev = document.getElementById('events');
var loaderId = document.getElementById('loader');
var host = document.getElementById('host');
var alertElement = document.getElementById('alert');
var contributorCount = 0;
var proposalCount= 0;

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
     host.style.display = "none";
     loaderId.style.display = "block";

})
var myInterval = setInterval(init,500);
function init(){
    host.style.display = "block";
    loaderId.style.display = "none";
    clearInterval(myInterval);
    console.log(web3.eth.defaultAccount);
    abi = [{"constant":false,"inputs":[],"name":"endContributionPeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalanceFunc","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listContributors","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_valueInWei","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"getContributorAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listOpenBeneficiariesProposals","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_valueInWei","type":"uint256"}],"name":"submitProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_signer","type":"address"},{"name":"_beneficiary","type":"address"}],"name":"getSignerVote","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"getBeneficiaryProposal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contributor","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ReceivedContribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_approver","type":"address"},{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ProposalApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_approver","type":"address"},{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"ProposalRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_beneficiary","type":"address"},{"indexed":false,"name":"_valueInWei","type":"uint256"}],"name":"WithdrawPerformed","type":"event"}];
    myContract = web3.eth.contract(abi);
    contractAddress = myContract.at("0xd86c8f0327494034f60e25074420bccf560d5610");
    lContributors();
    openBenListFunc();
    getContractBal();
    ReceivedContributionEvent = contractAddress.ReceivedContribution();
    ReceivedContributionEvent.watch((err,res)=>{
        if(err){
            console.log(err);
        }else{
            ev.innerHTML += res.event;
            ev.innerHTML += res.args._contributor + " " + res.args._valueInWei.toNumber()
            console.log(res);
            console.log(res.args._contributor + " " + res.args._valueInWei.toNumber());
            document.getElementById('contriList').innerHTML = " ";
            lContributors();
        }
    })
    
}
function loader(){
    host.style.display = "none";
    loaderId.style.display = "block";
}
function noLoader(){
    host.style.display = "block";
    loaderId.style.display = "none";
}
function alertSuccess(){
    alertElement.innerHTML = '<div class="alert  alert-success alert-dismissible fade show" role="alert"><span class="badge badge-pill badge-success">success</span> Task Completed Successfully. Enjoy!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
}
function alertError(){
    alertElement.innerHTML = '<div class="alert  alert-danger alert-dismissible fade show" role="alert"><span class="badge badge-pill badge-danger">Error</span>Oops! Something went Wrong! See Console Log for Info.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
}
function setContributorCount(){
    document.getElementById('conCount').innerHTML = contributorCount;
}
function setProposalCount(){
    document.getElementById('proCount').innerHTML = proposalCount;
}
function sendEther(){
    var contributeAmount = document.getElementById('contributeText');
    web3.eth.sendTransaction({from: web3.eth.coinbase, to: "0xd86c8f0327494034f60e25074420bccf560d5610", value: web3.toWei(contributeAmount.value,'wei')},(err,res)=>{
        noLoader();
        if(!err){
            console.log(res);
            ev.innerHTML += res;
            ev.innerHTML += "Ether Received By Contract";
            getContractBal();
            alertSuccess();
        }else{
            alertError();
        }
    })
    loader();

}
function getContractBal(){
    contractAddress.contractBalanceFunc.call((err,res)=>{
        if(!err){
            console.log(res.toNumber());
            document.getElementById('contractBalance').innerText = res.toNumber() + " WEI";
        }
    })
}
function lContributors(){
    contractAddress.listContributors.call((err,res)=>{
        //document.getElementById('contributorsList').innerHTML = " ";
        var d1 = document.getElementById('contriList');
        var count = 0;
        if(!err){
            for(var i=0;i<res.length;i++){
                d1.insertAdjacentHTML('beforeend', `<tr><th scope="row">${i + 1}</th><td>${res[i]}</td></tr>`);
                count += 1;
            }
            contributorCount = count;
            setContributorCount();
            // for(var i=0;i<res.length;i++){
            //     document.getElementById('contributorsList').innerHTML += res[i] + "<br>";
            // }
        }
    })
}
function contributorAmt(){
    var contri = document.getElementById('contributorAmtText');
    contractAddress.getContributorAmount.call(contri.value,(err,res)=>{
        noLoader();
        if(!err){
            document.getElementById('contributorAmtResult').innerHTML = "Contributed: " + res.toNumber(); 
            alertSuccess();
        }else{
            alertError();
        }
    })
    loader();
}
function endContriPeriod(){
    contractAddress.endContributionPeriod({from: web3.eth.defaultAccount, gas: 4712388},(err,res)=>{
        noLoader();
        if(!err){
            console.log("Contribution Period Ended");
            ev.innerHTML += "Contribution Period Has Ended";
            alertSuccess();
        }else{
            console.log(err);
            alertError();
        }
    })
    loader();
}
//---------------------------------------------------------------------------------------------------------------------------------------------
function submitProposalFunc(){
    var amt = document.getElementById('submitProposalText');
    contractAddress.submitProposal(amt.value,(err,res)=>{
        noLoader();
        if(!err){
            console.log(res);
            ProposalSubmittedEvent = contractAddress.ProposalSubmitted();
            ProposalSubmittedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    console.log(res.args._beneficiary,res.args._valueInWei.toNumber());
                    ev.innerHTML += res.event;
                    ev.innerHTML += res.args._beneficiary+" "+res.args._valueInWei.toNumber();
                    document.getElementById('openBenList').innerHTML = " ";
                    openBenListFunc();
                    getContractBal();
                    alertSuccess();
                }
            });
        }else{
            console.log("Proposal Not Submitted Successfully");
            console.log(err);
            alertError();
        }
    })
    loader();
}
function test(i){

    alert(x.rows[i].cells[1].innerHTML);
}
function openBenListFunc(){
    contractAddress.listOpenBeneficiariesProposals.call((err,res)=>{
        var count = 0;
        if(!err){
            document.getElementById('openBenList').innerHTML = " ";
            var x = document.getElementById("openBenListTable");
            for(var i=0;i<res.length;i++){
                //document.getElementById('openBenList').innerHTML += res[i] + "<br>";
                document.getElementById('openBenList').insertAdjacentHTML('beforeend', `<tr>
                <th scope="row">${i+1}</th>
                <td>${res[i]}</td>
                <td>
                    <button type="button" class="btn btn-success btn-sm" onclick="approveBen(${i+1})">Approve</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="rejectBen(${i+1})">Reject</button>
              </td>
              </tr>`);
              count += 1;
            }
            proposalCount = count;
            setProposalCount();
        }
    })
}
function benAmtFunc(){
    var addr = document.getElementById('benAmtText');
    contractAddress.getBeneficiaryProposal.call(addr.value,(err,res)=>{
        noLoader();
        if(!err){
            document.getElementById('benAmtResult').innerHTML = "Beneficiary Amount: "+res.toNumber();
            alertSuccess();
        }else{
            alertError();
        }
    })
    loader();
}
//------------------------------------------------------------------------------------------------------------------------------------//
function approveBen(i){
    //var addr= document.getElementById('voteText');
    if(i != 'x'){
        var x = document.getElementById("openBenListTable").rows[i].cells[1].innerHTML;
    }else{
        var x = document.getElementById('apRjText').value;
    };
    contractAddress.approve(x,(err,res)=>{
        noLoader();
        if(!err){
            console.log(res);
            ProposalApprovedEvent = contractAddress.ProposalApproved();
            ProposalApprovedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    ev.innerHTML += res.event;
                    ev.innerHTML += res.args._approver+ " " + res.args._beneficiary+ " " + res.args._valueInWei;
                    console.log(res.args._approver+ " " + res.args._beneficiary+ " " + res.args._valueInWei);
                    openBenListFunc();
                    alertSuccess();
                }
            })
        }else{
            console.log("Voting not Successful");
            console.log(err);
            alertError();
        }
    })
    loader();
}
function rejectBen(i){
    //var addr= document.getElementById('voteText');
    if(i != 'x'){
        var x = document.getElementById("openBenListTable").rows[i].cells[1].innerHTML;
    }else{
        var x = document.getElementById('apRjText').value;
    }
    contractAddress.reject(x,(err,res)=>{
        noLoader();
        if(!err){
            console.log(res);
            ProposalRejectedEvent = contractAddress.ProposalRejected();
            ProposalRejectedEvent.watch((err,res)=>{
                if(!err){
                    console.log(res);
                    console.log(res.args._approver+ " " + res.args._beneficiary+ " " + res.args._valueInWei);
                    ev.innerHTML += res.event;
                    ev.innerHTML += res.args._approver+ " " + res.args._beneficiary+ " " + res.args._valueInWei;
                    openBenListFunc();
                    alertSuccess();
                }
            })
        }else{
            console.log("Voting not Successful");
            console.log(err);
            alertError();
        }
    })
    loader();
}
function signerVoteFunc(){
    var signerAddr = document.getElementById('signerAddrText');
    var benAddr = document.getElementById('benAddrText');
    contractAddress.getSignerVote(signerAddr.value,benAddr.value,(err,res)=>{
        noLoader();
        if(!err){
             if(res.toNumber() == 1){
                document.getElementById('signerVoteResult').innerHTML = 'He has Voted Approved';
            }else if(res.toNumber() == 2){
                document.getElementById('signerVoteResult').innerHTML = 'He has Voted Rejected';
            }else{
                document.getElementById('signerVoteResult').innerHTML = 'He has not Voted';
            }
            alertSuccess();
        }
    })
    loader();
}
//---------------------------------------------------------------------------------------------------------------------------------//
function withdrawBenAmount(){
    var val = document.getElementById('withdrawText');
    contractAddress.withdraw(val.value,(err,res)=>{
        noLoader();
        if(!err){
            console.log(res);
            WithdrawPerformedEvent = contractAddress.WithdrawPerformed();
            WithdrawPerformedEvent.watch((err,res)=>{
                if(!err){
                    document.getElementById('enjoy').innerHTML = "Enjoy... Now you have some Money!!"
                    ev.innerHTML += res.event;
                    ev.innerHTML  += res.args._beneficiary+" "+res.args._valueInWei;
                    console.log(res);
                    console.log(res.args._beneficiary+" "+res.args._valueInWei);
                    alertSuccess();
                    getContractBal();
                }
            })
        }else{
            document.getElementById('enjoy').innerHTML = "You are not getting any Money Today!";
            console.log("Withdraw not Successful");
            console.log(err);
            alertError();
        }
    })
    loader();
}
