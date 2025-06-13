import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext'; // Importa useAuth do novo contexto
import './SignUp.css'; // Altera a importação de CSS para SignUp.css

const SignUp = () => {
    const { signup } = useAuth(); // Obtém a função signup do contexto
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        password: '',
        confirmPassword: '',
        tipo: 'Estudante',
        cidade: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);

    const userTypes = ['Estudante', 'Professor', 'Gestor', 'Administrador'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === "cidade" && value.length > 2) {
            setShowCitySuggestions(true);
        } else if (name === "cidade" && value.length <= 2) {
            setShowCitySuggestions(false);
            setCitySuggestions([]);
        }
    };

    // Função para buscar cidades da API do IBGE
    const fetchCities = async (searchTerm) => {
        if (!searchTerm) {
            setCitySuggestions([]);
            return;
        }
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome&maxitems=100`);
            const data = await response.json();
            const filteredCities = data.filter(city =>
                city.nome.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(city => city.nome);
            setCitySuggestions(filteredCities.slice(0, 10)); // Limita a 10 sugestões
        } catch (err) {
            console.error("Erro ao buscar cidades:", err);
            setCitySuggestions([]);
        }
    };

    // Debounce para a busca de cidades
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCities(formData.cidade);
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.cidade]);

    const handleSelectCity = (city) => {
        setFormData(prevState => ({ ...prevState, cidade: city }));
        setShowCitySuggestions(false);
        setCitySuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        try {
            // Chama a função signup do AuthContext (Firebase)
            await signup(formData.email, formData.password, {
                nome: formData.nome,
                sobrenome: formData.sobrenome,
                tipo: formData.tipo,
                email: formData.email, // Incluindo email aqui para o Firestore
                cidade: formData.cidade, // Novo campo
            });

            setSuccess(true);
            // Não precisa de setTimeout para navigate, o AuthContext e PrivateRoute cuidarão disso

            setFormData({
                nome: '',
                sobrenome: '',
                email: '',
                password: '',
                confirmPassword: '',
                tipo: 'Estudante',
                cidade: '',
            });
        } catch (err) {
            setError(err.message || 'Erro ao cadastrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-card">
            <img src="/cientiklogo.png" alt="Logo Cientik" className="signup-logo" />
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Cadastro de Usuários</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Cadastro realizado com sucesso!</div>}

                <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sobrenome">Sobrenome</label>
                    <input
                        type="text"
                        id="sobrenome"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        autoComplete="new-password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                        autoComplete="new-password"
                    />
                </div>

                <div className="form-group" style={{ position: 'relative', zIndex: 20 }}>
                    <label htmlFor="cidade">Cidade</label>
                    <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                        <ul className="city-suggestions-dropdown">
                            {citySuggestions.map((city, index) => (
                                <li key={index}
                                    onClick={() => handleSelectCity(city)}
                                    className="city-suggestion-item"
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-group" style={{ zIndex: 1, position: 'relative' }}>
                    <label htmlFor="tipo">Tipo de Usuário</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        {userTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <button className="signup-btn" type="submit" disabled={loading} style={{ zIndex: 1, position: 'relative' }}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
};

export default SignUp; 