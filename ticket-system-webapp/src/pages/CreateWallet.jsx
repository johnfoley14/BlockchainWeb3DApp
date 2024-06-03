import '@carbon/react/scss/components/tile/_index.scss';
import '@carbon/react/scss/components/stack/_index.scss';
import '@carbon/react/scss/components/text-input/_index.scss';
import '@carbon/react/scss/components/button/_index.scss';
import '@carbon/react/scss/components/radio-button/_index.scss';
import '@carbon/react/scss/components/notification/_index.scss';
import { useState } from 'react';
import { Button, TextInput, FormGroup, Tile, CopyButton } from '@carbon/react';
import Web3 from 'web3';

export default function CreateWallet({setUserWalletAddress, showToast}){

    // declaration of state variables for page
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [walletCreated, setWalletCreated] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [keystoreString, setKeystoreString] = useState('');

    // on generation of wallet update the state variables
    const updateWalletState = (address, keystore, privateKey) => {
        setWalletCreated(true);
        setWalletAddress(address);
        setPrivateKey(privateKey);
        setKeystoreString(keystore);
    };

    const generateWallet = async () => {
        // wrap in try catch block to handle errors
        try {
            // check if password and confirm password match
            if (password !== confirmPassword) {
                showToast('Passwords must match', true);
                return;
            }
            // check if password is at least 9 characters long
            if (!password || password.length < 9) {
                showToast('Enter a valid 9 character password', true);
                return;
            }

            const web3 = new Web3("https://rpc2.sepolia.org");
            // create a new wallet
            const wallet = web3.eth.accounts.create();
            console.log(wallet);

            // encrypt the private key with the password
            var keystore = await web3.eth.accounts.encrypt(wallet.privateKey, password);

            // update the state variables
            updateWalletState(wallet.address, JSON.stringify(keystore, null, 2), wallet.privateKey);
            showToast('Wallet successfully generated', false);
            setUserWalletAddress(wallet.address);

        } catch (err) {
            showToast('Error creating wallet', true);
        }
    };

    // function to copy wallet address to clipboard
    const copyWalletAddressToClipboard = () => {
        navigator.clipboard.writeText(walletAddress)
            .then(() => {
                console.log('Keystore copied to clipboard');
            })
            .catch((err) => {
                console.error('Error copying keystore to clipboard', err);
            });
    };

    // function to copy private key to clipboard
    const copyPrivateKeyToClipboard = () => {
        navigator.clipboard.writeText(privateKey)
            .then(() => {
                console.log('Keystore copied to clipboard');
            })
            .catch((err) => {
                console.error('Error copying keystore to clipboard', err);
            });
    };

    // function to download wallet keystore as JSON file
    const downloadWalletKeystore = () => {
        try{
            const blob = new Blob([keystoreString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch(e) {
            console.log(e);
        }
    };

    return (
        <div style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
            <Tile>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Create Wallet</h3>
                    <FormGroup legendText="">
                        <TextInput.PasswordInput
                            id="text-input-1"
                            labelText="Enter wallet password"
                            autoComplete="true"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextInput.PasswordInput
                            id="text-input-2"
                            labelText="Confirm wallet password"
                            helperText="Password must be at least 9 characters long."
                            autoComplete="true"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormGroup>
                    <br />
                    <Button onClick={generateWallet}>Generate Wallet</Button>
                </div>
            </Tile>
            <Tile>
            {walletCreated && 
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <TextInput labelText="Wallet Address" value={walletAddress} readOnly id="wallet-address" />
                        </div>
                        <CopyButton onClick={copyWalletAddressToClipboard}/>
                        
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <TextInput labelText="Private Key" value={privateKey} readOnly id="private-key" />
                        </div>
                        <CopyButton onClick={copyPrivateKeyToClipboard}/>        
                    </div>
                    <div style={{padding:'20px'}}>
                        <Button onClick={downloadWalletKeystore}>Download Wallet Keystore</Button>
                    </div>
                </div>     
            }    
            </Tile>
        </div>
    );
};
