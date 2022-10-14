import { CheckIcon as CheckIconSolid, ChevronDownIcon } from '@heroicons/react/solid'

export function UseCases() {
    return (

        <div className="bg-slate-50 py-12">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-aos="fade-up">
                <div class="lg:text-center">
                    <h2 class="text-lg font-semibold text-blue-600">Use Case</h2>
                    <span class="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">Why use revenue tokens?</span>
                    <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Tokens that derive value from revenue have advantages over native tokens.</p>
                </div>

                <div class="mt-10">
                    <dl class="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
                        <div class="relative">
                            <dt>
                                <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <svg class="absolute h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <p class="ml-16 text-lg font-medium leading-6 text-gray-900">Non-dilutive to native tokens (i.e. equity)
                                </p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">Issuing revenue tokens does not reduce the entire community’s ownership in the project.</dd>
                        </div>

                        <div class="relative">
                            <dt>
                                <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <svg class="absolute h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <p class="ml-16 text-lg font-medium leading-6 text-gray-900">Compensation mechanism for people who don’t share the long-term vision.</p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">A new way to compensate stakeholders that cause sell pressure.</dd>
                        </div>

                        <div class="relative">
                            <dt>
                                <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <svg class="absolute h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <p class="ml-16 text-lg font-medium leading-6 text-gray-900"> Make untradable assets tradable (i.e., royalties).</p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">Turn stranded assets into tradeable tokens used to reduce risk.</dd>
                        </div>

                        <div class="relative">
                            <dt>
                                <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <svg class="absolute h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <p class="ml-16 text-lg font-medium leading-6 text-gray-900"> Create unique incentives to attract large customers</p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">A differentiated set of incentives for institutional capital.</dd>
                        </div>
                    </dl>
                </div>
            </div>

        </div>
    )
}
