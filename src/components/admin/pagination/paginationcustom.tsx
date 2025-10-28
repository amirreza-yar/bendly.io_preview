'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationDemoProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onNext: () => void
  onPrevious: () => void
  canPrevious: boolean
  canNext: boolean
}

export function PaginationDemo({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  canPrevious,
  canNext,
}: PaginationDemoProps) {
  const visiblePages = 3 // number of pages shown before ellipsis

  const startPage = Math.max(1, currentPage - 1)
  const endPage = Math.min(totalPages, startPage + visiblePages - 1)
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <Pagination className="flex justify-center mt-6">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={
              canPrevious
                ? () => {
                    onPrevious()
                  }
                : undefined
            }
            className={!canPrevious ? 'opacity-50 pointer-events-none' : ''}
          />
        </PaginationItem>

        {/* Page Links */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={currentPage === page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis */}
        {totalPages > visiblePages && endPage < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={
              canNext
                ? () => {
                    onNext()
                  }
                : undefined
            }
            className={!canNext ? 'opacity-50 pointer-events-none' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
