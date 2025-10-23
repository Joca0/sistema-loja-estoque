package com.joca0.estoque.controller;

import com.joca0.estoque.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Controller
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping
    public String paginaRelatorios() {
        return "relatorios/relatorios";
    }

    @GetMapping("/vendas")
    public String vendasPorPeriodo(@RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
                                   @RequestParam("fim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
                                   Model model) {

        model.addAttribute("vendas", relatorioService.vendasPorPeriodo(inicio, fim));
        model.addAttribute("total", relatorioService.totalVendidoNoPeriodo(inicio, fim));
        model.addAttribute("dataInicio", inicio);
        model.addAttribute("dataFim", fim);
        return "relatorios/vendas";
    }
}
