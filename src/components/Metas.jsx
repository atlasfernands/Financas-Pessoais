import { PlusIcon } from '@heroicons/react/24/outline'

const Metas = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Metas Financeiras
          </h1>
          <p className="text-gray-600 mt-1">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Meta
        </button>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Em desenvolvimento
          </h3>
          <p className="text-gray-600">
            A funcionalidade de metas está sendo implementada com integração ao backend.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Metas