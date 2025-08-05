# Utilitários do Sistema

Este diretório contém funções utilitárias reutilizáveis em todo o sistema.

## Validação de CPF

O arquivo `cpfValidator.js` contém funções para validação e formatação de CPF.

### Funções Disponíveis

#### `validarCPF(cpf)`
Valida se um CPF é válido de acordo com o algoritmo oficial.

**Parâmetros:**
- `cpf` (string): CPF a ser validado (com ou sem formatação)

**Retorna:**
- `boolean`: `true` se o CPF for válido, `false` caso contrário

**Exemplo:**
```javascript
import { validarCPF } from './utils/cpfValidator.js'

const cpfValido = validarCPF('529.982.247-25') // true
const cpfInvalido = validarCPF('111.111.111-11') // false
```

#### `formatarCPF(cpf)`
Formata um CPF para o padrão brasileiro (000.000.000-00).

**Parâmetros:**
- `cpf` (string): CPF sem formatação

**Retorna:**
- `string`: CPF formatado

**Exemplo:**
```javascript
import { formatarCPF } from './utils/cpfValidator.js'

const cpfFormatado = formatarCPF('52998224725') // '529.982.247-25'
```

#### `limparCPF(cpf)`
Remove a formatação de um CPF, deixando apenas os números.

**Parâmetros:**
- `cpf` (string): CPF com formatação

**Retorna:**
- `string`: CPF apenas com números

**Exemplo:**
```javascript
import { limparCPF } from './utils/cpfValidator.js'

const cpfLimpo = limparCPF('529.982.247-25') // '52998224725'
```

#### `validarEFormatarCPF(cpf)`
Combina validação e formatação em uma única função.

**Parâmetros:**
- `cpf` (string): CPF a ser validado e formatado

**Retorna:**
- `object`: Objeto com as propriedades:
  - `valido` (boolean): Se o CPF é válido
  - `formatado` (string): CPF formatado
  - `erro` (string): Mensagem de erro (vazia se válido)

**Exemplo:**
```javascript
import { validarEFormatarCPF } from './utils/cpfValidator.js'

const resultado = validarEFormatarCPF('52998224725')
console.log(resultado)
// {
//   valido: true,
//   formatado: '529.982.247-25',
//   erro: ''
// }
```

### Regras de Validação

A validação de CPF segue as regras oficiais:

1. **11 dígitos**: O CPF deve ter exatamente 11 dígitos
2. **Dígitos diferentes**: Não pode ter todos os dígitos iguais
3. **Dígitos verificadores**: Os dois últimos dígitos devem ser calculados corretamente

### Algoritmo de Validação

1. Multiplica os 9 primeiros dígitos pelos pesos (10, 9, 8, 7, 6, 5, 4, 3, 2)
2. Soma os resultados
3. Calcula o resto da divisão por 11
4. Se o resto for menor que 2, o primeiro dígito verificador é 0, senão é 11 - resto
5. Repete o processo para o segundo dígito verificador (incluindo o primeiro dígito verificador)

### Uso no Sistema

A validação de CPF é utilizada em:

- **ClienteForm.jsx**: Validação em tempo real durante a digitação
- **ClienteService.js**: Validação antes de salvar no banco de dados
- **Verificação de duplicidade**: Impede CPFs duplicados no sistema

### Testes

Para testar a validação, você pode:

1. Abrir o console do navegador
2. Importar as funções
3. Usar a função `testarCPF()` disponível globalmente

```javascript
// No console do navegador
testarCPF('529.982.247-25')
``` 