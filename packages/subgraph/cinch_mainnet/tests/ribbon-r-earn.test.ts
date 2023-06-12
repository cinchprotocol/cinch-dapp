import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { InitiateWithdraw } from "../generated/schema"
import { InitiateWithdraw as InitiateWithdrawEvent } from "../generated/Ribbon_rEarn/Ribbon_rEarn"
import { handleInitiateWithdraw } from "../src/ribbon-r-earn"
import { createInitiateWithdrawEvent } from "./ribbon-r-earn-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let shares = BigInt.fromI32(234)
    let round = BigInt.fromI32(234)
    let newInitiateWithdrawEvent = createInitiateWithdrawEvent(
      account,
      shares,
      round
    )
    handleInitiateWithdraw(newInitiateWithdrawEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("InitiateWithdraw created and stored", () => {
    assert.entityCount("InitiateWithdraw", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "InitiateWithdraw",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "account",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InitiateWithdraw",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "shares",
      "234"
    )
    assert.fieldEquals(
      "InitiateWithdraw",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "round",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
