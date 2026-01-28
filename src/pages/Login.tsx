import React, { useState } from 'react';
import { authService } from '../services/auth';
import { getAllIntegrations } from '../config/integrations';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const integrations = getAllIntegrations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ usuario, senha });

      if (response.status === 1 && response.data?.access_key) {
        authService.saveToken(response.data.access_key, response.data.expire_at, usuario);
        window.location.href = '/nike/dashboard';
      } else {
        setError(response.message || 'Erro ao fazer login');
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white-800 to-amber-50 relative">
      {/* TopBar com efeito de vidro fosco */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between h-16 px-4 relative">
          {/* Logo 3zx à esquerda */}
          <div className="flex items-center">
            <img src="/logo.png" alt="3zx Logo" className="h-12 w-auto" />
          </div>
          
          {/* Integrações SBF centralizado */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-blue-950 font-semibold text-xl tracking-tight drop-shadow-md">Integração SBF</span>
          </div>
          
          {/* Espaço vazio à direita para manter simetria */}
          <div className="w-10"></div>
        </div>
      </div>
      {/* Conteúdo com padding-top para não ficar atrás da topbar */}
      <div className="min-h-screen flex items-center justify-center p-6 pt-24">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6 drop-shadow-2xl">
        {/* Hero / Branding */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-amber-500 text-white p-8 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_45%)]" aria-hidden />
          <div className="relative space-y-4">
            <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] bg-white/15 px-3 py-1 rounded-full border border-white/20 shadow-sm">
              Integração SBF
            </p>
            <h1 className="text-3xl font-bold leading-tight">Gestão de Cargas com eficiência e visibilidade total.</h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Monitore status, envios de CTe e atualizações de tracking em uma interface única e segura.
            </p>
          </div>
          
          {/* Integration Cards */}
          <div className="relative mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              Integrações Disponíveis
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {integrations.map((integration) => (
                <div 
                  key={integration.id}
                  className="bg-white/10 rounded-xl p-3 backdrop-blur border border-white/10"
                >
                  <p className="text-white/90 font-semibold">{integration.name}</p>
                  <p className="text-white/60 text-xs mt-1">{integration.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur border border-white/10">
              <p className="text-white/70">Status</p>
              <p className="text-lg font-semibold">Tracking integrado</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur border border-white/10">
              <p className="text-white/70">CTe XML</p>
              <p className="text-lg font-semibold">Upload rápido</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-slate-100 shadow-lg">
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Entrar na plataforma</h2>
            <p className="text-sm text-slate-500">Login único para todas as integrações (Nike e Centauro).</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="usuario" className="block text-sm font-medium text-slate-700">
                  Usuário
                </label>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-blue-50"
                  placeholder="Digite seu usuário"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="senha" className="block text-sm font-medium text-slate-700">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-blue-50"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-400">
              Integração SBF v2.0
            </p>
            <p className="text-xs text-center text-slate-400">
               &copy; 2024 3zx Transporte e Tecnologia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
