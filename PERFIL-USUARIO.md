# Página de Perfil do Usuário

## Visão Geral

A página de perfil do usuário foi criada para coletar informações detalhadas sobre o usuário, permitindo insights financeiros mais personalizados e relevantes.

## Funcionalidades

### 📋 Informações Pessoais
- **Nome Completo**: Campo editável para o nome do usuário
- **Telefone**: Número de contato com formatação
- **Data de Nascimento**: Calcula automaticamente a idade
- **Localização**: Cidade e estado
- **Avatar**: Foto de perfil (funcionalidade futura)

### 💼 Informações Profissionais
- **Profissão**: Campo livre para descrição da profissão
- **Tipo de Serviço**: 
  - CLT
  - PJ
  - Autônomo
  - Empreendedor
  - Aposentado
  - Estudante
- **Nível de Renda**:
  - Baixo (até R$ 3.000)
  - Médio (R$ 3.000 - R$ 10.000)
  - Alto (acima de R$ 10.000)
- **Experiência Profissional**:
  - Iniciante (até 2 anos)
  - Júnior (2-5 anos)
  - Pleno (5-10 anos)
  - Sênior (10+ anos)

### 💰 Perfil Financeiro
- **Perfil de Risco**:
  - Conservador
  - Moderado
  - Arrojado
- **Experiência em Investimentos**:
  - Nenhuma
  - Iniciante
  - Intermediário
  - Avançado
- **Tamanho da Família**: Número de pessoas
- **Dependentes**: Checkbox para indicar se possui dependentes

### 🎓 Habilidades e Competências
- **Nível de Educação**:
  - Ensino Fundamental
  - Ensino Médio
  - Técnico
  - Ensino Superior
  - Pós-graduação
  - Mestrado
  - Doutorado
- **Habilidades Principais**: Tags editáveis
- **Hobbies e Interesses**: Tags editáveis

### 🎯 Objetivos Financeiros
- **Metas Financeiras**: Tags editáveis para objetivos
- **Condições de Saúde**: Tags editáveis para condições médicas

### 🛡️ Seguros e Proteções
- **Seguro de Saúde**: Checkbox
- **Seguro de Vida**: Checkbox
- **Seguro Automóvel**: Checkbox
- **Seguro Residencial**: Checkbox

## Interface

### Modo de Visualização
- Informações organizadas em seções bem definidas
- Layout responsivo com grid adaptativo
- Cores e ícones intuitivos para cada seção

### Modo de Edição
- Campos editáveis com validação
- Botões de ação (Salvar/Cancelar)
- Tags dinâmicas para habilidades, hobbies e metas
- Checkboxes para seguros

### Insights Personalizados
- **Perfil de Investimento**: Recomendações baseadas no perfil de risco
- **Metas Sugeridas**: Análise das metas definidas
- **Proteção Familiar**: Sugestões baseadas em dependentes

## Navegação

### Acesso à Página
1. Clique no nome do usuário na barra lateral (próximo ao botão "Sair")
2. A página será carregada automaticamente
3. Use o botão "Editar Perfil" para modificar informações

### Edição de Dados
1. Clique em "Editar Perfil"
2. Modifique os campos desejados
3. Para tags (habilidades, hobbies, metas):
   - Digite o texto e pressione Enter
   - Clique no X para remover
4. Clique em "Salvar" para confirmar ou "Cancelar" para descartar

## Benefícios para Insights

### Dados Coletados
- **Perfil Demográfico**: Idade, localização, educação
- **Perfil Profissional**: Renda, experiência, tipo de trabalho
- **Perfil Financeiro**: Risco, experiência em investimentos
- **Perfil Familiar**: Tamanho da família, dependentes
- **Perfil de Saúde**: Condições médicas, seguros

### Insights Gerados
- **Recomendações de Investimento**: Baseadas no perfil de risco
- **Planejamento de Seguros**: Baseado na situação familiar
- **Metas Personalizadas**: Sugestões baseadas na renda e objetivos
- **Alertas Personalizados**: Baseados no perfil financeiro

## Tecnologias Utilizadas

- **React**: Framework principal
- **Tailwind CSS**: Estilização
- **Heroicons**: Ícones
- **Zustand**: Gerenciamento de estado
- **React Hot Toast**: Notificações

## Estrutura de Arquivos

```
src/
├── components/
│   └── PerfilUsuario.jsx          # Componente principal
├── store/
│   └── authStore.js               # Store de autenticação
├── index.css                      # Estilos específicos
└── App.jsx                        # Roteamento
```

## Próximas Melhorias

- [ ] Upload de foto de perfil
- [ ] Validação avançada de campos
- [ ] Histórico de alterações
- [ ] Exportação de dados do perfil
- [ ] Integração com IA para insights mais avançados
- [ ] Backup automático das informações
- [ ] Compartilhamento de perfil (opcional)

## Contribuição

Para contribuir com melhorias na página de perfil:

1. Crie uma branch para sua feature
2. Implemente as mudanças
3. Teste em diferentes dispositivos
4. Atualize a documentação
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para melhorar a experiência financeira dos usuários** 