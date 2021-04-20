const main = async function main(callback) {
    try {
        // Our code will go here
        const accounts = await web3.eth.getAccounts();
        
        console.log("-------------------------------");
        console.log("Known accounts:");
        console.log(accounts);
        console.log("-------------------------------");

        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
}

module.exports = main;