import { Tile, TextInput, Button, Modal } from '@carbon/react';
import { useState } from 'react';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';

export default function RedeemTicket({userWalletAddress, setUserWalletAddress, ticketContractAddress, vendorAddress}) {

    const [numberOfTicketsToSend, setNumberOfTicketsToSend] = useState(0);
    const [open, setOpen] = useState(false);
    const [vendorPrivateKey, setVendorPrivateKey] = useState("");

    
    var web3 = new Web3("https://rpc2.sepolia.org");
    var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);

    const redeemTicket = async () => {
        setOpen(false);
        
        try{
    
            let gasPrice = await web3.eth.getGasPrice();
            const nonce = await web3.eth.getTransactionCount(userWalletAddress, 'pending');
            const gasEstimate = await contract.methods.transferFrom(userWalletAddress, vendorAddress, numberOfTicketsToSend).estimateGas({ from: vendorAddress, to: ticketContractAddress });
            const tx = {
                from: vendorAddress,
                to: ticketContractAddress,
                gas: gasEstimate,
                nonce: nonce,
                gasPrice: gasPrice,
                data: contract.methods.transferFrom(userWalletAddress, vendorAddress, numberOfTicketsToSend).encodeABI()
            }; 

        
            const signedTx = await web3.eth.accounts.signTransaction(tx, vendorPrivateKey);
        
            // Send the transaction
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(`Redeemed Ticket belonging to ${userWalletAddress}`)
            
            } catch(e) {
            console.log(e);
            }
      }

    return (
        <div style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
            <Tile>
                <TextInput
                id="numberOfTicketsToSend3"
                labelText="Number of Tickets to Redeem"
                value={numberOfTicketsToSend}
                onChange={(e) => setNumberOfTicketsToSend(e.target.value)}
                pattern="[0-9]*"
                placeholder="Max 99 tickets"
                maxLength={2}
                />
                <TextInput
                id="userAddress3"
                labelText="Ticket Holder Wallet Address"
                autoComplete="true"
                value={userWalletAddress}
                onChange={(e) => setUserWalletAddress(e.target.value)}
                />
                <TextInput.PasswordInput
                id="privateKey3"
                labelText="Vendor private key"
                autoComplete="true"
                value={vendorPrivateKey}
                onChange={(e) => setVendorPrivateKey(e.target.value)}
                />
                <br/>
                <Button onClick={()=>setOpen(true)}>Redeem Tickets</Button>
                <Modal open={open} onRequestClose={() => setOpen(false)} 
                onRequestSubmit={redeemTicket} modalHeading="Confirm Ticket Redeem" primaryButtonText="Confirm" secondaryButtonText="Cancel">
                <p>Are you sure you want to redeem {numberOfTicketsToSend} ticket(s) owned by the following address: {userWalletAddress}</p>
                </Modal>
            </Tile>
        </div>
    )
}