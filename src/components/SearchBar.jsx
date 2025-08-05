import { useState } from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ onSearch, placeholder = "Pesquise cobranças pelo nome do cliente" }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(searchTerm)
    }

    const handleChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        onSearch(value) // Pesquisa em tempo real
    }

    return (
        <section className="search-bar">
            <form onSubmit={handleSubmit}>
                <div className="search-input-group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <Search size={20} />
                        <span>Buscar</span>
                    </button>
                </div>
            </form>
        </section>
    )
}

export default SearchBar