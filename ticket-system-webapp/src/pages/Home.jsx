import { Tile } from '@carbon/react';

// Hom Page Component to give users an overview of the Match Ticketing System and its features
const Home = () => {
  return (
    <div style={{ marginTop: '5%', marginLeft: '15%', marginRight: '15%', marginBottom:'5%', border: '5px solid rgb(0, 175, 117)' }}>
            <Tile>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Welcome to the Match Ticketing System</h3>
                    <div>
                        <p>This ticketing system is built on the SePolia network</p>
                        <p>We facilitate ease of use for customers when dealing with MatchTicket Tokens</p>
                        <p>We support wallet creation, balance checking, token purchases, token transfer and redeeming token</p>
                        <p>This system is designed to support the use of customers, doormen and venues stakeholders</p>
                    </div>
                </div>
            </Tile>
    </div>
  )
}

export default Home;