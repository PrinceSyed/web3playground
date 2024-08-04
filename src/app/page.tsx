import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-nb text-center">
      <h1 className="text-n7 font-sans text-lg mb-4">Spikes Web 3 Experiments</h1>
      <div className="flex flex-col space-y-4">
        <div className="max-w-2xl px-8 py-4 rounded-lg shadow-md bg-n1">
          <div className="flex items-center justify-between">
            <Link href="/coinbase">Coinbase smart Wallet</Link>
          </div>
        </div>

        <div className="max-w-2xl px-8 py-4 bg-n1 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <Link href="/payme">Pay Me</Link>
          </div>
        </div>
      </div>
    </div>
  );
}