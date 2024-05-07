import '@carbon/react/scss/components/tile/_index.scss';
import '@carbon/react/scss/components/stack/_index.scss';
import '@carbon/react/scss/components/text-input/_index.scss';
import '@carbon/react/scss/components/button/_index.scss';
import '@carbon/react/scss/components/radio-button/_index.scss';
import '@carbon/react/scss/components/notification/_index.scss';
import { useState } from 'react';
import { Button, TextInput, FormGroup, Tile, InlineNotification, CopyButton } from '@carbon/react';
import Web3 from 'web3';

const CreateWallet = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [walletCreated, setWalletCreated] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [keystoreString, setKeystoreString] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const updateWalletState = (address, keystore, privateKey) => {
        setWalletCreated(true);
        setWalletAddress(address);
        setPrivateKey(privateKey);
        setKeystoreString(keystore);
    };

    const generateWallet = async () => {
        try {
            
            if (password !== confirmPassword) {
                setError('Passwords must match');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
                return;
            }
            if (!password || password.length < 9) {
                setError('Enter a valid 9 letter password.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
                return;
            }

            const web3 = new Web3();
            const wallet = web3.eth.accounts.create();
            console.log(wallet);

            var keystore = await web3.eth.accounts.encrypt(wallet.privateKey, password);

            updateWalletState(wallet.address, JSON.stringify(keystore, null, 2), wallet.privateKey);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (err) {
            setError('Error creating wallet. Please try again.');
            console.error(err);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }


    };

    const copyWalletAddressToClipboard = () => {
        navigator.clipboard.writeText(walletAddress)
            .then(() => {
                console.log('Keystore copied to clipboard');
            })
            .catch((err) => {
                console.error('Error copying keystore to clipboard', err);
            });
    };

    const copyPrivateKeyToClipboard = () => {
        navigator.clipboard.writeText(privateKey)
            .then(() => {
                console.log('Keystore copied to clipboard');
            })
            .catch((err) => {
                console.error('Error copying keystore to clipboard', err);
            });
    };

    const downloadWalletKeystore = () => {
        const blob = new Blob([keystoreString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        {showError && <div style={{position:'absolute', top:'-20%', right:'-20%'}}>
                                <InlineNotification kind="error" title={error} />
                            </div>}
                        {showSuccess && <div style={{position:'absolute', top:'-20%', right:'-20%'}}>
                            <InlineNotification kind="success" title="Wallet Successfully Generated" />
                        </div>}
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

export default CreateWallet;
