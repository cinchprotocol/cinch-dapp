import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  InitiateWithdraw,
  InstantWithdraw,
  Redeem,
  Withdraw
} from "../generated/Ribbon_rEarn/Ribbon_rEarn"

export function createInitiateWithdrawEvent(
  account: Address,
  shares: BigInt,
  round: BigInt
): InitiateWithdraw {
  let initiateWithdrawEvent = changetype<InitiateWithdraw>(newMockEvent())

  initiateWithdrawEvent.parameters = new Array()

  initiateWithdrawEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  initiateWithdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )
  initiateWithdrawEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return initiateWithdrawEvent
}

export function createInstantWithdrawEvent(
  account: Address,
  amount: BigInt,
  round: BigInt
): InstantWithdraw {
  let instantWithdrawEvent = changetype<InstantWithdraw>(newMockEvent())

  instantWithdrawEvent.parameters = new Array()

  instantWithdrawEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  instantWithdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  instantWithdrawEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return instantWithdrawEvent
}

export function createRedeemEvent(
  account: Address,
  share: BigInt,
  round: BigInt
): Redeem {
  let redeemEvent = changetype<Redeem>(newMockEvent())

  redeemEvent.parameters = new Array()

  redeemEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  redeemEvent.parameters.push(
    new ethereum.EventParam("share", ethereum.Value.fromUnsignedBigInt(share))
  )
  redeemEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return redeemEvent
}

export function createWithdrawEvent(
  account: Address,
  amount: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}
