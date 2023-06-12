import {
  InitiateWithdraw as InitiateWithdrawEvent,
  InstantWithdraw as InstantWithdrawEvent,
  Redeem as RedeemEvent,
  Withdraw as WithdrawEvent
} from "../generated/Ribbon_rEarn/Ribbon_rEarn"
import {
  InitiateWithdraw,
  InstantWithdraw,
  Redeem,
  Withdraw
} from "../generated/schema"

export function handleInitiateWithdraw(event: InitiateWithdrawEvent): void {
  let entity = new InitiateWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.shares = event.params.shares
  entity.round = event.params.round

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInstantWithdraw(event: InstantWithdrawEvent): void {
  let entity = new InstantWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.amount = event.params.amount
  entity.round = event.params.round

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRedeem(event: RedeemEvent): void {
  let entity = new Redeem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.share = event.params.share
  entity.round = event.params.round

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.amount = event.params.amount
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
