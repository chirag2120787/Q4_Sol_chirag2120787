import wallet from "../Turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    fetchMetadataFromSeeds,
    updateV1,
    UseMethod
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("aHWqWH5RCziuPRb9mkCmojKBiC3JjGYtzKgwZG8miod")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

// update metadata
(async () => {
    try {
        const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });
        await updateV1(umi, {
            mint,
            authority: signer,
            data: { ...initialMetadata, uri: "https://bafybeibkuftbemrioakgyslvf27ulwajw5dfv46ep7rjysza76scr45yre.ipfs.w3s.link" }
        }).sendAndConfirm(umi)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// create metadata
(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer
        }

        let data: DataV2Args = {
            name: "Turbin3 Token",
            symbol: "ILT3",
            uri: "https://bafybeibkuftbemrioakgyslvf27ulwajw5dfv46ep7rjysza76scr45yre.ipfs.w3s.link",
            creators: [{
                address: signer.publicKey,
                verified: true,
                share: 100
            }],
            collection: null,
            sellerFeeBasisPoints: 500,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
