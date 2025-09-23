package com.joca0.estoque.controller;

import com.joca0.estoque.service.ProdutoService;
import com.joca0.estoque.service.RelatorioService;
import com.joca0.estoque.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;

@Controller
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private VendaService vendaService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping
    public String exibirPaginaInicial(Model model) {
        // Dados para o resumo de vendas
        model.addAttribute("vendasHoje", vendaService.vendasDoDia());

        LocalDate inicio = LocalDate.now().minusDays(7);
        LocalDate fim = LocalDate.now();
        model.addAttribute("vendasSemana", relatorioService.totalVendidoNoPeriodo(inicio, fim));

        // Produtos com estoque baixo
        model.addAttribute("produtosBaixoEstoque", produtoService.listarProdutosBaixoEstoque(5));

        // Últimas vendas
        model.addAttribute("ultimasVendas", vendaService.buscarUltimasVendas(5));

        return "home/home";
    }
}
