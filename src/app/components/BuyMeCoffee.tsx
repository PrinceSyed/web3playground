'use client';
import { baseSepolia, defineChain } from "thirdweb/chains";
import { client } from "../client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

export const BuyMeCoffee = () => {
    const account = useActiveAccount();

    if(account) {
        return (
            <div className="flex flex-col items-center justify-between p-24">
                <ConnectButton
                    client={client}
                    chain={defineChain(baseSepolia)}
                />
            </div>
        );
    }
};
