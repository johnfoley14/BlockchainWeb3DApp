import { useState } from 'react';
import { Tile, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Button, Modal, FileUploader} from '@carbon/react';
import '@carbon/react/scss/components/dropdown/_index.scss';
import '@carbon/react/scss/components/tile/_index.scss';
import '@carbon/react/scss/components/button/_index.scss';
import '@carbon/react/scss/components/text-input/_index.scss';
import '@carbon/react/scss/components/tabs/_index.scss';
import '@carbon/react/scss/components/modal/_index.scss';
import '@carbon/react/scss/components/file-uploader/_index.scss';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';

export default function PurchaseTicketPage({userWalletAddress, ticketContractAddress, setUserWalletAddress, vendorAddress, password, setPassword}) {

  var web3 = new Web3("https://rpc2.sepolia.org");
  var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
  
  const [privateKey, setPrivateKey] = useState("");
  const [numberOfTicketsToBuy, setNumberOfTicketsToBuy] = useState(0);
  const [open, setOpen] = useState(false);
  const [costPerTicket, setCostPerTicket] = useState(0.00001);
  const [fileKeystoreContent, setFileKeystoreContent] = useState(null);

  const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const jsonContent = JSON.parse(e.target.result);
                  setFileKeystoreContent(jsonContent);
              } catch (error) {
                  console.error("Invalid JSON file");
              }
          };
          reader.readAsText(file);
      } else {
          console.error("Please upload a valid JSON file");
      }
  };

  const purchaseTicketViaPrivateKey = async () => {
    setOpen(false);
    try{
      let gasPrice = await web3.eth.getGasPrice();
      const tx = {
          from: userWalletAddress,
          to: ticketContractAddress,
          gas: 2000000,
          data: contract.methods.buyToken().encodeABI(),
          value: web3.utils.toWei((numberOfTicketsToBuy * costPerTicket), 'ether'),
          gasPrice: gasPrice
      };

      web3.eth.accounts.signTransaction(tx, privateKey).then(function(signedTx){
        console.log("Signed transaction: " + JSON.stringify(signedTx));
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(function(receipt){
          console.log("Sent signed transaction: " + JSON.stringify(receipt));
          approveTicketTransfer();
        });
      });
    } catch(e) {
      console.log(e);
    }
  }

  const purchaseTicketViaKeystore = async () => {
    setOpen(false);
    try{

      var wallet = await web3.eth.accounts.decrypt(fileKeystoreContent, password);
      setUserWalletAddress(wallet.address);

      let gasPrice = await web3.eth.getGasPrice();
      const tx = {
          from: wallet.address,
          to: ticketContractAddress,
          gas: 2000000,
          data: contract.methods.buyToken().encodeABI(),
          value: web3.utils.toWei((numberOfTicketsToBuy * costPerTicket), 'ether'),
          gasPrice: gasPrice
      };

      web3.eth.accounts.signTransaction(tx, wallet.privateKey).then(function(signedTx){
        console.log("Signed transaction: " + JSON.stringify(signedTx));
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(function(receipt){
          console.log("Sent signed transaction: " + JSON.stringify(receipt));
          approveTicketTransfer();
        });
      });

    } catch(e) {
      console.log(e);
    }
  }

  const approveTicketTransfer = async () => {
    try{
      var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
      let gasPrice = await web3.eth.getGasPrice();
      const approve_tx = {
        from: userWalletAddress,
        to: ticketContractAddress,
        gas: 2000000,
        gasPrice: gasPrice,
        // Approve the vendor to transfer the tickets back to the contract
        // When user buys a ticket they approve ticket transfer
        // This allows the vendor send the ticket to the vendor address without needing the users private key
        data: contract.methods.approve(vendorAddress, numberOfTicketsToBuy).encodeABI(),
      };
      var signedTx = await web3.eth.accounts.signTransaction(approve_tx, privateKey);
      console.log("here1");
      var receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log("here2");
      return receipt;
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Tile style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
        <Tabs>
          <TabList aria-label="List of tabs" contained>
            <Tab>Upload Keystore File</Tab>
            <Tab>Manual Entry</Tab>
          </TabList>
          <div style={{ marginLeft:'2%'}}>
            <br/>
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
              value={costPerTicket + " ETH"} 
              readOnly 
              id="ticketCost" 
            />
            <TextInput 
              labelText="Total Ticket Cost" 
              value={numberOfTicketsToBuy * costPerTicket + " ETH"} 
              readOnly 
              id="totalCost" 
            />
          </div>
          <TabPanels>
            <TabPanel>
              <FileUploader
                accept={['.json']}
                buttonKind="primary"
                buttonLabel="Add files"
                filenameStatus="edit"
                iconDescription="Clear file"
                onChange={handleFileUpload}
                labelDescription='Only .json files are supported.'
              />
              <TextInput.PasswordInput
                id="decryptionPassword"
                labelText="Password"
                autoComplete="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br/>
              <Button onClick={()=>setOpen(true)}>Purchase Ticket</Button>
              <Modal open={open} onRequestClose={() => setOpen(false)} onRequestSubmit={purchaseTicketViaKeystore} modalHeading="Confirm Ticket Purchase" primaryButtonText="Confirm" secondaryButtonText="Cancel">
                <p>Are you sure you want to purchase {numberOfTicketsToBuy} ticket(s) for a total of {numberOfTicketsToBuy * 0.005} ETH?</p>
              </Modal>
            </TabPanel>

            <TabPanel>
              <TextInput
                id="walletAddress"
                labelText="Wallet Address"
                autoComplete="true"
                value={userWalletAddress}
                onChange={(e) => setUserWalletAddress(e.target.value)}
              />
              <TextInput.PasswordInput
                id="privateKey"
                labelText="Private Key"
                autoComplete="true"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <br/>
              <Button onClick={()=>setOpen(true)}>Purchase Ticket</Button>
              <Modal open={open} onRequestClose={() => setOpen(false)} onRequestSubmit={purchaseTicketViaPrivateKey} modalHeading="Confirm Ticket Purchase" primaryButtonText="Confirm" secondaryButtonText="Cancel">
                <p>Are you sure you want to purchase {numberOfTicketsToBuy} ticket(s) for a total of {numberOfTicketsToBuy * costPerTicket} ETH?</p>
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










// For the upload keystore
// The user uploads the keystore (which is basically the encryption of the private key)
// The user enters their password to decrypt the keystore
// The UI should then display the wallet address and private key to the user
// The browser now has access to the private key and can sign transactions on behalf of the user


// we can keep the number of tickets etc and price the same, but we need to separate buttons and 
// two seperate functions to handle the purchase of tickets in either tabs
// one tab should call function purchaseTicketViaKeystore and the other should call purchaseTicketViaPrivateKey