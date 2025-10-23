//DevTools

document.write('<script src="//localhost:35729/livereload.js?snipver=1"></' + 'script>');

// Função para inicializar a página de relatórios
document.addEventListener('DOMContentLoaded', function() {
    // Definir as datas padrão para o relatório de vendas
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    // Formatar as datas para o formato YYYY-MM-DD
    const formatarData = (data) => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };
    
    // Definir valores padrão para os campos de data
    const campoInicio = document.getElementById('inicio');
    const campoFim = document.getElementById('fim');
    
    if (campoInicio) {
        campoInicio.value = formatarData(inicioMes);
    }
    
    if (campoFim) {
        campoFim.value = formatarData(hoje);
    }
    
    // Validar que a data final não seja anterior à data inicial
    const formVendas = document.getElementById('vendas-periodo-form');
    if (formVendas) {
        formVendas.addEventListener('submit', function(event) {
            const inicio = new Date(campoInicio.value);
            const fim = new Date(campoFim.value);
            
            if (fim < inicio) {
                event.preventDefault();
                alert('A data final não pode ser anterior à data inicial');
            }
        });
    }
});