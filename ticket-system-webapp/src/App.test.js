import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import CheckBalance from './pages/CheckBalance';
import PurchaseTicketPage from './pages/PurchaseTicket';
import TransferTicketPage from './pages/TransferTicket';
import RedeemTicketPage from './pages/RedeemTicket';
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mocking window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};


test('renders home page content correctly', () => {
  render(<App />);
  const homePageContent = screen.getByText(/Welcome to the Match Ticketing System/i);
  expect(homePageContent).toBeInTheDocument();

  const homePageDescription = screen.getByText(/This ticketing system is built on the SePolia network/i);
  expect(homePageDescription).toBeInTheDocument();

  const homePageFeatures = screen.getByText(/We facilitate ease of use for customers when dealing with MatchTicket Tokens/i);
  expect(homePageFeatures).toBeInTheDocument();

  const homePageSupport = screen.getByText(/We support wallet creation, balance checking, token purchases, token transfer and redeeming token/i);
  expect(homePageSupport).toBeInTheDocument();


});

test('renders header with links correctly', () => {
  render(<App />);
  // Ensure all 6 links to each page are rendered
  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(6);

  // Ensure the links are correct
  expect(screen.getByText('Purchase Ticket')).toBeInTheDocument();
  expect(screen.getByText('Purchase Ticket').closest('a')).toHaveAttribute('href', '/purchaseTicket');

});

test('renders create wallet page correctly', () => {
  render(<App />);
  // Click on the Create Wallet link
  fireEvent.click(screen.getByText('Create Wallet'));

  // Ensure the Create Wallet page content is displayed
  expect(screen.getByText('Enter wallet password')).toBeInTheDocument();
  expect(screen.getByText('Confirm wallet password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Generate Wallet/i })).toBeInTheDocument();
});

test('password requirements and error notification showing for invalid passwords', () => {
  render(<App />);

  // Get password input fields
  const passwordInput = screen.getByLabelText('Enter wallet password');
  const confirmPasswordInput = screen.getByLabelText('Confirm wallet password');

  // Simulate typing incorrect password values
  fireEvent.change(passwordInput, { target: { value: 'tooshort' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'tooshort' } });

  // Verify the input values
  expect(passwordInput).toHaveValue('tooshort');
  expect(confirmPasswordInput).toHaveValue('tooshort');

  // Click on the Generate Wallet button with incorrect password values
  // Results in an error notification
  fireEvent.click(screen.getByText('Generate Wallet'));
  expect(screen.getByText('Enter a valid 9 character password')).toBeInTheDocument();
  expect(screen.getByText('Enter a valid 9 character password')).toHaveClass('cds--toast-notification__title');

});

test('Render of Check Balance Components', () => {
  render(<CheckBalance />);

  expect(screen.getByText('Enter a wallet address')).toBeInTheDocument();
  // Find the header
  const header = screen.getByRole('heading', { level: 3, name: /check balance/i });
  expect(header).toBeInTheDocument();

  // Find the button
  const button = screen.getByRole('button', { name: /check balance/i });
  expect(button).toBeInTheDocument();

});

test('Render of Purchase Ticket Components', () => {
  render(<PurchaseTicketPage />);

  // test the expected components are rendered correctly
  expect(screen.getByText('Upload Keystore File')).toBeInTheDocument();
  expect(screen.getByText('Manual Entry')).toBeInTheDocument();
  expect(screen.getByText('Number of Tickets')).toBeInTheDocument();
  expect(screen.getByText('Cost Per Ticket')).toBeInTheDocument();
  expect(screen.getByText('Total Ticket Cost')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('Wallet Address')).toBeInTheDocument();
  expect(screen.getByText('Private Key')).toBeInTheDocument();

  // test the total ticket cost is calculated correctly
  fireEvent.change(screen.getByLabelText('Number of Tickets'), { target: { value: 2 } });
  expect(screen.getByLabelText('Number of Tickets')).toHaveValue('2');
  expect(screen.getByLabelText('Cost Per Ticket')).toHaveValue('0.0001 ETH');
  expect(screen.getByLabelText('Total Ticket Cost')).toHaveValue('0.0002 ETH');

  fireEvent.change(screen.getByLabelText('Number of Tickets'), { target: { value: 5 } });
  expect(screen.getByLabelText('Number of Tickets')).toHaveValue('5');
  expect(screen.getByLabelText('Cost Per Ticket')).toHaveValue('0.0001 ETH');
  expect(screen.getByLabelText('Total Ticket Cost')).toHaveValue('0.0005 ETH');

});

test('Render of Transfer Ticket Components', () => {
  render(<TransferTicketPage />);

  // test the expected components are rendered correctly
  expect(screen.getByText('Upload Keystore File')).toBeInTheDocument();
  expect(screen.getByText('Manual Entry')).toBeInTheDocument();
  expect(screen.getByText('Number of Tickets')).toBeInTheDocument();
  expect(screen.getByText('Recipient Address')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('Wallet Address')).toBeInTheDocument();
  expect(screen.getByText('Private Key')).toBeInTheDocument();

  
  fireEvent.change(screen.getByLabelText('Number of Tickets'), { target: { value:2 } });
  expect(screen.getByLabelText('Number of Tickets')).toHaveValue('2');
});

test('Redeem ticket page', () => {
  render(<RedeemTicketPage userWalletAddress={'0x0123456789'} />);

  // test the expected components are rendered correctly
  expect(screen.getByText('Number of Tickets to Redeem')).toBeInTheDocument();
  expect(screen.getByText('Ticket Holder Wallet Address')).toBeInTheDocument();
  expect(screen.getByText('Doorman private key')).toBeInTheDocument();
  
  // test the wallet address renders the prop value and that the inputs can be changed
  expect(screen.getByLabelText('Ticket Holder Wallet Address')).toHaveValue('0x0123456789');
});