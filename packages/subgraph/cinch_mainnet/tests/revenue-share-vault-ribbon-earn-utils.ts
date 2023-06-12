import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  CinchPerformanceFeePercentageUpdated,
  DepositPaused,
  DepositUnpaused,
  DepositWithReferral,
  Initialized,
  OwnershipTransferred,
  Paused,
  Redeem,
  RedeemWithReferral,
  RevenueShareBalanceByAssetReferralUpdated,
  RevenueShareDeposited,
  RevenueShareReferralAdded,
  RevenueShareReferralRemoved,
  RevenueShareWithdrawn,
  TotalSharesByUserReferralUpdated,
  Transfer,
  Unpaused,
  YieldSourceVaultUpdated
} from "../generated/RevenueShareVaultRibbonEarn/RevenueShareVaultRibbonEarn"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createCinchPerformanceFeePercentageUpdatedEvent(
  feePercentage: BigInt
): CinchPerformanceFeePercentageUpdated {
  let cinchPerformanceFeePercentageUpdatedEvent = changetype<
    CinchPerformanceFeePercentageUpdated
  >(newMockEvent())

  cinchPerformanceFeePercentageUpdatedEvent.parameters = new Array()

  cinchPerformanceFeePercentageUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "feePercentage",
      ethereum.Value.fromUnsignedBigInt(feePercentage)
    )
  )

  return cinchPerformanceFeePercentageUpdatedEvent
}

export function createDepositPausedEvent(account: Address): DepositPaused {
  let depositPausedEvent = changetype<DepositPaused>(newMockEvent())

  depositPausedEvent.parameters = new Array()

  depositPausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return depositPausedEvent
}

export function createDepositUnpausedEvent(account: Address): DepositUnpaused {
  let depositUnpausedEvent = changetype<DepositUnpaused>(newMockEvent())

  depositUnpausedEvent.parameters = new Array()

  depositUnpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return depositUnpausedEvent
}

export function createDepositWithReferralEvent(
  caller: Address,
  receiver: Address,
  assets: BigInt,
  shares: BigInt,
  referral: Address
): DepositWithReferral {
  let depositWithReferralEvent = changetype<DepositWithReferral>(newMockEvent())

  depositWithReferralEvent.parameters = new Array()

  depositWithReferralEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  depositWithReferralEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  depositWithReferralEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  depositWithReferralEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )
  depositWithReferralEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )

  return depositWithReferralEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRedeemEvent(
  caller: Address,
  receiver: Address,
  sharesOwner: Address,
  assets: BigInt,
  shares: BigInt
): Redeem {
  let redeemEvent = changetype<Redeem>(newMockEvent())

  redeemEvent.parameters = new Array()

  redeemEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  redeemEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  redeemEvent.parameters.push(
    new ethereum.EventParam(
      "sharesOwner",
      ethereum.Value.fromAddress(sharesOwner)
    )
  )
  redeemEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  redeemEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return redeemEvent
}

export function createRedeemWithReferralEvent(
  caller: Address,
  receiver: Address,
  sharesOwner: Address,
  assets: BigInt,
  shares: BigInt,
  referral: Address
): RedeemWithReferral {
  let redeemWithReferralEvent = changetype<RedeemWithReferral>(newMockEvent())

  redeemWithReferralEvent.parameters = new Array()

  redeemWithReferralEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  redeemWithReferralEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  redeemWithReferralEvent.parameters.push(
    new ethereum.EventParam(
      "sharesOwner",
      ethereum.Value.fromAddress(sharesOwner)
    )
  )
  redeemWithReferralEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  redeemWithReferralEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )
  redeemWithReferralEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )

  return redeemWithReferralEvent
}

