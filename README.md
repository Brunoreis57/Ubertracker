# UberTracker - Controle de Ganhos para Motoristas

UberTracker é uma aplicação web desenvolvida para ajudar motoristas de aplicativos como Uber a acompanharem seus ganhos, gastos e desempenho. Com uma interface intuitiva e funcional, o sistema permite o registro de corridas diárias, configuração de informações do veículo e análise de resultados financeiros em diferentes períodos.

## Funcionalidades

- **Dashboard Completo**: Visualize seus ganhos brutos, líquidos e gastos com gasolina em diferentes períodos (diário, semanal, mensal, anual).
- **Gráficos Interativos**: Acompanhe a evolução dos seus ganhos e a distribuição dos seus gastos através de gráficos.
- **Registro de Corridas**: Adicione informações detalhadas sobre suas corridas diárias, como horas trabalhadas, quilômetros rodados, gastos com gasolina e ganhos.
- **Configurações do Veículo**: Cadastre informações sobre seu veículo, como modelo, ano, consumo médio, valor do IPVA e gastos com manutenção.
- **Histórico de Corridas**: Visualize, edite e exclua registros de corridas anteriores.
- **Filtros por Data**: Filtre suas corridas por período específico.
- **Armazenamento Local**: Seus dados são salvos localmente no seu navegador, garantindo privacidade.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor e geração de sites estáticos.
- **TypeScript**: Superset JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework CSS utilitário para design responsivo.
- **Chart.js**: Biblioteca para criação de gráficos interativos.
- **React Hook Form**: Biblioteca para gerenciamento de formulários.
- **date-fns**: Biblioteca para manipulação de datas.
- **LocalStorage API**: Para armazenamento de dados no navegador.

## Como Usar

1. **Página Inicial (Dashboard)**:
   - Visualize os cards com informações financeiras
   - Alterne entre diferentes períodos (diário, semanal, mensal, anual)
   - Analise os gráficos de evolução de ganhos e distribuição de gastos

2. **Configurações**:
   - Cadastre as informações do seu veículo
   - Defina valores como consumo médio, IPVA e gastos com manutenção

3. **Adicionar Corrida**:
   - Registre suas corridas diárias
   - Informe data, horas trabalhadas, quilômetros rodados, etc.

4. **Corridas Diárias**:
   - Visualize todas as corridas registradas
   - Filtre por período específico
   - Edite ou exclua registros existentes

## Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ubertracker.git

# Entre no diretório do projeto
cd ubertracker

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no seu navegador para utilizar a aplicação.

## Próximas Melhorias

- Autenticação de usuários
- Sincronização com a nuvem
- Exportação de relatórios em PDF e Excel
- Notificações e lembretes
- Modo offline
- Aplicativo móvel

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido com ❤️ para ajudar motoristas de aplicativo a terem mais controle sobre suas finanças.
