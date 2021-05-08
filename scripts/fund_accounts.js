const main = async function main(callback) {
    try {
        // To find these addresses for your local development environment,
        // start the API app using:
        //      
        //      'npm run start:app'
        //
        // These addresses are the written to the console at startup.
        const addrSouthwark = '0x55a401d54532c7a56cd0c1497a190e767a756a18';
        const addrMhclg = '0xfd3a3cd0a05062c9ec110b609f79cd02ee458061';
        const addrPeabody = '0xde9cad5fe929b2bc702494e6f7219b520ae1350e';

        // get balance of accounts
        const balanceMhclg = await web3.eth.getBalance(addrMhclg);
        const balanceSouthwark = await web3.eth.getBalance(addrSouthwark);
        const balancePeabody = await web3.eth.getBalance(addrPeabody);

        console.log('... Transferring ETH from Southwark Council test account to MHCLG and Peabody Trust test accounts')
        // transfer ETH from Southwark account to MHCLG and PEABODY TRUST
        // SOUTHWARK --- 10ETH ---> PEABODY TRUST
        await web3.eth.sendTransaction({
            from: addrSouthwark, 
            to: addrPeabody, 
            value: web3.utils.toWei('10')
        });
        // SOUTHWARK --- 10ETH ---> MHCLG
        await web3.eth.sendTransaction({
            from: addrSouthwark, 
            to: addrMhclg, 
            value: web3.utils.toWei('10')
        });

        // get balance again to confirm transfer
        let currBalanceMhclg = await web3.eth.getBalance(addrMhclg);
        let currBalanceSouthwark = await web3.eth.getBalance(addrSouthwark);
        let currBalancePeabody = await web3.eth.getBalance(addrPeabody);

        console.log('MHCLG')
        console.log(`\tAddress: ${addrMhclg}`)
        console.log(`\tStarting Balance: ${web3.utils.fromWei(balanceMhclg, 'ether')}ETH`)
        console.log(`\tCurrent balance: ${web3.utils.fromWei(currBalanceMhclg, 'ether')}ETH`)
        console.log('')

        console.log('Southwark Council')
        console.log(`\tAddress: ${addrSouthwark}`)
        console.log(`\tStarting Balance: ${web3.utils.fromWei(balanceSouthwark, 'ether')}ETH`)
        console.log(`\tCurrent balance: ${web3.utils.fromWei(currBalanceSouthwark, 'ether')}ETH`)
        console.log('')

        console.log('Peabody Trust')
        console.log(`\tAddress: ${addrPeabody}`)
        console.log(`\tStarting balance: ${web3.utils.fromWei(balancePeabody, 'ether')}ETH`)
        console.log(`\tCurrent balance: ${web3.utils.fromWei(currBalancePeabody, 'ether')}ETH`)
        console.log('')

        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
}

module.exports = main;