import { FaHome, FaTrash } from 'react-icons/fa';
import PagesToolbar from './PagesToolbar.jsx'

export default function Footer({toggleView, showDiscarded, handleNext, handlePrev, page}) {

  return(
    <div className="flex justify-between space-x-4 mt-6">

      {/* Pages */}
      <PagesToolbar
        page={page}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />

      {/* Trash button */}
      <div className="flex justify-left items-center gap-4">
        <button
          onClick={toggleView}
          className="px-4  h-7 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
        >
          {showDiscarded ? <FaHome className="mr-2"/> : <FaTrash className="mr-2"/>}
          {showDiscarded ? 'Home' : 'Trash'}
        </button>
      </div>
    </div>
  )
}