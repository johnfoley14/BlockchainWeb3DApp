const TicketingSystem = artifacts.require("TicketingSystem.sol");
const { expectRevert, balance } = require('@openzeppelin/test-helpers');

contract('TicketingSystem', (accounts) => {
  let ticketingSystem;

  const initialSupply = 25000; // Initial supply for testing
  const decimals = 0; // Decimals for testing

    beforeEach(async () => {
      ticketingSystem = await TicketingSystem.new("Ticket", "TCKT", decimals, initialSupply);
    });

    it('Should return correct total supply', async () => {
      const totalSupply = await ticketingSystem.totalSupply();
      expect(totalSupply.toNumber()).to.equal(initialSupply * 10**decimals);
    });

    it('Should return correct balance of deployer', async () => {
        const balance = await ticketingSystem.balanceOf(ticketingSystem.address);
        expect(balance.toNumber()).to.equal(initialSupply * 10**decimals);
    });

    it('Should fail when not enough ETH is sent', async () => {
      const etherSent = web3.utils.toWei('0.00005', 'ether'); // 0.00005 ether
      await expectRevert(
        ticketingSystem.buyToken({ from: accounts[1], value: etherSent }),
        "Not enough ETH sent; check price!"
      );
    });

    it('Should pass when enough ETH is sent', async () => {
      const etherSent = web3.utils.toWei('0.0001', 'ether');
      
      // Buy 1 token
      await ticketingSystem.buyToken({ from: accounts[1], value: etherSent });
      const balance = await ticketingSystem.balanceOf(accounts[1]);
      // Assert the balance of the account has now increased by 1 token
      expect(balance.toNumber()).to.equal(1 * 10**decimals);
    });

    it('Should only be able to buy a maximum of 99 tickets per transaction', async () => {
      // Successful when buying 99 tickets
      await ticketingSystem.buyToken({ from: accounts[1], value: web3.utils.toWei('0.0099', 'ether') });
      const balance = await ticketingSystem.balanceOf(accounts[1]);
      expect(balance.toNumber()).to.equal(99 * 10**decimals);

      // Fail when buying 100 tickets
      await expectRevert(
        ticketingSystem.buyToken({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') }),
        "Too much ETH sent; Can only buy 99 tickets per transaction"
      );
    });

    it('Should transfer tokens if account has tokens, otherwise it should reject the transaction', async () => {
      await ticketingSystem.buyToken({ from: accounts[1], value: web3.utils.toWei('0.0099', 'ether') });

      // expect account[1] to be able to transfer 50 tickets after buying 99
      await ticketingSystem.transfer(accounts[2], 50 * 10**decimals, { from: accounts[1] });
      // expect account[1] to have 49 tickets left and account 2 to have 50
      const balance1 = await ticketingSystem.balanceOf(accounts[1]);
      const balance2 = await ticketingSystem.balanceOf(accounts[2]);
      expect(balance1.toNumber()).to.equal(49 * 10**decimals);
      expect(balance2.toNumber()).to.equal(50 * 10**decimals);

      // expect account[1] to not be able to transfer another 50 after buying 99 (only has 49 left)
      await expectRevert(
        ticketingSystem.transfer(accounts[2], 50 * 10**decimals, { from: accounts[1] }),
        "ERC20: transfer amount exceeds balance"
      );
    });

    it('Should only allow transferFrom transactions to go through if the owner has approved the transfer', async () => {
      const approveAmount = 50; // Approve 50 tokens

      await ticketingSystem.buyToken({ from: accounts[1], value: web3.utils.toWei('0.0099', 'ether') });
      // acount 1 approves account 2 to transfer 50 tokens  
      await ticketingSystem.approve(accounts[2], approveAmount * 10**decimals, { from: accounts[1] });
      
      // test allowance is correct after approval
      const allowance = await ticketingSystem.allowance(accounts[1], accounts[2]);
      expect(allowance.toNumber()).to.equal(approveAmount * 10**decimals);
  
      const transferAmount = 25; // Transfer 50 tokens

      // Expect account 0 to not be able to execute transferFrom without approval      
      await expectRevert(
        ticketingSystem.transferFrom(accounts[1], accounts[0], transferAmount * 10**decimals, { from: accounts[0] }),
        "VM Exception while processing transaction: revert -- Reason given: Panic: Arithmetic overflow."
      );

      // Expect account 2 to be able to execute transferFrom with approval
      await ticketingSystem.transferFrom(accounts[1], accounts[2], transferAmount * 10**decimals, { from: accounts[2] });

      const senderBalance = await ticketingSystem.balanceOf(accounts[1]);
      const recipientBalance = await ticketingSystem.balanceOf(accounts[2]);
      expect(senderBalance.toNumber()).to.equal((99 - transferAmount) * 10**decimals);
      expect(recipientBalance.toNumber()).to.equal(transferAmount * 10**decimals);

    });
});
