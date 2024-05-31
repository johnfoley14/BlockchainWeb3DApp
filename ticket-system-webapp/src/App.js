import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './assets/Header';
import HomePage from './pages/Home';
import CreateWalletPage from './pages/CreateWallet';
import CheckBalancePage from './pages/CheckBalance';
import PurchaseTicketPage from './pages/PurchaseTicket';
import TransferTicketPage from './pages/TransferTicket';
import { ticketAddress } from './utils/ticketAddress';
import { useState } from 'react';

function App() {

  const [userWalletAddress, setUserWalletAddress] = useState('0x6Fc02B71f5DECD64426Cf710F43Ec93EEdD13390');  
  const [ticketContractAddress, setTicketContractAddress] = useState('0x0cce4E7d5DE14Ce4efd7Dd4983ab26B8e9aaeA3F');
  const [vendorAddress, setVendorAddress] = useState('0xb08BBB9Ba40F75eD2d0675E9dd343241090d70A8');
  const [password, setPassword] = useState('');
  
  return (
    <div className="App">
      <BrowserRouter>
        <Header/> 
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path="createWallet" element={<CreateWalletPage/>} />
          <Route path="checkBalance" element={<CheckBalancePage 
          walletAddress={userWalletAddress} 
          setWalletAddress={setUserWalletAddress} 
          ticketContractAddress={ticketContractAddress}/>} />
          <Route path="purchaseTicket" element={<PurchaseTicketPage 
          userWalletAddress={userWalletAddress} 
          ticketContractAddress={ticketContractAddress} 
          setUserWalletAddress={setUserWalletAddress}
          vendorAddress={vendorAddress}
          password={password}
          setPassword={setPassword}/>} />
          <Route path="ticketTransfer" element={<TransferTicketPage
          userWalletAddress={userWalletAddress} 
          ticketContractAddress={ticketContractAddress} 
          setUserWalletAddress={setUserWalletAddress}
          vendorAddress={vendorAddress}
          password={password}
          setPassword={setPassword}/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
