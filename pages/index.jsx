import axios from 'axios';
import { ethers } from 'ethers';
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import Identicon from "react-identicons";

// const Info = {
//   address: "0xd9DCAdC6Ad6dAEC5f5454924570bEA1a19fE3a22",
//   isContract: true,
//   name: "Dummy Token",
//   symbol: "DUMMY",
//   balance: "100.0"
// };


const isValid = (account) => ethers.utils.isAddress(account);
//https://opensea.io/collection/oipunksnfts
//https://opensea.io/collection/OiPunks

export default function Home() {

  const [address, setAddress] = useState(''); 
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressChange = (address) => {
    setAddress(address)
    setAccountInfo(null)
    setError('')
  };

  const searchToken = async () => {
     console.log(address);
     setLoading(true)
     setError(null);

     try {
       
      const response = await axios.get(`/api/getAccountInfo?address=${address}`)

      const accountData = response.data
      setAccountInfo(accountData)

        console.log(accountData);

        setLoading(false)

     } catch (error) {
      setLoading(false)
      setAccountInfo(null)
     setError(null);
     }
  }


  
  
  return (
    <div>
      <Head>
        <title>Ethereum NFT Account ADDRESSES SEARCH</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h4>Howdy there</h4>

      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-center w-full md:w-2/5 sm:w-3/5">
          <h1 className="text-3xl font-bold mb-6">Ethereum NFT Search</h1>
          <div className="flex w-full">
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Enter Address"
              className="flex-1 p-2 mr- 2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={searchToken}
               disabled={!isValid(address)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Search
            </button>
          </div>

          {loading && <p className="mt-4">Loading...</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}

          {accountInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded w-full">
              <div className="flex justify-start items-center space-x-2 ">
                <Identicon 
                  className="shadow rounded-full"
                  size={30}
                  string={accountInfo.address}
                />
                {accountInfo.isContract ? (
                  <Link
                  //https://opensea.io/collection/oipunksnfts
                    href={`https://rarible.com/` + accountInfo.name.toLowerCase()}
                    target="_blank"
                    className="flex flex-col"
                  >
                    <span className="text-md">
                      {accountInfo.name} <span className="text-xs"> ({accountInfo.symbol})</span>
                    </span>
                    <span className="flex space-x-2 text-xs text-slate-600">
                      <span>{accountInfo.address}</span>{' '}
                      <div className="flex justify-start items-center">
                        (<FaEthereum size={15} /> <span>{accountInfo.balance}</span>)
                      </div>
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={`https://etherscan.io/address/` + accountInfo.address}
                    target="_blank"
                    className="flex space-x-2 text-xs text-slate-600"
                  >
                    <span>{accountInfo.address}</span>{' '}
                    <div className="flex justify-start items-center">
                      (<FaEthereum size={15} /> <span>{accountInfo.balance}</span>)
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
