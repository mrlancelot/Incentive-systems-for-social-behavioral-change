pragma solidity >=0.4.21 <0.6.0;
import "./CrowdFundingWithDeadline.sol";

contract TestCrowdFundingWithDeadline is CrowdFundingWithDeadline {
    uint time;

    constructor(
        string memory contractName,
        uint targetAmountEth,
        uint durationInMin,
        address beneficiaryAddress
    )

    CrowdFundingWithDeadline(contractName,targetAmountEth,durationInMin,beneficiaryAddress) public {

    }


    function currentTime() internal view returns(uint){
        return time;
    }

    function setCurrentTime(uint newTime) public{
        time = newTime;
    }
}