export function createRevenueShareBalanceByAssetReferralUpdatedEvent(
  asset_: Address,
  referral: Address,
  shares_: BigInt
): RevenueShareBalanceByAssetReferralUpdated {
  let revenueShareBalanceByAssetReferralUpdatedEvent = changetype<
    RevenueShareBalanceByAssetReferralUpdated
  >(newMockEvent())

  revenueShareBalanceByAssetReferralUpdatedEvent.parameters = new Array()

  revenueShareBalanceByAssetReferralUpdatedEvent.parameters.push(
    new ethereum.EventParam("asset_", ethereum.Value.fromAddress(asset_))
  )
  revenueShareBalanceByAssetReferralUpdatedEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )
  revenueShareBalanceByAssetReferralUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "shares_",
      ethereum.Value.fromUnsignedBigInt(shares_)
    )
  )

  return revenueShareBalanceByAssetReferralUpdatedEvent
}

export function createRevenueShareDepositedEvent(
  assetsFrom: Address,
  asset: Address,
  amount: BigInt
): RevenueShareDeposited {
  let revenueShareDepositedEvent = changetype<RevenueShareDeposited>(
    newMockEvent()
  )

  revenueShareDepositedEvent.parameters = new Array()

  revenueShareDepositedEvent.parameters.push(
    new ethereum.EventParam(
      "assetsFrom",
      ethereum.Value.fromAddress(assetsFrom)
    )
  )
  revenueShareDepositedEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  revenueShareDepositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return revenueShareDepositedEvent
}

export function createRevenueShareReferralAddedEvent(
  referral: Address
): RevenueShareReferralAdded {
  let revenueShareReferralAddedEvent = changetype<RevenueShareReferralAdded>(
    newMockEvent()
  )

  revenueShareReferralAddedEvent.parameters = new Array()

  revenueShareReferralAddedEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )

  return revenueShareReferralAddedEvent
}

export function createRevenueShareReferralRemovedEvent(
  referral: Address
): RevenueShareReferralRemoved {
  let revenueShareReferralRemovedEvent = changetype<
    RevenueShareReferralRemoved
  >(newMockEvent())

  revenueShareReferralRemovedEvent.parameters = new Array()

  revenueShareReferralRemovedEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )

  return revenueShareReferralRemovedEvent
}

export function createRevenueShareWithdrawnEvent(
  asset: Address,
  amount: BigInt,
  referral: Address,
  receiver: Address
): RevenueShareWithdrawn {
  let revenueShareWithdrawnEvent = changetype<RevenueShareWithdrawn>(
    newMockEvent()
  )

  revenueShareWithdrawnEvent.parameters = new Array()

  revenueShareWithdrawnEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  revenueShareWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  revenueShareWithdrawnEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )
  revenueShareWithdrawnEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )

  return revenueShareWithdrawnEvent
}

export function createTotalSharesByUserReferralUpdatedEvent(
  user: Address,
  referral: Address,
  shares_: BigInt
): TotalSharesByUserReferralUpdated {
  let totalSharesByUserReferralUpdatedEvent = changetype<
    TotalSharesByUserReferralUpdated
  >(newMockEvent())

  totalSharesByUserReferralUpdatedEvent.parameters = new Array()

  totalSharesByUserReferralUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  totalSharesByUserReferralUpdatedEvent.parameters.push(
    new ethereum.EventParam("referral", ethereum.Value.fromAddress(referral))
  )
  totalSharesByUserReferralUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "shares_",
      ethereum.Value.fromUnsignedBigInt(shares_)
    )
  )

  return totalSharesByUserReferralUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createYieldSourceVaultUpdatedEvent(
  yieldSourceVault_: Address
): YieldSourceVaultUpdated {
  let yieldSourceVaultUpdatedEvent = changetype<YieldSourceVaultUpdated>(
    newMockEvent()
  )

  yieldSourceVaultUpdatedEvent.parameters = new Array()

  yieldSourceVaultUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "yieldSourceVault_",
      ethereum.Value.fromAddress(yieldSourceVault_)
    )
  )

  return yieldSourceVaultUpdatedEvent
}
