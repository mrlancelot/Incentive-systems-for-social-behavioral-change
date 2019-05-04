pragma solidity >=0.4.21 <0.6.0;

contract CrowdFundingWithDeadline{
    enum State { Ongoing, Failed, Succeeded , PaidOut}

    string public name;
    uint public targetAmount;
    uint public fundingDeadline;
    address public beneficiary;
    State public state;
    mapping(address => uint) public amounts;
    bool public collected;
    uint public totalCollected;

    modifier inState(State expectedState){
        require(state == expectedState,"Invalid state");
        _;
    }

    constructor(
        string memory contractName,
        uint targetAmountEth,
        uint durationInMin,
        address beneficiaryAddress
    )

    public {
        name = contractName;
        targetAmount = targetAmountEth * 1 ether;
        fundingDeadline = currentTime() + durationInMin * 1 minutes;
        beneficiary = beneficiaryAddress;
        state = State.Ongoing;
    }

    function contribute() public payable inState(State.Ongoing){
        require(beforeDeadline(), "No contributions afer the deadline");
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;

        if(totalCollected >= targetAmount){
            collected = true;
        }
    } 

    function finishedCrowdFunding() public inState(State.Ongoing){
        require(!beforeDeadline(), "Cannot finish campaign before a deadline");

        if(!collected){
            state = State.Failed;
        }else{
            state = State.Succeeded;
        }
    }

    function collect() public inState(State.Succeeded){
        if(beneficiary.send(totalCollected)){
            state = State.PaidOut;
        }else{
            state = State.Failed;
        }
    }

    function withdraw() public inState(State.Failed){
        require(amounts[msg.sender] > 0, "Nothing was contributed");
        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        if(!msg.sender.send(contributed)){
            amounts[msg.sender] = contributed;
        }
    }

    function beforeDeadline() public view returns(bool){
        return currentTime() < fundingDeadline;
    }

    function currentTime() internal view returns(uint){
        return now;
    }
}