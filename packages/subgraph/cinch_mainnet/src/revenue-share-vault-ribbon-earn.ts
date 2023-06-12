import {
  Approval as ApprovalEvent,
  CinchPerformanceFeePercentageUpdated as CinchPerformanceFeePercentageUpdatedEvent,
  DepositPaused as DepositPausedEvent,
  DepositUnpaused as DepositUnpausedEvent,
  DepositWithReferral as DepositWithReferralEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Redeem as RedeemEvent,
  RedeemWithReferral as RedeemWithReferralEvent,
  RevenueShareBalanceByAssetReferralUpdated as RevenueShareBalanceByAssetReferralUpdatedEvent,
  RevenueShareDeposited as RevenueShareDepositedEvent,
  RevenueShareReferralAdded as RevenueShareReferralAddedEvent,
  RevenueShareReferralRemoved as RevenueShareReferralRemovedEvent,
  RevenueShareWithdrawn as RevenueShareWithdrawnEvent,
  TotalSharesByUserReferralUpdated as TotalSharesByUserReferralUpdatedEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent,
  YieldSourceVaultUpdated as YieldSourceVaultUpdatedEvent
} from "../generated/RevenueShareVaultRibbonEarn/RevenueShareVaultRibbonEarn"
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
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCinchPerformanceFeePercentageUpdated(
  event: CinchPerformanceFeePercentageUpdatedEvent
): void {
  let entity = new CinchPerformanceFeePercentageUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feePercentage = event.params.feePercentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositPaused(event: DepositPausedEvent): void {
  let entity = new DepositPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositUnpaused(event: DepositUnpausedEvent): void {
  let entity = new DepositUnpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositWithReferral(
  event: DepositWithReferralEvent
): void {
  let entity = new DepositWithReferral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.referral = event.params.referral

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


export function handleRevenueShareBalanceByAssetReferralUpdated(
  event: RevenueShareBalanceByAssetReferralUpdatedEvent
): void {
  let entity = new RevenueShareBalanceByAssetReferralUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.asset_ = event.params.asset_
  entity.referral = event.params.referral
  entity.shares_ = event.params.shares_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevenueShareDeposited(
  event: RevenueShareDepositedEvent
): void {
  let entity = new RevenueShareDeposited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.assetsFrom = event.params.assetsFrom
  entity.asset = event.params.asset
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevenueShareReferralAdded(
  event: RevenueShareReferralAddedEvent
): void {
  let entity = new RevenueShareReferralAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.referral = event.params.referral

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevenueShareReferralRemoved(
  event: RevenueShareReferralRemovedEvent
): void {
  let entity = new RevenueShareReferralRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.referral = event.params.referral

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevenueShareWithdrawn(
  event: RevenueShareWithdrawnEvent
): void {
  let entity = new RevenueShareWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.asset = event.params.asset
  entity.amount = event.params.amount
  entity.referral = event.params.referral
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTotalSharesByUserReferralUpdated(
  event: TotalSharesByUserReferralUpdatedEvent
): void {
  let entity = new TotalSharesByUserReferralUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.referral = event.params.referral
  entity.shares_ = event.params.shares_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleYieldSourceVaultUpdated(
  event: YieldSourceVaultUpdatedEvent
): void {
  let entity = new YieldSourceVaultUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.yieldSourceVault_ = event.params.yieldSourceVault_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
