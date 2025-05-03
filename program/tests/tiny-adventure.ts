import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { TinyAdventure } from "../target/types/tiny_adventure"
import { assert } from "chai"

const IDL = require("../target/idl/.json");
const tinyAddress = new PublicKey("FnMVJJZVBCDKdEt8ZFmWCKhsKTBULQDj4MDcJkjH4Aoe");

describe('TinyAdventure', () => {
  let context;
  let provider =  anchor.setProvider(anchor.AnchorProvider.env());
  let tinyProgram = anchor.workspace.TinyAdventure as Program<TinyAdventure>;

  //create PDA for game data account
  const [gameAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from("level1", "utf8")],
    tinyAddress
  );

  it('Initialize', async () => {
    await tinyProgram.methods.initialize()
    .accounts({
      newGameDataAccount : gameAddress,
      signer: provider.wallet.PublicKey,
      systemProgram : SystemProgram.programId, 
    }). rpc();

    // Fetch the game data account
    const gameDataAccount = await tinyProgram.account.gameDataAccount.fetch(
      gameAddress
    )
    assert(gameDataAccount.playerPosition == 0)

    console.log(
      "Player position is:",
      gameDataAccount.playerPosition.toString()
    )

  })
})





/*
describe("tiny-adventure", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.TinyAdventure as Program<TinyAdventure>
  const wallet = anchor.workspace.TinyAdventure.provider.wallet

  // PDA for the game data account
  const [newGameDataAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("level1", "utf8")],
    program.programId
  )

  it("Initialize", async () => {
    // Initialize the game data account
    const tx = await program.methods
      .initialize()
      .accounts({
        newGameDataAccount: newGameDataAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    // Fetch the game data account
    const gameDataAccount = await program.account.gameDataAccount.fetch(
      newGameDataAccount
    )
    assert(gameDataAccount.playerPosition == 0)

    console.log(
      "Player position is:",
      gameDataAccount.playerPosition.toString()
    )
  })

  it("Run Right", async () => {
    // Move right 3 times
    for (let i = 0; i < 3; i++) {
      const tx = await program.methods
        .moveRight()
        .accounts({
          gameDataAccount: newGameDataAccount,
        })
        .rpc()
    }

    // Fetch the game data account
    const gameDataAccount = await program.account.gameDataAccount.fetch(
      newGameDataAccount
    )

    assert(gameDataAccount.playerPosition == 3)

    console.log(
      "Player position is:",
      gameDataAccount.playerPosition.toString()
    )
  })

  it("Run Left", async () => {
    // Move left 3 times
    for (let i = 0; i < 3; i++) {
      const tx = await program.methods
        .moveLeft()
        .accounts({
          gameDataAccount: newGameDataAccount,
        })
        .rpc()
    }

    // Fetch the game data account
    const gameDataAccount = await program.account.gameDataAccount.fetch(
      newGameDataAccount
    )

    assert(gameDataAccount.playerPosition == 0)

    console.log(
      "Player position is:",
      gameDataAccount.playerPosition.toString()
    )
  })
})
*/