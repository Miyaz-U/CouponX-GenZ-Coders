// pagination.js — shared pagination helpers
// Used by: home.js, shop.js, deals.js
//
// Provides two functions:
//   buildPageNumberSequence(current, total)  →  array of page numbers / "..." strings
//   renderPaginationControls(containerId, currentPage, totalPages, onPageChange)
//
// Both shop.js and deals.js previously had their own copies of these functions
// that closed over page-level globals (paginationControls, currentPage, goToPage).
// This parameterised version — already used by home.js across three sections —
// is the single source of truth. shop.js and deals.js call it the same way:
//   renderPaginationControls("paginationControls", currentPage, totalPages, goToPage)

function buildPageNumberSequence(current, total) {
  const pages = []
  const addRange = function (start, end) {
    for (let i = start; i <= end; i++) pages.push(i)
  }

  if (total <= 7) {
    addRange(1, total)
    return pages
  }

  pages.push(1)
  const rangeStart = Math.max(2, current - 1)
  const rangeEnd = Math.min(total - 1, current + 1)

  if (rangeStart > 2) pages.push("...")
  addRange(rangeStart, rangeEnd)
  if (rangeEnd < total - 1) pages.push("...")
  pages.push(total)

  return pages
}

// Renders Prev/Next and numbered page controls into containerId.
// onPageChange(page) is called whenever the user picks a different page.
function renderPaginationControls(containerId, currentPage, totalPages, onPageChange) {
  const container = document.getElementById(containerId)
  if (!container) return

  if (totalPages <= 1) {
    container.innerHTML = ""
    return
  }

  const navBtnBase = "min-w-[2.25rem] h-9 px-2 rounded-md text-sm font-medium transition flex items-center justify-center"
  const inactiveBtn = navBtnBase + " bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
  const activeBtn = navBtnBase + " bg-purple-600 text-white border border-purple-600"
  const disabledBtn = navBtnBase + " bg-gray-50 border border-gray-200 text-gray-300 cursor-not-allowed"

  let html = '<div class="flex flex-wrap items-center justify-center gap-1.5">'

  // Prev button
  html += '<button type="button" data-page="' + (currentPage - 1) + '" ' +
    (currentPage === 1 ? 'disabled' : '') +
    ' class="pageNavBtn ' + (currentPage === 1 ? disabledBtn : inactiveBtn) + '" aria-label="Previous page">‹</button>'

  // Page number buttons — hidden on the smallest screens to keep the bar compact
  const sequence = buildPageNumberSequence(currentPage, totalPages)
  html += '<span class="hidden sm:flex items-center gap-1.5 flex-wrap justify-center">'
  sequence.forEach(function (item) {
    if (item === "...") {
      html += '<span class="px-1 text-sm text-gray-400 select-none">…</span>'
    } else {
      html += '<button type="button" data-page="' + item + '" class="pageNavBtn ' +
        (item === currentPage ? activeBtn : inactiveBtn) + '">' + item + '</button>'
    }
  })
  html += '</span>'

  // Compact "X / Y" indicator shown only on the smallest screens
  html += '<span class="sm:hidden text-sm text-gray-600 px-2 select-none">' + currentPage + ' / ' + totalPages + '</span>'

  // Next button
  html += '<button type="button" data-page="' + (currentPage + 1) + '" ' +
    (currentPage === totalPages ? 'disabled' : '') +
    ' class="pageNavBtn ' + (currentPage === totalPages ? disabledBtn : inactiveBtn) + '" aria-label="Next page">›</button>'

  html += '</div>'

  container.innerHTML = html

  container.querySelectorAll(".pageNavBtn").forEach(function (btn) {
    if (btn.disabled) return
    btn.addEventListener("click", function () {
      onPageChange(Number(btn.getAttribute("data-page")))
    })
  })
}
