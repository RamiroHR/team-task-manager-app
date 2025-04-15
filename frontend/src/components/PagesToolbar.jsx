import React from 'react'

function PagesToolbar({handleNext, handlePrev, page}) {

  return(
    <div className="flex justify-left items-center gap-4">

      {/* Page Note */}
      <pre className="py-2 text-center text-sm">
        Pages:
      </pre>

      {/* Previous Page */}
      <button
        className="w-7 h-7 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
        onClick={() => handlePrev(page)}>
        &lt;
      </button>

      {/* Current Page */}
      <div className="w-7 h-7 text-sm text-white flex justify-center items-center border-2 rounded border-gray-600">
        {page}
      </div>

      {/* Next Page */}
      <button
        className="w-7 h-7 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
        onClick={() => handleNext(page)}
        >
        &gt;
      </button>
    </div>
  )
}


export default React.memo(PagesToolbar);