const { supabase } = require('../config/database');

class PortfolioService {
    
    // Salvar dados de contato
    async saveContact(contactData) {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .insert([{
                    name: contactData.name,
                    email: contactData.email,
                    phone: contactData.phone,
                    message: contactData.message,
                    ip_address: contactData.ip,
                    user_agent: contactData.userAgent
                }])
                .select();
            
            if (error) {
                console.error('Erro ao salvar contato:', error);
                throw new Error('Falha ao salvar dados de contato');
            }
            
            console.log('✅ Contato salvo com sucesso:', data[0]);
            return data[0];
        } catch (error) {
            console.error('Erro no serviço de contato:', error);
            throw error;
        }
    }
    
    // Buscar todos os contatos
    async getContacts(limit = 50) {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('Erro ao buscar contatos:', error);
                throw new Error('Falha ao buscar dados de contato');
            }
            
            return data || [];
        } catch (error) {
            console.error('Erro no serviço de contato:', error);
            throw error;
        }
    }
    
    // Salvar dados do portfólio (configurações, estatísticas, etc.)
    async savePortfolioData(key, value) {
        try {
            const { data, error } = await supabase
                .from('portfolio_data')
                .upsert([{
                    key: key,
                    value: value,
                    updated_at: new Date().toISOString()
                }], {
                    onConflict: 'key'
                })
                .select();
            
            if (error) {
                console.error('Erro ao salvar dados do portfólio:', error);
                throw new Error('Falha ao salvar dados do portfólio');
            }
            
            console.log('✅ Dados do portfólio salvos:', data[0]);
            return data[0];
        } catch (error) {
            console.error('Erro no serviço de portfólio:', error);
            throw error;
        }
    }
    
    // Buscar dados do portfólio
    async getPortfolioData(key) {
        try {
            const { data, error } = await supabase
                .from('portfolio_data')
                .select('*')
                .eq('key', key)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Erro ao buscar dados do portfólio:', error);
                throw new Error('Falha ao buscar dados do portfólio');
            }
            
            return data ? data.value : null;
        } catch (error) {
            console.error('Erro no serviço de portfólio:', error);
            throw error;
        }
    }
    
    // Buscar todas as chaves de dados do portfólio
    async getAllPortfolioData() {
        try {
            const { data, error } = await supabase
                .from('portfolio_data')
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.error('Erro ao buscar dados do portfólio:', error);
                throw new Error('Falha ao buscar dados do portfólio');
            }
            
            return data || [];
        } catch (error) {
            console.error('Erro no serviço de portfólio:', error);
            throw error;
        }
    }
    
    // Salvar estatísticas de visualização
    async saveViewStats(page, userAgent, ip) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const statsKey = `view_stats_${page}_${today}`;
            
            // Buscar estatísticas existentes
            let currentStats = await this.getPortfolioData(statsKey) || {
                page: page,
                date: today,
                views: 0,
                unique_visitors: new Set(),
                user_agents: []
            };
            
            // Converter Set para Array se necessário
            if (currentStats.unique_visitors && !Array.isArray(currentStats.unique_visitors)) {
                currentStats.unique_visitors = Array.from(currentStats.unique_visitors);
            }
            
            // Atualizar estatísticas
            currentStats.views += 1;
            if (!currentStats.unique_visitors.includes(ip)) {
                currentStats.unique_visitors.push(ip);
            }
            if (userAgent && !currentStats.user_agents.includes(userAgent)) {
                currentStats.user_agents.push(userAgent);
            }
            
            // Salvar estatísticas atualizadas
            await this.savePortfolioData(statsKey, currentStats);
            
            return currentStats;
        } catch (error) {
            console.error('Erro ao salvar estatísticas:', error);
            // Não falhar se as estatísticas não puderem ser salvas
            return null;
        }
    }
    
    // Buscar estatísticas de visualização
    async getViewStats(page, days = 7) {
        try {
            const stats = [];
            const today = new Date();
            
            for (let i = 0; i < days; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const statsKey = `view_stats_${page}_${dateStr}`;
                
                const dayStats = await this.getPortfolioData(statsKey);
                if (dayStats) {
                    stats.push(dayStats);
                }
            }
            
            return stats;
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return [];
        }
    }
}

module.exports = new PortfolioService(); 