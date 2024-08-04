"use client";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "../client";
import React from 'react';
import { createWallet } from "thirdweb/wallets";
import { baseSepolia, defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { balanceOf, claimTo, getNFT } from "thirdweb/extensions/erc1155";

const Coinbase = () => {
    const account = useActiveAccount();
    const wallets = [createWallet("com.coinbase.wallet")];

    // Get Chain and Contract Address
    const contract = getContract({
        client: client,
        chain: defineChain(baseSepolia),
        address: "0x5443924cb774AbA74Dc4D24e3e24f3a58c1E0182"
    });

    // Get NFT Data From Contract To Show Image
    const { data: nft, isLoading: nftIsLoading } = useReadContract(
        getNFT, {
            contract: contract,
            tokenId: BigInt(0)
        }
    );

    // Check User's NFT Balance
    const { data: ownedNFTs } = useReadContract(
        balanceOf, {
            contract: contract,
            owner: account?.address || "",
            tokenId: BigInt(0)
        }
    );

    return (
        <div className="flex flex-col items-center justify-between p-24">
            <ConnectButton 
                client={client}
                wallets={wallets}
                chain={defineChain(baseSepolia)}
            />
            <div className="flex flex-col my-8">
                {nftIsLoading ? (
                    <p>Loading</p>
                ) : (
                    <>
                        {nft && (
                            <MediaRenderer className="rounded-lg"
                                client={client}
                                src={nft.metadata.image}
                            />
                        )}
                        {account ? (
                            <>
                                <p className="text-center mt-4 mb-2 text-n5"> 
                                    You own {ownedNFTs?.toString()} NFTs 
                                </p>
                                <TransactionButton
                                transaction={() => 
                                    claimTo({
                                        contract: contract,
                                        to: account.address,
                                        tokenId: BigInt(0),
                                        quantity: 1n
                                    })
                                }

                                onTransactionConfirmed={async () => {
                                    alert("NFT Claimed");
                                }}

                                > Claim </TransactionButton>
                            </>
                        ) : (
                            <p className="text-center mt-4 text-n5">Connect to claim NFT</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Coinbase;