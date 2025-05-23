import { useCallback } from 'react'
import { useTaskContext } from '../context/TaskContext';
import { FaHome, FaTrash } from 'react-icons/fa';
import PagesToolbar from './PagesToolbar.jsx'

export default function Footer() {

  const { tasks, page, setPage, showDiscarded, toggleTrashView } = useTaskContext()

  const handleNext = useCallback(async (page) => {
    if (tasks.length === 10) {
      setPage(page+1);
    }
  }, [tasks.length, setPage])

  const handlePrev = useCallback(async (page) => {
    if (page > 1) {
      setPage(page-1);
    }
  }, [setPage])


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
          onClick={toggleTrashView}
          className="px-4  h-7 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
        >
          {showDiscarded ? <FaHome className="mr-2"/> : <FaTrash className="mr-2"/>}
          {showDiscarded ? 'Home' : 'Trash'}
        </button>
      </div>
    </div>
  )
}