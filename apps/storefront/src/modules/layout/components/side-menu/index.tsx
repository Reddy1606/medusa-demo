"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { Locale } from "@lib/data/locales"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, BarsThree, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

const items = [
  ["Trang chủ", "/"],
  ["Sản phẩm", "/store"],
  ["Thương hiệu", "/brands"],
  ["Dịch vụ", "/#dich-vu"],
  ["Hướng dẫn", "/#huong-dan"],
  ["Tra cứu đơn hàng", "/order-tracking"],
  ["Tài khoản", "/account"],
  ["Giỏ hàng", "/cart"],
] as const

type Props = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

export default function SideMenu({ regions, locales, currentLocale }: Props) {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <Popover className="flex h-full">
      {({ open, close }) => (
        <>
          <Popover.Button
            data-testid="nav-menu-button"
            className="flex h-full items-center text-black transition hover:text-[#9a6800] focus:outline-none"
            aria-label="Mở menu"
          >
            <BarsThree className="h-6 w-6" />
          </Popover.Button>
          {open && (
            <div
              className="fixed inset-0 z-[50] bg-black/20 backdrop-blur-sm"
              onClick={close}
              data-testid="side-menu-backdrop"
            />
          )}
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="-translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="-translate-x-full opacity-0"
          >
            <PopoverPanel className="absolute inset-x-0 z-[51] m-2 flex h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-sm flex-col rounded-3xl bg-[#111111] p-7 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold tracking-[0.12em]">
                  TIXIMAX
                </span>
                <button
                  data-testid="close-menu-button"
                  onClick={close}
                  className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
                  aria-label="Đóng menu"
                >
                  <XMark />
                </button>
              </div>
              <ul className="mt-12 flex flex-col gap-5">
                {items.map(([name, href]) => (
                  <li key={name}>
                    <LocalizedClientLink
                      href={href}
                      className="text-2xl font-medium transition hover:text-[#f4bf28]"
                      onClick={close}
                      data-testid={`${name.toLowerCase()}-link`}
                    >
                      {name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-y-6 border-t border-white/15 pt-6">
                {!!locales?.length && (
                  <div
                    className="flex justify-between"
                    onMouseEnter={languageToggleState.open}
                    onMouseLeave={languageToggleState.close}
                  >
                    <LanguageSelect
                      toggleState={languageToggleState}
                      locales={locales}
                      currentLocale={currentLocale}
                    />
                    <ArrowRightMini
                      className={clx(
                        "transition-transform",
                        languageToggleState.state && "-rotate-90",
                      )}
                    />
                  </div>
                )}
                <div
                  className="flex justify-between"
                  onMouseEnter={countryToggleState.open}
                  onMouseLeave={countryToggleState.close}
                >
                  {regions && (
                    <CountrySelect
                      toggleState={countryToggleState}
                      regions={regions}
                    />
                  )}
                  <ArrowRightMini
                    className={clx(
                      "transition-transform",
                      countryToggleState.state && "-rotate-90",
                    )}
                  />
                </div>
                <Text className="txt-compact-small text-white/45">
                  © {new Date().getFullYear()} TIXIMAX
                </Text>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
