import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../Turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { transferV1 } from "@metaplex-foundation/mpl-token-metadata";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("aHWqWH5RCziuPRb9mkCmojKBiC3JjGYtzKgwZG8miod");

// Recipient address
const to = new PublicKey("6GNzpHkYuYqQeYrdxkurR8PAGMfs2RjvgcrnwNYAYQEg");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ataFromWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
        // Get the token account of the toWallet address, and if it does not exist, create it
        const ataToWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        )

        // Transfer the new token to the "toTokenAccount" we just created
        const transaction = await transfer(
            connection,
            keypair,
            ataFromWallet.address,
            ataToWallet.address,
            keypair.publicKey,
            1
        );
        console.log(`Succesfully Minted! , Transaction Here: https://explorer.solana.com/tx/${transaction}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();