import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmRawTransaction, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";

import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our Turbin3 public key
const to = new PublicKey("HhL18oTmtjEKMSjqLgirEYDD1aN12zPoeDGPCVgSfc1R");

// Create a solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async() => {
    try {
        const transaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: LAMPORTS_PER_SOL/100
        }));
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        //Sign transaciton, broadcast and confirm
        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);

        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();


