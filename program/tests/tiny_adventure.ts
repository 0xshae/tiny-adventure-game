import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { TinyAdventure } from "../target/types/tiny_adventure"
import { assert } from "chai"

const IDL = require("../target/idl/tiny_adventure.json");
const tinyAddress = new PublicKey("FnMVJJZVBCDKdEt8ZFmWCKhsKTBULQDj4MDcJkjH4Aoe");

describe('TinyAdventure', () => {
  let context;
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  let tinyProgram = anchor.workspace.TinyAdventure as Program<TinyAdventure>;

  //create PDA for game data account
  const [gameAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from("level1", "utf8")],
    tinyAddress
  );

  it('Initialize', async () => {
    try{
      await tinyProgram.methods.initialize()
      .accounts({
        newGameDataAccount: gameAddress,
        signer: provider.wallet.publicKey,
        systemProgram : SystemProgram.programId, 
      }). rpc();
    } catch (err) {
      console.log("Transaction failed", err.logs);
      throw err;
    } 
    
    // Fetch the game data account
    const gameDataAccount = await tinyProgram.account.gameDataAccount.fetch(
      gameAddress
    )
    //assert(gameDataAccount.playerPosition == 0)

    console.log(
      "Player position is:",
      gameDataAccount.playerPosition.toString()
    )

  })

  it('Moves Right', async () => {
    await tinyProgram.methods.moveRight()
      .accounts({
        gameDataAccount : gameAddress
      }).rpc();
  

  //Fetch game data account
  const gameDataAccount = await tinyProgram.account.gameDataAccount.fetch(
    gameAddress)
  
  assert(gameDataAccount.playerPosition == 3)

  console.log(
    "Player position after one more right move is: ",
    gameDataAccount.playerPosition.toString()
  )

})
it('Moves Left', async () => {
   await tinyProgram.methods.moveLeft()
     .accounts({
       gameDataAccount : gameAddress
     }).rpc();


//Fetch game data account
const gameDataAccount = await tinyProgram.account.gameDataAccount.fetch(
  gameAddress)

assert(gameDataAccount.playerPosition > 0)

console.log(
  "Player position after one more left move is: ",
  gameDataAccount.playerPosition.toString()
)

})

})


