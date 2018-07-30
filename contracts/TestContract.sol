pragma solidity ^0.4.24;

contract TestContract{
    mapping(address => uint) testMapping;
    event TestMappingEvent(address _addr, uint _value);
    function setTestMapping(uint _value) public{
        testMapping[msg.sender] = _value;
        emit TestMappingEvent(msg.sender,_value);
    }
    function getTestMapping() public view returns(uint){
        return testMapping[msg.sender];
    }
    function() public payable{}
    function contractBalance() public view returns(uint){
        return address(this).balance;
    }
}