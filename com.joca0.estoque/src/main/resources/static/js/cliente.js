//DevTools
document.write('<script src="//localhost:35729/livereload.js?snipver=1"></' + 'script>');

// Funções para manipulação do formulário
function showForm(action, row) {
    document.getElementById('lista-clientes').style.display = 'none';
    document.getElementById('form-cliente').style.display = 'block';

    if (action === 'add') {
        document.getElementById('form-title').innerText = 'Adicionar Cliente';
        document.getElementById('cliente-form').reset();
        document.getElementById('cliente-id').value = '';
    } else if (action === 'edit') {
        document.getElementById('form-title').innerText = 'Editar Cliente';
    }
}

function cancelarForm() {
    document.getElementById('lista-clientes').style.display = 'block';
    document.getElementById('form-cliente').style.display = 'none';
}

// Funções CRUD
function editarCliente(row) {
    const id = row.cells[0].innerText;
    const nome = row.cells[1].innerText;
    const cpf = row.cells[2].innerText;
    const email = row.cells[3].innerText;
    const telefone = row.cells[4].innerText;

    document.getElementById('cliente-id').value = id;
    document.getElementById('cliente-nome').value = nome;
    document.getElementById('cliente-cpf').value = cpf;
    document.getElementById('cliente-email').value = email;
    document.getElementById('cliente-telefone').value = telefone;

    showForm('edit');
}

function salvarCliente() {
    const id = document.getElementById('cliente-id').value;
    const cliente = {
        nome: document.getElementById('cliente-nome').value,
        cpf: document.getElementById('cliente-cpf').value,
        email: document.getElementById('cliente-email').value,
        telefone: document.getElementById('cliente-telefone').value
    };

    if (id) {
        // Atualizar cliente existente
        fetch(`/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao atualizar cliente');
                }
            });
    } else {
        // Adicionar novo cliente
        fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao adicionar cliente');
                }
            });
    }
}

function deletarCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        fetch(`/clientes/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Erro ao excluir cliente');
                }
            });
    }
}