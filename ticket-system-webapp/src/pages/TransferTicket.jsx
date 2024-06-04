import { useState } from 'react';
import { Tile, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Button, Modal, FileUploader} from '@carbon/react';
import '@carbon/react/scss/components/dropdown/_index.scss';
import '@carbon/react/scss/components/tile/_index.scss';
import '@carbon/react/scss/components/button/_index.scss';
import '@carbon/react/scss/components/text-input/_index.scss';
import '@carbon/react/scss/components/tabs/_index.scss';
import '@carbon/react/scss/components/modal/_index.scss';
import '@carbon/react/scss/components/file-uploader/_index.scss';
import '@carbon/react/scss/components/number-input/_index.scss';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';

export default function TransferTicketPage({userWalletAddress, ticketContractAddress, setUserWalletAddress, password, setPassword, showToast}) {

  // declaration of state variables for page
  const [privateKey, setPrivateKey] = useState("");
  const [numberOfTicketsToSend, setNumberOfTicketsToSend] = useState(0);
  const [open, setOpen] = useState(false);
  const [fileKeystoreContent, setFileKeystoreContent] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // connect to the SePolia network and create the contract object
  var web3 = new Web3("https://rpc2.sepolia.org");
  var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);

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
          console.error("Please upload a valid JSON file");
          showToast("Invalid JSON file", true);
      }
  };

  // function to send the ticket using the private key
  const sendTicketViaPrivateKey = async () => {
    setOpen(false);
    
    // wrap in try catch block to handle errors
    try{
      // get current gas price
      let gasPrice = await web3.eth.getGasPrice();

      // create the transfer ticket transaction object using recipient address and number of tickets
      const tx = {
        from: userWalletAddress,
        to: ticketContractAddress,
        gasPrice: gasPrice,
        data: contract.methods.transfer(recipientAddress, numberOfTicketsToSend).encodeABI()
      };

      // sign the transaction using the private key
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

      // send the transaction
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .once('transactionHash', function(hash) {
          console.log('Transaction Hash:', hash);
          showToast(`Successful transfer: ${hash}`, false);
      })
      .once('receipt', function(receipt) {
          console.log('Receipt:', receipt);
      })
      .on('error', function(error) {
          console.error('Error:', error);
      });

    } catch(e) {
      // log the error and show error notification
      console.log(e);
      showToast(`Error: ${e}`, true)
    }
  }

  // function to send the ticket using the keystore file
  const sendTicketViaKeystore = async () => {
    setOpen(false);
    
    try{

      // decrypt the keystore file using the password
      var wallet = await web3.eth.accounts.decrypt(fileKeystoreContent, password);
      setUserWalletAddress(wallet.address);

      // get current gas price
      let gasPrice = await web3.eth.getGasPrice();
      
      // create the transfer ticket transaction object using recipient address and number of tickets
      const tx = {
          from: wallet.address,
          to: ticketContractAddress,
          gas: 2000000,
          data: contract.methods.buyToken().encodeABI(),
          gasPrice: gasPrice,
      };

      // sign the transaction using the wallet private key, extracted from the decrypted keystore file
      var signedTx = await web3.eth.accounts.signTransaction(tx, wallet.privateKey).then(function(signedTx){
        console.log(JSON.stringify(signedTx));
      });

      // send the transaction to the network
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .once('transactionHash', function(hash) {
          console.log('Transaction Hash:', hash);
          showToast(`Successful transfer: ${hash}`, false);
      })
      .once('receipt', function(receipt) {
          console.log('Receipt:', receipt);
      })
      .on('error', function(error) {
          console.error('Error:', error);
      });

    } catch(e) {
      // log the error and show error notification
      console.log(e);
      showToast(`Error: ${e}`, true)
    }
  }

  return (
    <div>
      <Tile style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
        {/* use carbon components Tabs to create two tabs for the user to choose between uploading a keystore file or manually entering the private key and wallet address */}
        <Tabs>
          <TabList aria-label="List of tabs" contained>
            <Tab>Upload Keystore File</Tab>
            <Tab>Manual Entry</Tab>
          </TabList>
          {/* create text inputs that are consistent between both Tabs */}
          <div style={{ marginLeft:'2%'}}>
            <br/>
            {/* text input to specify the number of tickets to send */}
            <TextInput
              id="numberOfTicketsToSend"
              labelText="Number of Tickets"
              value={numberOfTicketsToSend}
              onChange={(e) => setNumberOfTicketsToSend(e.target.value)}
              pattern="[0-9]*"
              placeholder="Max 99 tickets"
              maxLength={2}
            />
            <TextInput
              id="recipientAddress"
              labelText="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
          <TabPanels>
            {/* TabPanel for uploading the keystore file */}
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
              <Button onClick={()=>setOpen(true)}>Transfer Ticket</Button>
              <Modal open={open} onRequestClose={() => setOpen(false)} onRequestSubmit={sendTicketViaKeystore} modalHeading="Confirm Ticket Transfer" primaryButtonText="Confirm" secondaryButtonText="Cancel">
                <p>Are you sure you want to transfer {numberOfTicketsToSend} ticket(s) to the following address: {recipientAddress}</p>
              </Modal>
            </TabPanel>
            {/* TabPanel for manually entering the private key and wallet address */}
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
              <Button onClick={()=>setOpen(true)}>Transfer Ticket</Button>
              <Modal open={open} onRequestClose={() => setOpen(false)} onRequestSubmit={sendTicketViaPrivateKey} modalHeading="Confirm Ticket Transfer" primaryButtonText="Confirm" secondaryButtonText="Cancel">
                <p>Are you sure you want to transfer {numberOfTicketsToSend} ticket(s) to the following address: {recipientAddress}</p>
              </Modal>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Tile>
    </div>
  )
}
