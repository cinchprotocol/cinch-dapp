import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";


function RevenueShareMechanism({ web3 }) {
  return (
    <>
      <div className="bg-slate-50">
        <CommonHead />
        <DAppHeader web3={web3} />
        <main>
          <Container className="h-screen">
            <div>
              <div class="mt-10 mx-auto max-w-xl">
                <HeaderText01>Choose revenue-share mechanism</HeaderText01>
                <ul role="list" class="space-y-8">
                  <li class="overflow-hidden">
                    <a class="relative flex cursor-pointer rounded-2xl border-2 bg-white p-4 shadow-sm focus:outline-none" href="/revenueroyaltyinputs">
                      <span class="flex flex-1">
                        <span class="flex flex-col">
                          <span id="project-type-0-label" class="block text-lg font-semibold text-gray-900">Revenue Royalty</span>
                          <span id="project-type-0-description-0" class="mt-1 flex items-center text-sm text-gray-500">Proportion of revenue is traded to buyer</span>
                        </span>
                      </span>
                    </a>
                  </li>

                  <li class="overflow-hidden">
                    <a class="relative flex cursor-pointer rounded-2xl border-2 bg-white p-4 shadow-sm focus:outline-none" href="/wip">
                      <span class="flex flex-1">
                        <span class="flex flex-col">
                          <span id="project-type-1-label" class="block text-lg font-semibold text-gray-900">Liquid Value tokens [COMING SOON]</span>
                          <span id="project-type-1-description-0" class="mt-1 flex items-center text-sm text-gray-500">Each token represents a fixed dollar value. Create recuring buy orders from the liquidty pool until
                            all tokens have been burned.</span>
                        </span>
                      </span>
                    </a>
                  </li>

                </ul>






              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Web3Consumer(RevenueShareMechanism);