//DevTools

document.write('<script src="//localhost:35729/livereload.js?snipver=1"></' + 'script>');

// Funções para manipulação do formulário
function showForm(action, row) {
    document.getElementById('lista-vendas').style.display = 'none';
    document.getElementById('form-venda').style.display = 'block';

    if (action === 'add') {
        document.getElementById('form-title').innerText = 'Adicionar Venda';
        document.getElementById('venda-form').reset();
        document.getElementById('venda-id').value = '';
        // Garantir que haja pelo menos uma linha de item
        document.getElementById('itens-container').innerHTML = `
            <div class="item-row">
                <select class="item-produto" required onchange="atualizarSubtotal(this)">
                    <option value="">Selecione um produto</option>
                    ${getProductOptions()}
                </select>
                <input type="number" class="item-quantidade" min="1" value="1" required onchange="atualizarSubtotal(this.parentNode)">
                <span class="item-subtotal">R$ 0,00</span>
                <button type="button" class="remove-item" onclick="removerItem(this)">Remover</button>
            </div>
        `;
        atualizarValorTotal();
    } else if (action === 'edit') {
        document.getElementById('form-title').innerText = 'Editar Venda';
    }
}

function cancelarForm() {
    document.getElementById('lista-vendas').style.display = 'block';
    document.getElementById('form-venda').style.display = 'none';
}

// Funções para manipulação de itens
function getProductOptions() {
    const options = [];
    document.querySelectorAll('#itens-container option[data-preco]').forEach(option => {
        if (!option.parentNode.classList.contains('item-produto')) return;
        options.push(`<option value="${option.value}" data-preco="${option.getAttribute('data-preco')}">${option.textContent}</option>`);
    });
    return options.join('');
}

function adicionarItem() {
    const container = document.getElementById('itens-container');
    const novaLinha = document.createElement('div');
    novaLinha.className = 'item-row';
    novaLinha.innerHTML = `
        <select class="item-produto" required onchange="atualizarSubtotal(this.parentNode)">
            <option value="">Selecione um produto</option>
            ${getProductOptions()}
        </select>
        <input type="number" class="item-quantidade" min="1" value="1" required onchange="atualizarSubtotal(this.parentNode)">
        <span class="item-subtotal">R$ 0,00</span>
        <button type="button" class="remove-item" onclick="removerItem(this)">Remover</button>
    `;
    container.appendChild(novaLinha);
    atualizarValorTotal();
}

function removerItem(button) {
    const container = document.getElementById('itens-container');
    if (container.children.length > 1) {
        button.parentNode.remove();
        atualizarValorTotal();
    } else {
        alert('A venda deve ter pelo menos um item');
    }
}

function atualizarSubtotal(row) {
    const select = row.querySelector('.item-produto');
    const quantidade = parseInt(row.querySelector('.item-quantidade').value) || 0;
    const option = select.options[select.selectedIndex];
    const preco = option && option.getAttribute('data-preco') ? parseFloat(option.getAttribute('data-preco')) : 0;
    const subtotal = quantidade * preco;

    row.querySelector('.item-subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    atualizarValorTotal();
}

function atualizarValorTotal() {
    let total = 0;
    document.querySelectorAll('.item-subtotal').forEach(span => {
        const valor = parseFloat(span.textContent.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        total += valor;
    });
    document.getElementById('venda-valorTotal').value = `R$ ${total.toFixed(2)}`;
}

// Funções CRUD
function editarVenda(row) {
    const id = row.cells[0].innerText;
    const clienteNome = row.cells[1].innerText;

    // Limpar o container de itens
    document.getElementById('itens-container').innerHTML = '';

    // Buscar os dados completos da venda
    fetch(`/vendas/${id}`)
        .then(response => response.json())
        .then(venda => {
            document.getElementById('venda-id').value = venda.id;

            // Selecionar o cliente
            const clienteSelect = document.getElementById('venda-cliente');
            for (let i = 0; i < clienteSelect.options.length; i++) {
                if (clienteSelect.options[i].textContent === clienteNome) {
                    clienteSelect.selectedIndex = i;
                    break;
                }
            }

            // Adicionar os itens
            venda.itens.forEach(item => {
                const novaLinha = document.createElement('div');
                novaLinha.className = 'item-row';
                novaLinha.innerHTML = `
                    <select class="item-produto" required onchange="atualizarSubtotal(this.parentNode)">
                        <option value="">Selecione um produto</option>
                        ${getProductOptions()}
                    </select>
                    <input type="number" class="item-quantidade" min="1" value="${item.quantidade}" required onchange="atualizarSubtotal(this.parentNode)">
                    <span class="item-subtotal">R$ ${item.subtotal.toFixed(2)}</span>
                    <button type="button" class="remove-item" onclick="removerItem(this)">Remover</button>
                `;
                document.getElementById('itens-container').appendChild(novaLinha);

                // Selecionar o produto correto
                const produtoSelect = novaLinha.querySelector('.item-produto');
                for (let i = 0; i < produtoSelect.options.length; i++) {
                    if (produtoSelect.options[i].value == item.produto.id) {
                        produtoSelect.selectedIndex = i;
                        break;
                    }
                }
            });

            atualizarValorTotal();
            showForm('edit');
        })
        .catch(error => {
            console.error('Erro ao buscar dados da venda:', error);
            alert('Erro ao carregar dados da venda');
        });
}

function salvarVenda() {
    const id = document.getElementById('venda-id').value;
    const clienteId = document.getElementById('venda-cliente').value;

    if (!clienteId) {
        alert('Selecione um cliente');
        return;
    }

    // Verificar se todos os produtos foram selecionados
    let todosPreenchidos = true;
    document.querySelectorAll('.item-produto').forEach(select => {
        if (!select.value) todosPreenchidos = false;
    });

    if (!todosPreenchidos) {
        alert('Selecione todos os produtos');
        return;
    }

    // Construir a lista de itens
    const itens = [];
    document.querySelectorAll('.item-row').forEach(row => {
        const produtoId = row.querySelector('.item-produto').value;
        const quantidade = parseInt(row.querySelector('.item-quantidade').value);
        const subtotalText = row.querySelector('.item-subtotal').textContent;
        const subtotal = parseFloat(subtotalText.replace(/[^\d.,]/g, '').replace(',', '.'));

        itens.push({
            produto: { id: produtoId },
            quantidade: quantidade,
            subtotal: subtotal
        });
    });

    // Construir o objeto venda
    const valorTotalText = document.getElementById('venda-valorTotal').value;
    const valorTotal = parseFloat(valorTotalText.replace(/[^\d.,]/g, '').replace(',', '.'));

    const venda = {
        cliente: { id: clienteId },
        itens: itens,
        valorTotal: valorTotal,
        data: new Date().toISOString()
    };

    if (id) {
        venda.id = id;
        // Atualizar venda existente
        fetch(`/vendas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venda)
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao atualizar venda');
                }
            });
    } else {
        // Adicionar nova venda
        fetch('/vendas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venda)
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao adicionar venda');
                }
            });
    }
}

function deletarVenda(id) {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
        fetch(`/vendas/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao excluir venda');
                }
            });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar evento ao botão de adicionar item
    const addItemButton = document.getElementById('add-item');
    if (addItemButton) {
        addItemButton.addEventListener('click', adicionarItem);
    }
});
