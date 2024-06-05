const TicketingSystem = artifacts.require("TicketingSystem.sol");

module.exports = function(deployer) {
    deployer.deploy(TicketingSystem, "Ticket", "TCKT", 0, 25000);
};