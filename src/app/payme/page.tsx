"use client";
import { useReadContract, ConnectButton, TransactionButton, useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { client } from "../client";
import { createWallet } from "thirdweb/wallets";
import { baseSepolia, defineChain } from "thirdweb/chains";
import { prepareContractCall, toWei } from "thirdweb";
import { contract } from "../utils/contract";

const Payme = () => {
    const account = useActiveAccount();
    const wallets = [createWallet("com.coinbase.wallet")];

    const [tipAmount, setTipAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [coffees, setCoffees] = useState([]);

    const truncateWalletAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    const convertDate = (timestamp) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    };

    // Reading data from the contract
    const { data, refetch: refetchCoffees } = useReadContract({
        contract,
        method: "getCoffees",
        params: [],
    });

    useEffect(() => {
        if (data) {
            setCoffees(data);
        }
    }, [data]);

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
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-n1 dark:border-n2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                value={tipAmount}
                                onChange={(e) => setTipAmount(Number(e.target.value))}
                                step={0.1}
                            />

                            <label className="mt-4 text-sm">Message</label>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-n1 dark:border-n2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message here"
                            />
                        </div>

                        {message && tipAmount > 0 && (
                            <TransactionButton
                                className="mt-4"
                                transaction={() => (
                                    prepareContractCall({
                                        contract,
                                        method: "buyMeACoffee",
                                        params: [message],
                                        value: BigInt(toWei(tipAmount.toString())),
                                    })
                                )}
                                onTransactionConfirmed={() => {
                                    alert("Thank you for the tip!");
                                    setTipAmount(0);
                                    setMessage("");
                                    refetchCoffees();
                                }}
                            >
                                Send Tip
                            </TransactionButton>
                        )}
                    </div>
                )}

                {/* Showing Transactions */}
                <div className="flex flex-col mt-10">
                    <h3 className="font-semibold"> Total Tips: {coffees?.length} </h3>
                    <p className="text-sm font-bold text-n5 mt-2 mb-2"> Recent Tips </p>
                    {coffees && coffees.length > 0 && (
                        coffees.reverse().map((coffee, index) => (
                            <div
                                className="flex flex-col w-full justify-center gap-4 bg-n1 rounded-md p-4 mb-2"
                                key={index}
                            >
                                <p className="text-xs text-n4"> {truncateWalletAddress(coffee.sender)} </p>
                                <p className="text-xs text-n4"> {convertDate(coffee.timestamp)} </p>
                                <p className="text-sm mt-2"> {coffee.message} </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Payme;
