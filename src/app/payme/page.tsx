"use client";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useContractEvents, useReadContract } from "thirdweb/react";
import { client } from "../client";
import { createWallet } from "thirdweb/wallets";
import { baseSepolia, defineChain } from "thirdweb/chains";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { balanceOf, claimTo, getNFT } from "thirdweb/extensions/erc1155";
import { use, useState } from "react";
import { contract } from "../utils/contract";

const Payme = () => {
    const account = useActiveAccount();
    const wallets = [createWallet("com.coinbase.wallet")];

    const [tipAmount, setTipAmount] = useState(0);
    const [message, setMessage] = useState("");

    const truncateWalletAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    const convertDate = (timestamp: bigint) => {
        const timestampNumber = Number(timestamp);
        return new Date(timestampNumber * 1000).toLocaleString();
    };

    // Reading data from the contract
    const {
        data: totalCoffee,
        refetch: refetchTotalCoffee,
    } = useReadContract({
        contract: contract,
        method: "getTotalCoffee",
    });

    //Contract Events
    const {
        data: contractEvents,
        refetch: refetchContractEvents,
    } = useContractEvents({
        contract: contract
    });

    return (
        <div className="flex w-full p-10 align-middle justify-center max-w-[500px] items-center mx-auto">
            <div className="w-full">
                <h2> Pay Me </h2>

                {/* Connect Button */}
                <div>
                    <ConnectButton
                        client={client}
                        wallets={wallets}
                        chain={defineChain(baseSepolia)}
                    />
                    <div />
                </div>

                {/* Pay Input */}
                {account && (
                    <div className="paySection mt-4 mb-2">
                        <div className="flex flex-col">
                            <label className="text-sm">Amount</label>
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-n1 dark:border-n2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                value={tipAmount}
                                onChange={(e) => setTipAmount(Number(e.target.value))}
                                step={0.1}
                            />

                            <label className="mt-4 text-sm">Message</label>
                            <input type="text p-4 text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-n1 dark:border-n2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message here"
                            />
                        </div>

                        {/* If the message and tip amoount is not empty and bigger than 0 then show transaction button */}
                        {message && tipAmount > 0 && (
                            // Transaction Button that calls the method from smart contract
                            <TransactionButton className="mt-4"
                                transaction={() => (
                                    prepareContractCall({
                                        contract: contract,
                                        method: "buyMeACoffee",
                                        params: [message],
                                        value: BigInt(toWei(tipAmount.toString())),
                                    })
                                )}
                                onTransactionConfirmed={() => {
                                    alert("Thank you for the tip!");
                                    setTipAmount(0);
                                    setMessage("");
                                    refetchTotalCoffee();
                                }}
                            >
                                Send Tip
                            </TransactionButton>
                        )}
                    </div>
                )}

                {/* Showing Transactions */}
                <div className="flex flex-col mt-10">
                    <h3 className="font-semibold"> Total TIps: {totalCoffee?.toString()} </h3>
                    <p className="text-sm font-bold text-n5 mt-2 mb-2"> Recent Tips </p>
                    {contractEvents && contractEvents.length > 0 && (
                        [...contractEvents].reverse().map((event: any, index) => (
                            <div className="flex flex-col w-full justify-center gap-4 bg-n1 rounded-md p-4 mb-2"
                                key={index}
                            >
                                {/* Add content for each event here */}
                                <p className="text-xs text-n4"> {truncateWalletAddress(event.args.sender)}  </p>
                                <p className="text-xs text-n4"> {convertDate(event.args.timestamp)} </p>
                                <p className="text-sm mt-2"> {event.args.message} </p>
                            </div>
                        ))
                    )}

                </div>

            </div>


        </div>
    );
}

export default Payme;