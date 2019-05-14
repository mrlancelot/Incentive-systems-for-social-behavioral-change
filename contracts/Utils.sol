pragma solidity >=0.4.21 <0.6.0;

library Utils{
    function etherToWei(uint sumInEth) public pure returns(uint){
        return sumInEth * 1 ether;
    }

    function minutesToSeconds(uint timeInMin) public pure returns(uint){
        return timeInMin * 1 minutes;
    }
}