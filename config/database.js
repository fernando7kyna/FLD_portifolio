const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
    console.error('Por favor, configure SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env');
    process.exit(1);
}

// Cria o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para testar a conexão
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Erro ao conectar com Supabase:', error.message);
            return false;
        }
        
        console.log('✅ Conexão com Supabase estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao testar conexão:', error.message);
        return false;
    }
}

// Função para inicializar as tabelas (se necessário)
async function initializeTables() {
    try {
        console.log('🔄 Verificando estrutura das tabelas...');
        
        // Verifica se a tabela contacts existe
        const { data: contacts, error: contactsError } = await supabase
            .from('contacts')
            .select('*')
            .limit(1);
        
        if (contactsError && contactsError.code === 'PGRST116') {
            console.log('📋 Tabela contacts não encontrada. Execute o SQL no Supabase:');
            console.log(`
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);
            `);
        } else {
            console.log('✅ Tabela contacts encontrada!');
        }
        
        // Verifica se a tabela portfolio_data existe
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolio_data')
            .select('*')
            .limit(1);
        
        if (portfolioError && portfolioError.code === 'PGRST116') {
            console.log('📋 Tabela portfolio_data não encontrada. Execute o SQL no Supabase:');
            console.log(`
CREATE TABLE portfolio_data (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
            `);
        } else {
            console.log('✅ Tabela portfolio_data encontrada!');
        }
        
    } catch (error) {
        console.error('❌ Erro ao inicializar tabelas:', error.message);
    }
}

module.exports = {
    supabase,
    testConnection,
    initializeTables
}; 