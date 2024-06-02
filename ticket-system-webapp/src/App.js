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

  const [userWalletAddress, setUserWalletAddress] = useState('0x6Fc02B71f5DECD64426Cf710F43Ec93EEdD13390');  
  const ticketContractAddress = '0x0cce4E7d5DE14Ce4efd7Dd4983ab26B8e9aaeA3F';
  const vendorAddress = '0xb08BBB9Ba40F75eD2d0675E9dd343241090d70A8';
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(true);

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
        <Header/> 
        <Routes>
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
          vendorAddress={vendorAddress}
          password={password}
          setPassword={setPassword}
          showToast={showToast}/>} />
          <Route path="ticketTransfer" element={<TransferTicketPage
          userWalletAddress={userWalletAddress} 
          ticketContractAddress={ticketContractAddress} 
          setUserWalletAddress={setUserWalletAddress}
          vendorAddress={vendorAddress}
          password={password}
          setPassword={setPassword}
          showToast={showToast}/>} />
          <Route path="redeemTicket" element={<RedeemTicketPage
          userWalletAddress={userWalletAddress}
          setUserWalletAddress={setUserWalletAddress}
          ticketContractAddress={ticketContractAddress}
          vendorAddress={vendorAddress}/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
