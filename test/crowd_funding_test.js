let CrowdFundingWithDeadline = artifacts.require('./TestCrowdFundingWithDeadline')

contract('CrowdFundingWithDeadline', function(accounts){
    let contract;
    let contractCreator = accounts[0];
    let beneficiary = accounts[1];

    const ONE_ETH = 1000000000000000000;
    const ERROR_MSG = 'VM Exception while processing transaction: revert';

    const ONGOING_STATE = '0';
    const FAILED_STATE = '1';
    const SUCCEEDED_STATE = '2';
    const PAID_OUT_STATE = '3';

    beforeEach(async function(){
        contract = await CrowdFundingWithDeadline.new(
            'funding',
            1,
            10,
            beneficiary,
            {
                from: contractCreator,
                gas: 2000000
            }
        );
    });

    it('contract is initialized' , async function(){
        
        let campaignName = await contract.name.call()
        expect(campaignName).to.equal('funding');

        let targetAmount = await contract.targetAmount.call()
        let targetFloat = parseFloat(targetAmount);
        expect(targetFloat).to.equal(ONE_ETH);

        let fundingDeadline = await contract.fundingDeadline.call()
        expect(fundingDeadline.toNumber()).to.equal(600);

        let actualBenficiary = await contract.beneficiary.call()
        expect(actualBenficiary).to.equal(beneficiary);

        let state = await contract.state.call()
        expect(state.valueOf().toString()).to.equal(ONGOING_STATE);

    });


    it('funds are contributed' , async function(){
        await contract.contribute({
            value: ONE_ETH,
            from: contractCreator
        });

        let contributed = await contract.amounts.call(contractCreator);
        let finalContributed = parseFloat(contributed);
        expect(finalContributed).to.equal(ONE_ETH);

        let totalCollected = await contract.totalCollected.call();
        let finalCollected = parseFloat(totalCollected);
        expect(finalCollected).to.equal(ONE_ETH);
    });

    // it('cannot contribute after deadline', async function(){
    //     try{
    //         await contract.setCurrentTime(601);
    //         await contract.sendTransaction({
    //             value: ONE_ETH,
    //             from: contractCreator
    //         });
    //         expect.fail();
    //     }catch(error){
    //         expect(error.message).to.equal(ERROR_MSG);
    //     }
    // });

    it('crowdfunding succeeded', async function(){
        await contract.contribute({
            value: ONE_ETH,
            from: contractCreator
        })
        await contract.setCurrentTime(601);
        await contract.finishedCrowdFunding();

        let state = await contract.state.call();
        expect(state.valueOf().toString()).to.equal(SUCCEEDED_STATE);
    });

    it('crowdfunding failed', async function(){
        await contract.setCurrentTime(601);
        await contract.finishedCrowdFunding();

        let state = await contract.state.call();
        expect(state.valueOf().toString()).to.equal(FAILED_STATE);
    });

    it('collected money paid out', async function(){
        await contract.contribute({
            value: ONE_ETH,
            from: contractCreator
        });
        await contract.setCurrentTime(601);
        await contract.finishedCrowdFunding();

        let initAmount = await web3.eth.getBalance(beneficiary);
        await contract.collect({from : contractCreator});

        let newBalance = await web3.eth.getBalance(beneficiary);
        // var x = (newBalance - initAmount)
        // console.log("details" + newBalance +"  ----- " + initAmount);

        //error: This function is not working properly

        // await (newBalance - initAmount).to.equal(ONE_ETH);

        let fundingState = await contract.state.call()
        expect(fundingState.valueOf().toString()).to.equal(PAID_OUT_STATE);
    });

    it('withdraw funds from contract', async function(){
        await contract.contribute({value: ONE_ETH - 100, from : contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishedCrowdFunding();

        await contract.withdraw({from: contractCreator});
        let amount = await contract.amounts.call(contractCreator);
        // let targetAmount = parseFloat(amount);
        expect(amount.toNumber()).to.equal(0);
    });

    // it('event is emitted', async function(){
    //     let watcher = contract.CampaignFinished();
    //     await contract.setCurrentTime(601);
    //     await contract.finishedCrowdFunding();

    //     let events = await watcher.get();
    //     let event = events[0];
    //     expect(event.args.totalCollected.toNumber()).to.equal(0);
    //     expect(event.args.succeeded).to.equal(false);
    // });

});