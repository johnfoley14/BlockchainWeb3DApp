import { useState } from 'react';
import { Tile, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Button, Modal} from '@carbon/react';
import '@carbon/react/scss/components/dropdown/_index.scss';
import '@carbon/react/scss/components/tile/_index.scss';
import '@carbon/react/scss/components/button/_index.scss';
import '@carbon/react/scss/components/text-input/_index.scss';
import '@carbon/react/scss/components/tabs/_index.scss';
import '@carbon/react/scss/components/modal/_index.scss';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';

export default function PurchaseTicketPage({userWalletAddress, ticketContractAddress}) {

  
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState(userWalletAddress);
  const [numberOfTicketsToBuy, setNumberOfTicketsToBuy] = useState(0);
  const [open, setOpen] = useState(false);

  const purchaseTicket = async () => {
    setOpen(false);
    
    var web3 = new Web3("https://rpc2.sepolia.org");

    var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
    var transaction = contract.methods.buyToken();
    var encodedABI = transaction.encodeABI();
    var amount = 0;
    let gasPrice = await web3.eth.getGasPrice();
    const tx = {
        from: walletAddress,
        to: ticketContractAddress,
        gas: 2000000,
        data: encodedABI,
        value: web3.utils.toWei(amount, 'ether'),
        gasPrice: gasPrice
    };
    console.log(gasPrice);

    web3.eth.accounts.signTransaction(tx, privateKey).then(function(signedTx){
      console.log(JSON.stringify(signedTx));
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', function(receipt){
            console.log("Transaction Receipt: ", JSON.stringify(receipt));

        });
    });
    
  }

  return (
    <div>
      <Tile style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
        <Tabs>
          <TabList aria-label="List of tabs" contained>
            <Tab>Upload Keystore File</Tab>
            <Tab>Manual Entry</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Tab Panel 1</TabPanel>
            <TabPanel>
              <TextInput
                id="walletAddress"
                labelText="Wallet Address"
                autoComplete="true"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <TextInput.PasswordInput
                id="privateKey"
                labelText="Private Key"
                autoComplete="true"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <TextInput
                id="numberOfTicketsToBuy"
                labelText="Number of Tickets"
                value={numberOfTicketsToBuy}
                onChange={(e) => setNumberOfTicketsToBuy(e.target.value)}
                pattern="[0-9]*"
                placeholder="Max 99 tickets"
                maxLength={2}
              />
              <TextInput 
                labelText="Cost Per Ticket" 
                value={0.005 + " ETH"} 
                readOnly 
                id="ticketCost" 
              />
              <TextInput 
                labelText="Total Ticket Cost" 
                value={numberOfTicketsToBuy * 0.005 + " ETH"} 
                readOnly 
                id="totalCost" 
              />
              <br/>
              <Button onClick={()=>setOpen(true)}>Purchase Ticket</Button>
              <Modal open={open} onRequestClose={() => setOpen(false)} onRequestSubmit={purchaseTicket} modalHeading="Confirm Ticket Purchase" primaryButtonText="Confirm" secondaryButtonText="Cancel">
                <p>Are you sure you want to purchase {numberOfTicketsToBuy} ticket(s) for a total of {numberOfTicketsToBuy * 0.005} ETH?</p>
              </Modal>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Tile>
      
    </div>
  )
}





// User needs to upload the encrypted file that they downloaded, decrypt this with the password they used 
// Or else they could manually enter the private key and wallet address

// The UI should split into two tabs, one where they can do it manually and one by loading the file 
// The user needs to specify the amount of tickets they want to buy in either case 

// The UI should also specify the cost of a ticket to the user 

