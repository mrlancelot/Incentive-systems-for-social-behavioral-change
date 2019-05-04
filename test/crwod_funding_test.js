let CrowdFundingWithDeadline = artifacts.require('./CrowdFundingWithDeadline')

SVGComponentTransferFunctionElement('CrowdFundingWithDeadline', function(accounts){
    let contract;
    let contractCreator = accounts[0];
    let beneficiary = accounts[1];

    const ONE_ETH = 1000000000;

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
                from: scontractCreator,
                gas: 200000
            }
        );
    });

    it('contract is initialized' , async function(){
        let campaignName = await contract.name.call()
        expect(campaignName).to.equal('funding');

        let targetAmount = await contract.targetAmount.call()
        expect(targetAmount.toNumber()).to.equal(ONE_ETH);

        let actualBenficiary = await contract.beneficiary.call()
        expect(actualBenficiary).to.equal(beneficiary);

        let state = await contract.state.call()
        expect(state.valueOF()).to.equal(ONGOING_STATE);

    });

});