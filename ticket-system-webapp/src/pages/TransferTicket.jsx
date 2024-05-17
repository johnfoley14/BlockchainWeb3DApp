import { useState } from 'react';
import '@carbon/react/scss/components/dropdown/_index.scss';
import '@carbon/react/scss/components/tile/_index.scss';
import '@carbon/react/scss/components/button/_index.scss';
import '@carbon/react/scss/components/text-input/_index.scss';
import '@carbon/react/scss/components/tabs/_index.scss';
import Web3 from 'web3';
import { IERC20_ABI } from '../utils/IERC20_ABI';


export default function TransferTicketPage({userWalletAddress, ticketContractAddress}) {

  const transferTicket = () => {
    // Implement the transfer ticket functionality here
    var web3 = new Web3("https://rpc2.sepolia.org");
  }

  return (
    <div>
      <p>
        transfer ticket page
      </p>
    </div>
  )
}
