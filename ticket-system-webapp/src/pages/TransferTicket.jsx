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

export default function PurchaseTicketPage({userWalletAddress, ticketContractAddress, setUserWalletAddress, password, setPassword}) {

  
  const [privateKey, setPrivateKey] = useState("");
  const [numberOfTicketsToSend, setNumberOfTicketsToSend] = useState(0);
  const [open, setOpen] = useState(false);
  const [fileKeystoreContent, setFileKeystoreContent] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');

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

  const sendTicketViaPrivateKey = async () => {
    setOpen(false);
    
    try{
    var web3 = new Web3("https://rpc2.sepolia.org");

    var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
    var transaction = contract.methods.transfer();
    var encodedABI = transaction.encodeABI();
    var amount = 0.0005;
    let gasPrice = await web3.eth.getGasPrice();
    const tx = {
        from: userWalletAddress,
        to: ticketContractAddress,
        gas: 2000000,
        data: encodedABI,
        value: web3.utils.toWei(amount, 'ether'),
    };

    console.log(tx);
    tx.gasPrice = gasPrice;
    console.log(gasPrice);

    web3.eth.accounts.signTransaction(tx, privateKey).then(function(signedTx){
      console.log(JSON.stringify(signedTx));
      web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    });

    } catch(e) {
      console.log(e);
    }
  }

  const sendTicketViaKeystore = async () => {
    setOpen(false);
    
    try{
      var web3 = new Web3("https://rpc2.sepolia.org");

      var wallet = await web3.eth.accounts.decrypt(fileKeystoreContent, password);
      setUserWalletAddress(wallet.address);

      var contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
      var transaction = contract.methods.buyToken();
      var encodedABI = transaction.encodeABI();
      var amount = 0.0005;
      let gasPrice = await web3.eth.getGasPrice();
      const tx = {
          from: wallet.address,
          to: ticketContractAddress,
          gas: 2000000,
          data: encodedABI,
          value: web3.utils.toWei(amount, 'ether'),
      };

      console.log(tx);
      tx.gasPrice = gasPrice;
      console.log(gasPrice);

      web3.eth.accounts.signTransaction(tx, wallet.privateKey).then(function(signedTx){
        console.log(JSON.stringify(signedTx));
        web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      });

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
