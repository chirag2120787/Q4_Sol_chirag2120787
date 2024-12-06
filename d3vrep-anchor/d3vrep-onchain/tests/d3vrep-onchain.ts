import * as anchor from "@coral-xyz/anchor";
import { D3vrepOnchain } from "../target/types/d3vrep_onchain";
import { expect } from 'chai'

const program = anchor.workspace.D3vrepOnchain as anchor.Program<D3vrepOnchain>;

describe("d3vrep-onchain", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  it("Register developer profile", async () => {
    const wallet = anchor.web3.Keypair.generate();
    const githubUsername = "testuser123";

    // Airdrop some SOL to the wallet
    const connection = anchor.getProvider().connection;
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    const blockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      signature: airdropSignature,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    });

    const [developerPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("developer"), wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods.registerDeveloper(githubUsername)
      .accountsPartial({
        developerProfile: developerPDA,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet])
      .rpc();
      
    console.log("tx", tx);
    const profile = await program.account.developerProfile.fetch(developerPDA);
    expect(profile.githubUsername).to.equal(githubUsername);
    expect(profile.wallet.toBase58()).to.equal(wallet.publicKey.toBase58());
    expect(profile.isActive).to.equal(true);
  });

  it("Update developer profile", async () => {
    const wallet = anchor.web3.Keypair.generate();
    const initialGithubUsername = "initial123";
    const newGithubUsername = "updated123";

    // Airdrop some SOL
    const connection = anchor.getProvider().connection;
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    const blockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      signature: airdropSignature,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    });

    const [developerPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("developer"), wallet.publicKey.toBuffer()],
      program.programId
    );

    // First register the developer
    await program.methods
      .registerDeveloper(initialGithubUsername)
      .accountsPartial({
        developerProfile: developerPDA,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet])
      .rpc();

    // Update the profile
    await program.methods
      .updateProfile(newGithubUsername)
      .accountsPartial({
        developerProfile: developerPDA,
        user: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();

    const updatedProfile = await program.account.developerProfile.fetch(developerPDA);
    expect(updatedProfile.githubUsername).to.equal(newGithubUsername);
  });

  it("Deactivate developer profile", async () => {
    const wallet = anchor.web3.Keypair.generate();
    const githubUsername = "tobedeactivated";

    // Airdrop some SOL
    const connection = anchor.getProvider().connection;
    const airdropSignature1 = await connection.requestAirdrop(
      wallet.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    let blockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      signature: airdropSignature1,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    });

    const [developerPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("developer"), wallet.publicKey.toBuffer()],
      program.programId
    );

    // First register the developer
    await program.methods
      .registerDeveloper(githubUsername)
      .accountsPartial({
        developerProfile: developerPDA,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet])
      .rpc();

    // Deactivate the profile
    await program.methods
      .deactivateProfile()
      .accountsPartial({
        developerProfile: developerPDA,
        user: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();

      try {
        await program.account.developerProfile.fetch(developerPDA);
        expect.fail("Expected an error: Account should not exist after being closed");
      } catch (error) {
        // We expect an error of type AccountNotFoundError
        console.log("error", error);
        expect(error.toString()).to.include('Account does not exist or has no data');
      }
  });
  
});
