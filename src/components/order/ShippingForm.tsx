'use client'

import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'

export default function ShippingForm() {
  const [tab, setTab] = useState<'delivery' | 'pickup'>('delivery')

  const orderItems = [
    { title: 'Flashing #1 - Steel / Black Matte', quantity: 8, subtotal: 1500 },
    { title: 'Flashing #2 - Steel / Steel', quantity: 10, subtotal: 4500 },
  ]

  const delivery = 12
  const gst = 1200
  const total = 6600

  return (
    <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 p-4 bg-white">
        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[328px] h-[38px] gap-0.5 px-1 py-0.5 rounded-xl bg-white border border-[#999]">
          <div className="flex justify-center items-center flex-grow gap-2 px-4 py-2 rounded-lg bg-[#35f]">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white">
                Delivery
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center flex-grow gap-2 px-4 py-2 rounded-lg bg-white">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-neutral-800">
                Pickup
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 px-4 pt-2 pb-4 bg-white">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[17px] relative gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-neutral-800">
                  Job Reference
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#e50000]">
                  *
                </p>
              </div>
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-11 gap-2 px-4 py-3 rounded-xl bg-white border-[1.5px] border-[#999]">
                <div className="flex justify-start items-center flex-grow h-5 relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#999]">
                    Enter a Job Reference{' '}
                  </p>
                </div>
              </div>
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-3.5 relative gap-1">
                <svg
                  width={12}
                  height={13}
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-3 h-3 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_6009_9672)">
                    <path
                      d="M5.90184 4.67497C6.0971 4.87023 6.41368 4.87023 6.60894 4.67497C6.8042 4.47971 6.8042 4.16313 6.60894 3.96786L5.90184 4.67497ZM6.60394 3.96286C6.40868 3.7676 6.0921 3.7676 5.89684 3.96286C5.70157 4.15812 5.70157 4.47471 5.89684 4.66997L6.60394 3.96286ZM5.52398 5.70228C5.27656 5.82492 5.17542 6.1249 5.29806 6.37232C5.4207 6.61973 5.72068 6.72088 5.9681 6.59824L5.52398 5.70228ZM6.25039 5.90026L6.74182 5.99242C6.77676 5.8061 6.70333 5.61604 6.55218 5.50161C6.40104 5.38719 6.19818 5.36808 6.02833 5.45228L6.25039 5.90026ZM5.75039 8.56641L5.25896 8.47424C5.22396 8.66087 5.29769 8.85122 5.44928 8.96557C5.60088 9.07992 5.80416 9.09854 5.974 9.01362L5.75039 8.56641ZM6.474 8.76362C6.72098 8.64013 6.8211 8.33979 6.6976 8.0928C6.57411 7.84581 6.27377 7.7457 6.02678 7.86919L6.474 8.76362ZM10.9999 6.44141H10.4999C10.4999 8.92669 8.48522 10.9414 5.99994 10.9414V11.4414V11.9414C9.03751 11.9414 11.4999 9.47897 11.4999 6.44141H10.9999ZM5.99994 11.4414V10.9414C3.51466 10.9414 1.49994 8.92669 1.49994 6.44141H0.999939H0.499939C0.499939 9.47897 2.96237 11.9414 5.99994 11.9414V11.4414ZM0.999939 6.44141H1.49994C1.49994 3.95612 3.51466 1.94141 5.99994 1.94141V1.44141V0.941406C2.96237 0.941406 0.499939 3.40384 0.499939 6.44141H0.999939ZM5.99994 1.44141V1.94141C8.48522 1.94141 10.4999 3.95612 10.4999 6.44141H10.9999H11.4999C11.4999 3.40384 9.03751 0.941406 5.99994 0.941406V1.44141ZM6.25539 4.32142L6.60894 3.96786L6.60394 3.96286L6.25039 4.31642L5.89684 4.66997L5.90184 4.67497L6.25539 4.32142ZM5.74604 6.15026L5.9681 6.59824L6.47245 6.34824L6.25039 5.90026L6.02833 5.45228L5.52398 5.70228L5.74604 6.15026ZM6.25039 5.90026L5.75896 5.8081L5.25896 8.47424L5.75039 8.56641L6.24182 8.65857L6.74182 5.99242L6.25039 5.90026ZM5.75039 8.56641L5.974 9.01362L6.474 8.76362L6.25039 8.31641L6.02678 7.86919L5.52678 8.11919L5.75039 8.56641Z"
                      fill="#262626"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6009_9672">
                      <rect width={12} height={12} fill="white" transform="translate(0 0.441406)" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-neutral-800">
                  Enter a Job Reference to create new or use existing one
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
              <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[328px] h-[0.5px] absolute left-0 top-[6.75px] gap-2 bg-neutral-300" />
              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-12 relative gap-2 bg-white">
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-neutral-800">
                  OR
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 w-[328px] text-xs font-medium text-left text-neutral-800">
                Find a previous job by searching with its Job Reference, Delivery Address, or
                Site/Project Name
              </p>
              <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[328px] h-12 px-4 rounded-xl bg-white border border-neutral-300">
                <div className="flex flex-col justify-center items-start flex-grow">
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0">
                    <div className="flex justify-start items-center flex-grow relative gap-4 pr-4 py-3">
                      <svg
                        width={24}
                        height={25}
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M2 20.6914C1.58579 20.6914 1.25 21.0272 1.25 21.4414C1.25 21.8556 1.58579 22.1914 2 22.1914V20.6914ZM15.4882 21.4414V22.1914C15.9024 22.1914 16.2382 21.8556 16.2382 21.4414H15.4882ZM4.48818 21.4414L3.73818 21.4393C3.73762 21.6386 3.81639 21.8299 3.9571 21.971C4.09781 22.1121 4.2889 22.1914 4.48818 22.1914V21.4414ZM4.52445 8.63202L5.27445 8.63414V8.63201L4.52445 8.63202ZM6.80365 5.35176L7.06525 6.05466L6.80365 5.35176ZM11.4783 3.61199L11.2167 2.9091L11.4783 3.61199ZM15.5247 6.42358L16.2747 6.4348V6.42358H15.5247ZM15.4882 8.86371L14.7382 8.8525V8.86371H15.4882ZM17.5784 9.91081L17.9144 9.24024V9.24024L17.5784 9.91081ZM8.73818 12.4414C8.73818 12.0272 8.40239 11.6914 7.98818 11.6914C7.57397 11.6914 7.23818 12.0272 7.23818 12.4414H8.73818ZM7.23818 13.1914C7.23818 13.6056 7.57397 13.9414 7.98818 13.9414C8.40239 13.9414 8.73818 13.6056 8.73818 13.1914H7.23818ZM12.7382 12.4414C12.7382 12.0272 12.4024 11.6914 11.9882 11.6914C11.574 11.6914 11.2382 12.0272 11.2382 12.4414H12.7382ZM11.2382 13.1914C11.2382 13.6056 11.574 13.9414 11.9882 13.9414C12.4024 13.9414 12.7382 13.6056 12.7382 13.1914H11.2382ZM12.7382 8.44141C12.7382 8.02719 12.4024 7.69141 11.9882 7.69141C11.574 7.69141 11.2382 8.02719 11.2382 8.44141H12.7382ZM11.2382 9.19141C11.2382 9.60562 11.574 9.94141 11.9882 9.94141C12.4024 9.94141 12.7382 9.60562 12.7382 9.19141H11.2382ZM8.73818 8.44141C8.73818 8.02719 8.40239 7.69141 7.98818 7.69141C7.57397 7.69141 7.23818 8.02719 7.23818 8.44141H8.73818ZM7.23818 9.19141C7.23818 9.60562 7.57397 9.94141 7.98818 9.94141C8.40239 9.94141 8.73818 9.60562 8.73818 9.19141H7.23818ZM2 21.4414V22.1914H22V21.4414V20.6914H2V21.4414ZM15.4882 21.4414V20.6914H4.48818V21.4414V22.1914H15.4882V21.4414ZM4.48818 21.4414L5.23818 21.4435L5.27445 8.63414L4.52445 8.63202L3.77445 8.6299L3.73818 21.4393L4.48818 21.4414ZM6.80365 5.35176L7.06525 6.05466L11.7399 4.31489L11.4783 3.61199L11.2167 2.9091L6.54205 4.64887L6.80365 5.35176ZM15.5247 6.42358L14.7748 6.41237L14.7383 8.8525L15.4882 8.86371L16.2381 8.87493L16.2746 6.4348L15.5247 6.42358ZM15.4882 8.86371H14.7382V21.4414H15.4882H16.2382V8.86371H15.4882ZM15.4882 8.86371L15.1523 9.53428L17.2425 10.5814L17.5784 9.91081L17.9144 9.24024L15.8241 8.19314L15.4882 8.86371ZM19.5108 13.0401H18.7608V21.4414H19.5108H20.2608V13.0401H19.5108ZM17.5784 9.91081L17.2425 10.5814C18.1732 11.0476 18.7608 11.9992 18.7608 13.0401H19.5108H20.2608C20.2608 11.4315 19.3526 9.96073 17.9144 9.24024L17.5784 9.91081ZM4.52445 8.63202L5.27445 8.63201C5.27443 7.48317 5.98856 6.45538 7.06525 6.05466L6.80365 5.35176L6.54205 4.64887C4.87808 5.26815 3.77442 6.85656 3.77445 8.63203L4.52445 8.63202ZM11.4783 3.61199L11.7399 4.31489C13.2099 3.76776 14.7747 4.85499 14.7747 6.42358H15.5247H16.2747C16.2747 3.80926 13.6668 1.99722 11.2167 2.9091L11.4783 3.61199ZM7.98818 12.4414H7.23818V13.1914H7.98818H8.73818V12.4414H7.98818ZM11.9882 12.4414H11.2382V13.1914H11.9882H12.7382V12.4414H11.9882ZM11.9882 8.44141H11.2382V9.19141H11.9882H12.7382V8.44141H11.9882ZM7.98818 8.44141H7.23818V9.19141H7.98818H8.73818V8.44141H7.98818ZM8.98818 16.9414V17.6914H10.9882V16.9414V16.1914H8.98818V16.9414ZM11.9882 17.9414H11.2382V21.4414H11.9882H12.7382V17.9414H11.9882ZM7.98818 21.4414H8.73818V17.9414H7.98818H7.23818V21.4414H7.98818ZM10.9882 16.9414V17.6914C11.1263 17.6914 11.2382 17.8033 11.2382 17.9414H11.9882H12.7382C12.7382 16.9749 11.9547 16.1914 10.9882 16.1914V16.9414ZM8.98818 16.9414V16.1914C8.02168 16.1914 7.23818 16.9749 7.23818 17.9414H7.98818H8.73818C8.73818 17.8033 8.85011 17.6914 8.98818 17.6914V16.9414Z"
                          fill="#262626"
                        />
                      </svg>
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-6 relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-neutral-800">
                          Search and view previous Jobs
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-6">
                      <svg
                        width={24}
                        height={25}
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M9.25 18.4414L14.5221 14.0214C15.4926 13.2079 15.4926 11.6735 14.5221 10.8601L9.25 6.44141"
                          stroke="#262626"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 py-4 bg-white">
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-4">
            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-neutral-800">
              Order Notes
            </p>
          </div>
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[328px] gap-2">
            <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[85px] gap-2 px-4 py-3 rounded-xl bg-white border-[1.5px] border-[#999]">
              <div className="flex justify-start items-center flex-grow relative gap-2">
                <p className="self-stretch flex-grow w-[296px] h-[23px] text-sm text-left text-[#999]">
                  Add an optional note (if needed)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-3 p-4 bg-white">
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 bg-white">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-4">
              <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-neutral-800">
                Order Summary
              </p>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-4 bg-white">
                <div className="flex flex-col justify-center items-start flex-grow py-2">
                  <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-1">
                    <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-neutral-800">
                      Flashing #1 - Steel / Black Matte{' '}
                    </p>
                  </div>
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0">
                    <div className="flex justify-start items-center flex-grow gap-4 pr-4 py-1">
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-5 relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-neutral-800">
                          Quantity: 8 pcs
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right">
                        <span className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right text-neutral-800">
                          Subtotal:{' '}
                        </span>
                        <span className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right text-[#093]">
                          $1500.00
                        </span>
                      </p>
                      <svg
                        width={24}
                        height={25}
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M6 9.69141L10.42 14.9635C11.2335 15.934 12.7679 15.934 13.5813 14.9635L18 9.69141"
                          stroke="#262626"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-4 bg-white">
                <div className="flex flex-col justify-center items-start flex-grow relative py-2">
                  <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-1">
                    <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-neutral-800">
                      Flashing #2 - Steel / Steel{' '}
                    </p>
                  </div>
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0">
                    <div className="flex justify-start items-center flex-grow gap-4 pr-4 py-1">
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-5 relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-neutral-800">
                          Quantity: 10 pcs
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right">
                        <span className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right text-neutral-800">
                          Subtotal:
                        </span>
                        <span className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right text-[#093]">
                          {' '}
                          $4500.00
                        </span>
                      </p>
                      <svg
                        width={24}
                        height={25}
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M6 9.69141L10.42 14.9635C11.2335 15.934 12.7679 15.934 13.5813 14.9635L18 9.69141"
                          stroke="#262626"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-center flex-grow-0 flex-shrink-0 w-[328px] h-[0.5px] absolute left-0 top-[68.5px] gap-2 bg-neutral-300" />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative py-1">
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[328px] h-[0.5px] absolute left-4 top-[83.5px] gap-2 bg-neutral-300" />
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 px-4">
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[296px] gap-0.5 py-2">
                    <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                      <div className="flex justify-start items-start flex-grow relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-neutral-800">
                          Delivery
                        </p>
                      </div>
                      <div className="flex justify-end items-start flex-grow relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-[#093]">
                          $12.00
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-neutral-500">
                        Available from 2 business days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 px-4">
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[296px] gap-0.5 py-2">
                    <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                      <div className="flex justify-start items-start flex-grow relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-neutral-800">
                          GST
                        </p>
                      </div>
                      <div className="flex justify-end items-start flex-grow relative gap-2">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-[#093]">
                          $1200.00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative pl-4 pr-12 pt-3">
                <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-neutral-800">
                  Total
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-right text-[#093]">
                  {' '}
                  $6600.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
