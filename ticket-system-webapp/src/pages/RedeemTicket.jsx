import { Tile, TextInput, Button, Modal } from '@carbon/react';
import { useState } from 'react';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';

export default function RedeemTicket({userWalletAddress, setUserWalletAddress, ticketContractAddress, doormanAddress, showToast}) {

    // declaration of state variables for page
    const [numberOfTicketsToSend, setNumberOfTicketsToSend] = useState(0);
    const [open, setOpen] = useState(false);
    // state variable for the doormans private key
    const [doormanPrivateKey, setDoormanPrivateKey] = useState("");

  // connect to the SePolia network and create the contract object
    var web3 = new Web3("https://rpc2.sepolia.org");
    var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);

    // function to redeem the ticket
    // this is used by the doorman to transfer a buyers ticket to the doorman, hence redeeming the ticket
    const redeemTicket = async () => {
        setOpen(false);
        
        try{
    
            // get current gas price
            let gasPrice = await web3.eth.getGasPrice();

            // create the transfer ticket transaction object
            // send from the buyers wallet to the doormans wallet
            const tx = {
                from: doormanAddress,
                to: ticketContractAddress,
                gasPrice: gasPrice,
                data: contract.methods.transferFrom(userWalletAddress, doormanAddress, numberOfTicketsToSend).encodeABI()
            }; 

        
            // sign the transaction with the vendors private key
            const signedTx = await web3.eth.accounts.signTransaction(tx, doormanPrivateKey);
            console.log("Sending redeem transaction");

            // Send the transaction
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            // show success message as notification
            showToast(`Redeemed Ticket belonging to ${userWalletAddress}`, false);
            console.log(`Redeemed Ticket belonging to ${userWalletAddress}`)
            
            } catch(e) {
            console.log(e);
            }
      }

    return (
        <div style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
            <Tile>
            { /* text input for the number of tickets the user wants to redeem */}	
                <TextInput
                id="numberOfTicketsToSend3"
                labelText="Number of Tickets to Redeem"
                value={numberOfTicketsToSend}
                onChange={(e) => setNumberOfTicketsToSend(e.target.value)}
                pattern="[0-9]*"
                placeholder="Max 99 tickets"
                maxLength={2}
                />
                { /* text input for the address of the ticket holder */}
                <TextInput
                id="userAddress3"
                labelText="Ticket Holder Wallet Address"
                autoComplete="true"
                value={userWalletAddress}
                onChange={(e) => setUserWalletAddress(e.target.value)}
                />
                { /* text input for the doormans private key, so he can redeem the tickets */}
                <TextInput.PasswordInput
                id="privateKey3"
                labelText="Doorman private key"
                autoComplete="true"
                value={doormanPrivateKey}
                onChange={(e) => setDoormanPrivateKey(e.target.value)}
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