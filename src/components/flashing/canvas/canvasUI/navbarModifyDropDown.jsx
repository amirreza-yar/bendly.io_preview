// NavDropdown.jsx
import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import NavButton from './navbarButton'

const NavDropdown = ({
  icon: Icon,
  iconActive: IconActive,
  label,
  active,
  disabled,
  items,
  ...props
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        disabled={disabled}
        className={`font-roboto text-xs/[14px] font-medium flex flex-col justify-between items-center flex-grow-0 flex-shrink-0 h-14 w-15 relative [&_svg:not([class*='size-'])]:size-6 pt-2 ${
          disabled
            ? 'text-neutral-midlight cursor-not-allowed'
            : active
              ? 'text-primary'
              : 'text-neutral-dark'
        }`}
      >
        {active ? <IconActive /> : <Icon />}
        <p className="flex-grow-0 flex-shrink-0 text-center pb-2">{label}</p>
        <svg
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute size-2 top-1 right-1"
        >
          <path
            d="M7.50093 0.5H1.20803C0.762581 0.5 0.539498 1.03857 0.85448 1.35355L7.14737 7.64645C7.46236 7.96143 8.00093 7.73835 8.00093 7.29289V1C8.00093 0.723858 7.77707 0.5 7.50093 0.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </PopoverTrigger>
    <PopoverContent className="shadow-md flex flex-col justify-between items-center w-15 bg-white rounded-xl px-3 mx-auto mb-4 py-0 gap-1">
      {items.map(
        ({
          icon: ItemIcon,
          iconActive: ItemIconActive,
          label: itemLabel,
          active: itemActive,
          onClick,
        }) => (
          <button
            key={itemLabel}
            onClick={() => onClick()}
            className={`font-roboto text-xs/[14px] font-medium flex flex-col justify-between items-center flex-grow-0 flex-shrink-0 h-14 w-15 relative [&_svg:not([class*='size-'])]:size-6 pt-2 ${
              itemActive ? 'text-blue-600' : 'text-gray-800'
            }`}
          >
            {itemActive ? <ItemIconActive /> : <ItemIcon />}
            <span className="flex-grow-0 flex-shrink-0 text-center label-small pb-2">{itemLabel}</span>
          </button>
        ),
      )}
    </PopoverContent>
  </Popover>
)

export default NavDropdown
