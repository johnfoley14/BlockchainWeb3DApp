import { useState } from 'react';
import { Tile, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Dropdown} from '@carbon/react';
import '@carbon/styles/index.scss';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';


export default function TransferTicketPage({userWalletAddress, ticketContractAddress}) {

  
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState(userWalletAddress);
  const [numberOfTicketsToBuy, setNumberOfTicketsToBuy] = useState(0);



  const transferTicket = () => {
    // Implement the transfer ticket functionality here
    var web3 = new Web3("https://rpc2.sepolia.org");

    var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
    var transaction = contract.methods.buyToken();
    var encodedABI = transaction.encodeABI();
    var amount = 0;
    var tx = {
        from: walletAddress,
        to: ticketContractAddress,
        gas: 2000000,
        data: encodedABI,
        value: web3.utils.toWei(amount, 'ether') // Add the amount to the payable transaction
    };

    // // show the modal saying that the transaction is in progress
    // $("#errorMessage").text("Transaction in progress.  This could take 30s");
    // $("#errorModal").css("display", "block");

    web3.eth.accounts.signTransaction(tx, privateKey).then(function(signedTx){
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', function(receipt){
            // $("#transactionRequest").val(JSON.stringify(tx));
            // $("#transactionResult").val(JSON.stringify(receipt));

            // // dismiss the modal
            // $("#errorModal").css("display", "block");
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
              <Dropdown id="default" titleText="Number of tickets" initialSelectedItem={items[0]} label="Option 1" items={items} itemToString={item => item ? item.numberOfTickets : ''} />
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


const items = [{
  id: 'option-0',
  numberOfTickets: 0,
}, {
  id: 'option-1',
  numberOfTickets: 1,
}, {
  id: 'option-2',
  numberOfTickets: 2,
}, {
  id: 'option-3',
  numberOfTickets: 3,
}, {
  id: 'option-4',
  numberOfTickets: 3,
}, {
  id: 'option-5',
  numberOfTickets: 3,
}];
