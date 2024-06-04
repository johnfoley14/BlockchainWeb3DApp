import './App.css';
import { ToastNotification } from '@carbon/react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './assets/Header';
import HomePage from './pages/Home';
import CreateWalletPage from './pages/CreateWallet';
import CheckBalancePage from './pages/CheckBalance';
import PurchaseTicketPage from './pages/PurchaseTicket';
import TransferTicketPage from './pages/TransferTicket';
import RedeemTicketPage from './pages/RedeemTicket';
import { useState } from 'react';

function App() {

  // declaration of state variables as well as the contract address and vendor address
  // feel free to change the vendor
  const [userWalletAddress, setUserWalletAddress] = useState('');  
  const ticketContractAddress = '0x94dCB7c12F368D58a81C0C1Eb0d98F5a77ec3591';
  const doormanAddress = '0xb08BBB9Ba40F75eD2d0675E9dd343241090d70A8';
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(true);

  // function to show notification and messages to the user
  const showToast = (message, isErrorMessage) => {
    setMessage(message);
    setIsErrorMessage(isErrorMessage);
    setSuccessToastOpen(true);

    setTimeout(() => {
      setSuccessToastOpen(false);
    }, 6000);
  };
  
  return (
    <div className="App">      
    {successToastOpen && (
      <ToastNotification
        className='notification'
        kind={isErrorMessage ? 'error' : 'success'} // or "error", "info", "warning"
        title={message}
        onCloseButtonClick={() => setSuccessToastOpen(false)}
      />
    )}
      <BrowserRouter>
        {/* define the header component which links to the different pages */}
        <Header/> 
        <Routes>
          {/* define routes for different pages */}
          <Route index element={<HomePage/>} />
          <Route path="createWallet" element={<CreateWalletPage
          setUserWalletAddress={setUserWalletAddress}
          showToast={showToast}/>} />
          <Route path="checkBalance" element={<CheckBalancePage 
          walletAddress={userWalletAddress} 
          setWalletAddress={setUserWalletAddress} 
          ticketContractAddress={ticketContractAddress}
          showToast={showToast}/>} />
          <Route path="purchaseTicket" element={<PurchaseTicketPage 
          userWalletAddress={userWalletAddress} 
          ticketContractAddress={ticketContractAddress} 
          setUserWalletAddress={setUserWalletAddress}
          doormanAddress={doormanAddress}
          password={password}
          setPassword={setPassword}
          showToast={showToast}/>} />
          <Route path="ticketTransfer" element={<TransferTicketPage
          userWalletAddress={userWalletAddress} 
          ticketContractAddress={ticketContractAddress} 
          setUserWalletAddress={setUserWalletAddress}
          password={password}
          setPassword={setPassword}
          showToast={showToast}/>} />
          <Route path="redeemTicket" element={<RedeemTicketPage
          userWalletAddress={userWalletAddress}
          setUserWalletAddress={setUserWalletAddress}
          ticketContractAddress={ticketContractAddress}
          doormanAddress={doormanAddress}
          showToast={showToast}/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
