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

export default function PurchaseTicketPage({userWalletAddress, ticketContractAddress, setUserWalletAddress, doormanAddress, password, setPassword, showToast}) {

  // connect to the SePolia network and create the contract object
  var web3 = new Web3("https://rpc2.sepolia.org");
  var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
  
  // declaration of state variables for page
  const [privateKey, setPrivateKey] = useState("");
  const [numberOfTicketsToBuy, setNumberOfTicketsToBuy] = useState(0);
  const [open, setOpen] = useState(false);
  const costPerTicket = 0.0001;
  const [fileKeystoreContent, setFileKeystoreContent] = useState(null);

  // helper function to handle the keystore JSON file upload
  const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const jsonContent = JSON.parse(e.target.result);
                  setFileKeystoreContent(jsonContent);
              } catch (error) {
                  showToast("Invalid JSON file", true);
              }
          };
          reader.readAsText(file);
      } else {
          showToast("Please upload a valid JSON file", true);
      }
  };

  // function to purchase tickets using the private key
  const purchaseTicketViaPrivateKey = async () => {
    setOpen(false);
    try{
      // get the current gas price
      let gasPrice = await web3.eth.getGasPrice();

      // create the buyToken transaction object
      // include the value based off the specified number of tickets and cost per ticket
      const tx = {
          from: userWalletAddress,
          to: ticketContractAddress,
          data: contract.methods.buyToken().encodeABI(),
          value: web3.utils.toWei((numberOfTicketsToBuy * costPerTicket), 'ether'),
          gasPrice: gasPrice
      };

      // sign the transaction with the buyers private key
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      console.log("Sending purchase transaction");

      // send the signed transaction to the network
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log("Purchased Ticket");
      showToast("Purchased Ticket", false);

      // call approveTicketTransfer to allow the doorman to transfer the tickets
      // this allows the doorman to redeem tickets on behalf of the user
      await approveTicketTransfer();
    } catch(e) {
      // catch any errors and show the error in a notification
      console.log(e);
      showToast(`Error: ${e}`, true);
    }
  }
  
  // function to purchase tickets using the keystore file
  const purchaseTicketViaKeystore = async () => {
    setOpen(false);
    try{

      // decrypt the keystore file with the password, extract the wallet address
      var wallet = await web3.eth.accounts.decrypt(fileKeystoreContent, password);
      setUserWalletAddress(wallet.address);
      setPrivateKey(wallet.privateKey);

      // get the current gas price
      let gasPrice = await web3.eth.getGasPrice();

      // create the buyToken transaction object
      // include the value based off the specified number of tickets and cost per ticket
      const tx = {
          from: wallet.address,
          to: ticketContractAddress,
          data: contract.methods.buyToken().encodeABI(),
          value: web3.utils.toWei((numberOfTicketsToBuy * costPerTicket), 'ether'),
          gasPrice: gasPrice
      };

      // sign the transaction with the buyers private key
      const signedTx = await web3.eth.accounts.signTransaction(tx, wallet.privateKey);
      console.log("Sending purchase transaction");

      // send the signed transaction to the network
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log("Purchased Ticket");
      showToast("Purchased Ticket", false);

      // call approveTicketTransfer to allow the doorman to transfer the tickets
      // this allows the doorman to redeem tickets on behalf of the user
      await approveTicketTransfer();
    } catch(e) {
      // catch any errors and show the error in a notification
      console.log(e);
      showToast(`Error: ${e}`, true);
    }
  }

  const approveTicketTransfer = async () => {
    // wrap in try catch block to handle errors
    try{
      // get the current gas price
      let gasPrice = await web3.eth.getGasPrice();
      // estimate the gas required for the approve transaction
      const gasEstimate = await contract.methods.approve(doormanAddress, numberOfTicketsToBuy).estimateGas({ from: userWalletAddress }); 

      // create the approve transaction object
      const approve_tx = {
        from: userWalletAddress,
        to: ticketContractAddress,
        gas: gasEstimate,
        gasPrice: gasPrice,
        data: contract.methods.approve(doormanAddress, numberOfTicketsToBuy).encodeABI(),
      };

      // sign the transaction with the buyers private key
      var signedTx = await web3.eth.accounts.signTransaction(approve_tx, privateKey);
      console.log("Sending approval transaction");

      // send the signed approve transaction to the network
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(`Approved ${doormanAddress} redeem tickets belonging to ${userWalletAddress}	`);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Tile style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
        { /* use carbon components Tabs to create two tabs for the user to choose between uploading a keystore file or manually entering the private key and wallet address */}
        <Tabs>
          <TabList aria-label="List of tabs" contained>
            <Tab>Upload Keystore File</Tab>
            <Tab>Manual Entry</Tab>
          </TabList>
          { /* create text inputs that are consistent between both Tabs */}
          <div style={{ marginLeft:'2%'}}>
            <br/>
            { /* text input to specify the number of tickets to buy */}
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

            { /* TabPanel for uploading the keystore file */}
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
                <p>Are you sure you want to purchase {numberOfTicketsToBuy} ticket(s) for a total of {numberOfTicketsToBuy * 0.005} ETH? (Note tickets are non-refundable)</p>
              </Modal>
            </TabPanel>

            { /* TabPanel for manually entering the private key and wallet address */}
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
                <p>Are you sure you want to purchase {numberOfTicketsToBuy} ticket(s) for a total of {numberOfTicketsToBuy * costPerTicket} ETH? (Note tickets are non-refundable)</p>
              </Modal>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Tile>
      
    </div>
  )
}
