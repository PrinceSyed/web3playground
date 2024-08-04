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
        <div className="flex w-full p-10 align-middle justify-center">
            <div className="max-w[500px]">
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
                    <div className="paySection">
                        <div className="flex flex-col">
                            <label>Amount</label>
                            <input className="text-n3"
                                type="number"
                                value={tipAmount}
                                onChange={(e) => setTipAmount(Number(e.target.value))}
                                step={0.1}
                            />

                            <label>Message</label>
                            <input type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message here"
                            />
                        </div>

                        {/* If the message and tip amoount is not empty and bigger than 0 then show transaction button */}
                        {message && tipAmount > 0 && (
                            // Transaction Button that calls the method from smart contract
                            <TransactionButton
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
                    <p> Recent Tips </p>
                    {contractEvents && contractEvents.length > 0 && (
                        [...contractEvents].reverse().map((event: any, index) => (
                            <div className="flex flex-col bg-n1 rounded-md p-4 mb-2"
                                key={index}
                            >
                                {/* Add content for each event here */}
                                <p> {truncateWalletAddress(event.args.sender)}  </p>
                                <p> {convertDate(event.args.timestamp)} </p>
                                <p> {event.args.message} </p>
                            </div>
                        ))
                    )}

                </div>

            </div>


        </div>
    );
}

export default Payme;