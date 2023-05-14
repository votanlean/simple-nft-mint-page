import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import SimpleNFTABI from '../config/simple_nft.json'

export default function Home() {
  const [tokenURI, setTokenURI] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
    } catch (err) {
      console.error('Error connecting wallet:', err);
    }
  }

  async function mintNFT() {
    if (!isConnected) {
      alert('Please connect your wallet first.');
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const contractAddress = '0xE09439e6b9E4CfC45ec2A25Ea05876Ae981adb39';
    const simpleNFT = new ethers.Contract(contractAddress, SimpleNFTABI, signer);
    try {
      const tx = await simpleNFT.mintNFT(tokenURI);
      await tx.wait();
      alert('Your NFT has been minted!');
    } catch (err) {
      console.error('Error minting NFT: ', err);
    }
  }

  return (
    <div>
      <h1>Simple NFT Minting App</h1>
      <button onClick={connectWallet} disabled={isConnected}>
        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      <input
        type="text"
        placeholder="Token URI"
        value={tokenURI}
        onChange={e => setTokenURI(e.target.value)}
      />
      <button onClick={mintNFT} disabled={!isConnected}>
        Mint NFT
      </button>
    </div>
  );
}
