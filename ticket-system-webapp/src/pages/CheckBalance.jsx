import { Tile, TextInput, Button, InlineNotification } from '@carbon/react';
import '@carbon/react/scss/components/notification/_index.scss';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';
// import { validator } from 'web3-validator';
import { useState } from 'react';

export default function CheckBalance({walletAddress, setWalletAddress, ticketContractAddress}) {

    const [userEthBalance, setUserEthBalance] = useState('');
    const [userTicketBalance, setUserTicketBalance] = useState('');
    const [venueTicketBalance, setVenueTicketBalance] = useState('');
    const [receivedBalance, setReceivedBalance] = useState(false);
    
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const checkBalance = async () => {

        const web3 = new Web3("https://rpc2.sepolia.org");

        if (web3.utils.isAddress(walletAddress) && web3.utils.isAddress(ticketContractAddress)) {
                
            // get the eth balance of the wallet
            web3.eth.getBalance(walletAddress).then(function(balance) {
            setUserEthBalance(web3.utils.fromWei(balance, "ether"));
            setReceivedBalance(true);
            });

            
            const contract = new web3.eth.Contract(IERC20_ABI, ticketContractAddress);
            contract.methods.balanceOf(walletAddress).call().then(function(balance) {
                setUserTicketBalance(balance.toString());
            });

            contract.methods.balanceOf(ticketContractAddress).call().then(function(balance) {
                setVenueTicketBalance(balance.toString());
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } else {
            // display an error message if the wallet address is invalid
            setError('Invalid wallet address');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }

    }

    return (
        <div style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
            <Tile>
                {showError && <div style={{position:'absolute', top:'-20%', right:'-20%'}}>
                    <InlineNotification kind="error" title={error} />
                </div>}
                {showSuccess && <div style={{position:'absolute', top:'-20%', right:'-20%'}}>
                    <InlineNotification kind="success" title="Successfully Received Balance" />
                </div>}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Check Balance</h3>
                    <TextInput
                            id="walletAddress"
                            labelText="Enter a wallet address"
                            autoComplete="true"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                        />
                    <br />
                    <Button onClick={checkBalance}>Check Balance</Button>
                </div>
                {receivedBalance && 
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <TextInput labelText="Seth Balance" value={userEthBalance} readOnly id="wallet-address" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <TextInput labelText="Ticket Balance" value={userTicketBalance} readOnly id="user-ticket-balance" />
                        </div>       
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <TextInput labelText="Venue Tickets Remaining" value={venueTicketBalance} readOnly id="venue-ticket-balance" />
                        </div>    
                    </div>
                </div>     
            }  
            </Tile>
        </div>
    )
  }