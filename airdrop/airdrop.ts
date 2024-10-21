import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

//5ntcD2VvMDa8c9WFQE84CEyCDUp3QxVcMEjHFMDJAVNL
import wallet from './dev-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection to airdrop devnet SOL tokens

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Claiming 2 devnet SOL tokens
        const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
        console.log("Script finished.");
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();