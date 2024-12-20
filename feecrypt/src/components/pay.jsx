import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Big from 'big.js';
import Web3 from 'web3'; // Import Web3 for blockchain interactions
import './pay.css'; // Import the CSS file

const Pay = () => {
  const [feesData, setFeesData] = useState({}); // Store fees as an object
  const [selectedFees, setSelectedFees] = useState([]); // Track selected fees
  const [totalAmount, setTotalAmount] = useState(new Big(0)); // Track total amount to pay
  const { state } = useLocation();
  const { RegNo } = state || {};

  const OWNER_ADDRESS=import.meta.env.VITE_OWNER_ADDRESS;
  const CONTRACT_ADDRESS=import.meta.env.VITE_CONTRACT_ADDRESS;

  const CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "student",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "FeePaid",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "payFee",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  useEffect(() => {
    if (RegNo) {
      // Fetch fees data from backend using RegNo
      axios
        .get("https://feetest.onrender.com/pay", { params: { RegNo } })
        .then((response) => {
          setFeesData(response.data.Fees);
        })
        .catch((error) => {
          console.error('Error fetching fees data:', error);
        });
    }

    if (window.ethereum) {
      window.ethereum.enable(); // Request account access if needed
    }
  }, [RegNo]);

  const handleCheckboxChange = (key, value) => {
    const amount = new Big(value); // Convert value to Big for precision
    if (selectedFees.includes(key)) {
      // Remove fee if already selected
      setSelectedFees((prev) => prev.filter((fee) => fee !== key));
      setTotalAmount((prev) => prev.minus(amount));
    } else {
      // Add fee if not already selected
      setSelectedFees((prev) => [...prev, key]);
      setTotalAmount((prev) => prev.plus(amount));
    }
  };

  const handlePay = async () => {
    try {
      const web3 = new Web3(window.ethereum); // Initialize Web3
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request user accounts
      const accounts = await web3.eth.getAccounts(); // Get user's accounts
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  
      const receipt = await contract.methods
        .payFee()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(totalAmount.toString(), 'ether'),
          to: OWNER_ADDRESS,
        });
  
      alert(`Transaction successful! Transaction ID: ${receipt.transactionHash}`);
  
      // Save the data into the 'fees' collection
      const RegNo1 = RegNo.toString();
      const selectedFees1 = selectedFees.toString();
      const totalAmount1 = totalAmount.toString();
      const transactionId1 = receipt.transactionHash.toString();
      const timestamp1 = new Date().toString();
  
      try {
        // Send the fee data to the backend using axios.post
        await axios.post("https://feetest.onrender.com/fees", {
          RegNo1,
          selectedFees1,
          totalAmount1,
          transactionId1,
          timestamp1,
        });
      } catch (err) {
        console.error('Error saving fee data:', err);
      }
  
      // Update the UI to display the receipt
      setSelectedFees([]); // Clear selected fees
      setTotalAmount(new Big(0)); // Reset total amount
      document.getElementById('receipt').innerHTML = `
        <h2>Receipt</h2>
        <p><strong>Reg No:</strong> ${RegNo}</p>
        <p><strong>Total Amount Sent:</strong> ${totalAmount1} ETH</p>
        <p><strong>Transaction ID:</strong> ${transactionId1}</p>
        <p><strong>Paid Fees:</strong> ${selectedFees1}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `;
  
      // Reload the page data (or trigger a re-fetch)
      axios
        .get("https://feetest.onrender.com/pay", { params: { RegNo } })
        .then((response) => {
          setFeesData(response.data.Fees); // Update fees data
        })
        .catch((error) => {
          console.error('Error refreshing fees data:', error);
        });
    } catch (error) {
      console.error('Payment failed:', error);
      alert(error);
    }
  };
  
  
  return (
    <div className="pay-container">
      <h1>Fees Payment</h1>
      {Object.keys(feesData).length > 0 ? (
        <div>
          {Object.entries(feesData).map(([key, value]) =>
            value > 0 ? (
              <div key={key} className="fee-item">
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(key, value)}
                    checked={selectedFees.includes(key)}
                  />
                  <strong> {key}:</strong> {value}
                </label>
              </div>
            ) : null
          )}
          <div className="summary">
            <p>
              <strong>Selected Fees:</strong>{' '}
              {selectedFees.length > 0 ? selectedFees.join(', ') : 'None'}
            </p>
            <p>
              <strong>Total Amount to Pay:</strong> {totalAmount.toFixed(6)} ETH
            </p>
            <button
              onClick={handlePay}
              className="pay-button"
              disabled={selectedFees.length === 0} 
            >
              Pay Now
            </button>
          </div>
          <div id="receipt"></div> 
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Pay;
