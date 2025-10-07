//DevTools

document.write('<script src="//localhost:35729/livereload.js?snipver=1"></' + 'script>');

// Funções para manipulação do formulário
function showForm(action, row) {
    document.getElementById('lista-produtos').style.display = 'none';
    document.getElementById('form-produto').style.display = 'block';

    if (action === 'add') {
        document.getElementById('form-title').innerText = 'Adicionar Produto';
        document.getElementById('produto-form').reset();
        document.getElementById('produto-id').value = '';
    } else if (action === 'edit') {
        document.getElementById('form-title').innerText = 'Editar Produto';
    }
}

function cancelarForm() {
    document.getElementById('lista-produtos').style.display = 'block';
    document.getElementById('form-produto').style.display = 'none';
}

// Funções CRUD
function editarProduto(row) {
    const id = row.cells[0].innerText;
    const nome = row.cells[1].innerText;
    const quantidade = row.cells[2].innerText;
    const categoria = row.cells[3].innerText;
    const preco = row.cells[4].innerText.replace(/[^\d.,]/g, '').replace(',', '.');

    document.getElementById('produto-id').value = id;
    document.getElementById('produto-nome').value = nome;
    document.getElementById('produto-quantidade').value = quantidade;
    document.getElementById('produto-categoria').value = categoria;
    document.getElementById('produto-preco').value = preco;

    showForm('edit');
}

function salvarProduto() {
    const id = document.getElementById('produto-id').value;
    const produto = {
        nome: document.getElementById('produto-nome').value,
        categoria: document.getElementById('produto-categoria').value,
        preco: parseFloat(document.getElementById('produto-preco').value),
        quantidade: parseInt(document.getElementById('produto-quantidade').value)
    };

    if (id) {
        // Atualizar produto existente
        fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao atualizar produto');
                }
            });
    } else {
        // Adicionar novo produto
        fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao adicionar produto');
                }
            });
    }
}

function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        fetch(`/produtos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao excluir produto');
                }
            });
    }
}