import React, { useContext } from "react";

const LandingPage = () => {
  return (
    <div className="bg-white">
      <div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>

        <div className="fixed inset-0 flex z-40">
          <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
            <div className="px-4 pt-5 pb-2 flex">
              <button
                type="button"
                className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-2">
              <div className="border-b border-gray-200">
                <div className="-mb-px flex px-4 space-x-8" aria-orientation="horizontal" role="tablist">
                  <button
                    id="tabs-1-tab-1"
                    className="text-gray-900 border-transparent flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                    aria-controls="tabs-1-panel-1"
                    role="tab"
                    type="button"
                  >
                    Women
                  </button>

                  <button
                    id="tabs-1-tab-2"
                    className="text-gray-900 border-transparent flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                    aria-controls="tabs-1-panel-2"
                    role="tab"
                    type="button"
                  >
                    Men
                  </button>
                </div>
              </div>

              <div
                id="tabs-1-panel-1"
                className="px-4 py-6 space-y-12"
                aria-labelledby="tabs-1-tab-1"
                role="tabpanel"
                tabIndex="0"
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg"
                        alt="Models sitting back to back, wearing Basic Tee in black and bone."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      New Arrivals
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>

                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg"
                        alt="Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      Basic Tees
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>

                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg"
                        alt="Model wearing minimalist watch with black wristband and white watch face."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      Accessories
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>

                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg"
                        alt="Model opening tan leather long wallet with credit card pockets and cash pouch."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      Carry
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>
                </div>
              </div>

              <div
                id="tabs-1-panel-2"
                className="px-4 py-6 space-y-12"
                aria-labelledby="tabs-1-tab-2"
                role="tabpanel"
                tabIndex="0"
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-01.jpg"
                        alt="Hats and sweaters on wood shelves next to various colors of t-shirts on hangers."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      New Arrivals
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>

                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-02.jpg"
                        alt="Model wearing light heather gray t-shirt."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      Basic Tees
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>

                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-03.jpg"
                        alt="Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      Accessories
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>

                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-04.jpg"
                        alt="Model putting folded cash into slim card holder olive leather wallet with hand stitching."
                        className="object-center object-cover"
                      />
                    </div>
                    <a href="#" className="mt-6 block text-sm font-medium text-gray-900">
                      <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                      Carry
                    </a>
                    <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                      Shop now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 space-y-6">
              <div className="flow-root">
                <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
                  Company
                </a>
              </div>

              <div className="flow-root">
                <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
                  Stores
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 space-y-6">
              <div className="flow-root">
                <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
                  Create an account
                </a>
              </div>
              <div className="flow-root">
                <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
                  Sign in
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 space-y-6">
              <form>
                <div className="inline-block">
                  <label htmlFor="mobile-currency" className="sr-only">
                    Currency
                  </label>
                  <div className="-ml-2 group relative border-transparent rounded-md focus-within:ring-2 focus-within:ring-white">
                    <select
                      id="mobile-currency"
                      name="currency"
                      className="bg-none border-transparent rounded-md py-0.5 pl-2 pr-5 flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-800 focus:outline-none focus:ring-0 focus:border-transparent"
                    >
                      <option>CAD</option>

                      <option>USD</option>

                      <option>AUD</option>

                      <option>EUR</option>

                      <option>GBP</option>
                    </select>
                    <div className="absolute right-0 inset-y-0 flex items-center pointer-events-none">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M6 8l4 4 4-4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-900">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img
            src="https://tailwindui.com/img/ecommerce-images/home-page-01-hero-full-width.jpg"
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50"></div>

        <header className="relative z-10">
          <nav aria-label="Top">
            <div className="bg-gray-900">
              <div className="max-w-7xl mx-auto h-10 px-4 flex items-center justify-between sm:px-6 lg:px-8">
                <form>
                  <div>
                    <label htmlFor="desktop-currency" className="sr-only">
                      Currency
                    </label>
                    <div className="-ml-2 group relative bg-gray-900 border-transparent rounded-md focus-within:ring-2 focus-within:ring-white">
                      <select
                        id="desktop-currency"
                        name="currency"
                        className="bg-none bg-gray-900 border-transparent rounded-md py-0.5 pl-2 pr-5 flex items-center text-sm font-medium text-white group-hover:text-gray-100 focus:outline-none focus:ring-0 focus:border-transparent"
                      >
                        <option>CAD</option>

                        <option>USD</option>

                        <option>AUD</option>

                        <option>EUR</option>

                        <option>GBP</option>
                      </select>
                      <div className="absolute right-0 inset-y-0 flex items-center pointer-events-none">
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                          className="w-5 h-5 text-gray-300"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M6 8l4 4 4-4"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="flex items-center space-x-6">
                  <a href="#" className="text-sm font-medium text-white hover:text-gray-100">
                    Sign in
                  </a>
                  <a href="#" className="text-sm font-medium text-white hover:text-gray-100">
                    Create an account
                  </a>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md backdrop-filter bg-opacity-10 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                  <div className="h-16 flex items-center justify-between">
                    <div className="hidden lg:flex-1 lg:flex lg:items-center">
                      <a href="#">
                        <span className="sr-only">Workflow</span>
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                          alt=""
                        />
                      </a>
                    </div>

                    <div className="hidden h-full lg:flex">
                      <div className="px-4 bottom-0 inset-x-0">
                        <div className="h-full flex justify-center space-x-8">
                          <div className="flex">
                            <div className="relative flex">
                              <button
                                type="button"
                                className="relative z-10 flex items-center justify-center transition-colors ease-out duration-200 text-sm font-medium text-white"
                                aria-expanded="false"
                              >
                                Women
                                <span
                                  className="absolute -bottom-px inset-x-0 h-0.5 transition ease-out duration-200"
                                  aria-hidden="true"
                                ></span>
                              </button>
                            </div>

                            <div className="absolute top-full inset-x-0 text-sm text-gray-500">
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>

                              <div className="relative bg-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg"
                                          alt="Models sitting back to back, wearing Basic Tee in black and bone."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        New Arrivals
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>

                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg"
                                          alt="Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        Basic Tees
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>

                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg"
                                          alt="Model wearing minimalist watch with black wristband and white watch face."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        Accessories
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>

                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg"
                                          alt="Model opening tan leather long wallet with credit card pockets and cash pouch."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        Carry
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="relative flex">
                              <button
                                type="button"
                                className="relative z-10 flex items-center justify-center transition-colors ease-out duration-200 text-sm font-medium text-white"
                                aria-expanded="false"
                              >
                                Men
                                <span
                                  className="absolute -bottom-px inset-x-0 h-0.5 transition ease-out duration-200"
                                  aria-hidden="true"
                                ></span>
                              </button>
                            </div>

                            <div className="absolute top-full inset-x-0 text-sm text-gray-500">
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>

                              <div className="relative bg-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-01.jpg"
                                          alt="Hats and sweaters on wood shelves next to various colors of t-shirts on hangers."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        New Arrivals
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>

                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-02.jpg"
                                          alt="Model wearing light heather gray t-shirt."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        Basic Tees
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>

                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-03.jpg"
                                          alt="Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        Accessories
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>

                                    <div className="group relative">
                                      <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                                        <img
                                          src="https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-04.jpg"
                                          alt="Model putting folded cash into slim card holder olive leather wallet with hand stitching."
                                          className="object-center object-cover"
                                        />
                                      </div>
                                      <a href="#" className="mt-4 block font-medium text-gray-900">
                                        <span className="absolute z-10 inset-0" aria-hidden="true"></span>
                                        Carry
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        Shop now
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <a href="#" className="flex items-center text-sm font-medium text-white">
                            Company
                          </a>

                          <a href="#" className="flex items-center text-sm font-medium text-white">
                            Stores
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center lg:hidden">
                      <button type="button" className="-ml-2 p-2 text-white">
                        <span className="sr-only">Open menu</span>
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>

                      <a href="#" className="ml-2 p-2 text-white">
                        <span className="sr-only">Search</span>
                        <svg
                          className="w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </a>
                    </div>

                    <a href="#" className="lg:hidden">
                      <span className="sr-only">Workflow</span>
                      <img
                        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                        alt=""
                        className="h-8 w-auto"
                      />
                    </a>

                    <div className="flex-1 flex items-center justify-end">
                      <a href="#" className="hidden text-sm font-medium text-white lg:block">
                        {" "}
                        Search{" "}
                      </a>

                      <div className="flex items-center lg:ml-8">
                        <a href="#" className="p-2 text-white lg:hidden">
                          <span className="sr-only">Help</span>
                          <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </a>
                        <a href="#" className="hidden text-sm font-medium text-white lg:block">
                          Help
                        </a>

                        <div className="ml-4 flow-root lg:ml-8">
                          <a href="#" className="group -m-2 p-2 flex items-center">
                            <svg
                              className="flex-shrink-0 h-6 w-6 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            <span className="ml-2 text-sm font-medium text-white">0</span>
                            <span className="sr-only">items in cart, view bag</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-6xl">New arrivals are here</h1>
          <p className="mt-4 text-xl text-white">
            The new arrivals have, well, newly arrived. Check out the latest options from our summer small-batch release
            while they are still in stock.
          </p>
          <a
            href="#"
            className="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Shop New Arrivals
          </a>
        </div>
      </div>

      <main>
        <section aria-labelledby="category-heading" className="pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8">
          <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
            <h2 id="category-heading" className="text-2xl font-extrabold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              Browse all categories<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="mt-4 flow-root">
            <div className="-my-2">
              <div className="box-content py-2 relative h-80 overflow-x-auto xl:overflow-visible">
                <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
                  <a
                    href="#"
                    className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/home-page-01-category-01.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    ></span>
                    <span className="relative mt-auto text-center text-xl font-bold text-white">New Arrivals</span>
                  </a>

                  <a
                    href="#"
                    className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/home-page-01-category-02.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    ></span>
                    <span className="relative mt-auto text-center text-xl font-bold text-white">Productivity</span>
                  </a>

                  <a
                    href="#"
                    className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/home-page-01-category-04.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    ></span>
                    <span className="relative mt-auto text-center text-xl font-bold text-white">Workspace</span>
                  </a>

                  <a
                    href="#"
                    className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/home-page-01-category-05.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    ></span>
                    <span className="relative mt-auto text-center text-xl font-bold text-white">Accessories</span>
                  </a>

                  <a
                    href="#"
                    className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/home-page-01-category-03.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    ></span>
                    <span className="relative mt-auto text-center text-xl font-bold text-white">Sale</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 px-4 sm:hidden">
            <a href="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Browse all categories<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </section>

        <section
          aria-labelledby="social-impact-heading"
          className="max-w-7xl mx-auto pt-24 px-4 sm:pt-32 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg"
                alt=""
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
              <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
                <h2
                  id="social-impact-heading"
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                >
                  <span className="block sm:inline">Level up</span>
                  <span className="block sm:inline">your desk</span>
                </h2>
                <p className="mt-3 text-xl text-white">
                  Make your desk beautiful and organized. Post a picture to social media and watch it get more likes
                  than life-changing announcements. Reflect on the shallow nature of existence. At least you have a
                  really nice desk setup.
                </p>
                <a
                  href="#"
                  className="mt-8 w-full block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Shop Workspace
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="collection-heading"
          className="max-w-xl mx-auto pt-24 px-4 sm:pt-32 sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <h2 id="collection-heading" className="text-2xl font-extrabold tracking-tight text-gray-900">
            Shop by Collection
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Each season, we collaborate with world-class designers to create a collection inspired by the natural world.
          </p>

          <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            <a href="#" className="group block">
              <div
                aria-hidden="true"
                className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden group-hover:opacity-75 lg:aspect-w-5 lg:aspect-h-6"
              >
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg"
                  alt="Brown leather key ring with brass metal loops and rivets on wood table."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Handcrafted Collection</h3>
              <p className="mt-2 text-sm text-gray-500">
                Keep your phone, keys, and wallet together, so you can lose everything at once.
              </p>
            </a>

            <a href="#" className="group block">
              <div
                aria-hidden="true"
                className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden group-hover:opacity-75 lg:aspect-w-5 lg:aspect-h-6"
              >
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg"
                  alt="Natural leather mouse pad on white desk next to porcelain mug and keyboard."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Organized Desk Collection</h3>
              <p className="mt-2 text-sm text-gray-500">
                The rest of the house will still be a mess, but your desk will look great.
              </p>
            </a>

            <a href="#" className="group block">
              <div
                aria-hidden="true"
                className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden group-hover:opacity-75 lg:aspect-w-5 lg:aspect-h-6"
              >
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg"
                  alt="Person placing task list card into walnut card holder next to felt carrying case on leather desk pad."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Focus Collection</h3>
              <p className="mt-2 text-sm text-gray-500">
                Be more productive than enterprise project managers with a single piece of paper.
              </p>
            </a>
          </div>
        </section>

        <section aria-labelledby="comfort-heading" className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="relative rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-02.jpg"
                alt=""
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
              <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
                <h2 id="comfort-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Simple productivity
                </h2>
                <p className="mt-3 text-xl text-white">
                  Endless tasks, limited hours, a single piece of paper. Not really a haiku, but we are doing our best
                  here. No kanban boards, burndown charts, or tangled flowcharts with our Focus system. Just the
                  undeniable urge to fill empty circles.
                </p>
                <a
                  href="#"
                  className="mt-8 w-full block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Shop Focus
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-gray-900">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-medium text-white">Shop</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Bags{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Tees{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Objects{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Home Goods{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Accessories{" "}
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Who we are{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Sustainability{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Press{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Careers{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Terms &amp; Conditions{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Privacy{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-medium text-white">Account</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Manage Account{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Returns &amp; Exchanges{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Redeem a Gift Card{" "}
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Connect</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Contact Us{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Twitter{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Instagram{" "}
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-300 hover:text-white">
                        {" "}
                        Pinterest{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 md:mt-16 xl:mt-0">
              <h3 className="text-sm font-medium text-white">Sign up for our newsletter</h3>
              <p className="mt-6 text-sm text-gray-300">The latest deals and savings, sent to your inbox weekly.</p>
              <form className="mt-2 flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="text"
                  autoComplete="email"
                  required
                  className="appearance-none min-w-0 w-full bg-white border border-white rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                />
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 py-10">
            <p className="text-sm text-gray-400">Copyright &copy; 2021 Clothing Company Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
