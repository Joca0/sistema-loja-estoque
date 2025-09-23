package com.joca0.estoque.service;

import com.joca0.estoque.model.Venda;
import com.joca0.estoque.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class RelatorioService {

    @Autowired
    private VendaRepository vendaRepository;

    public List<Venda> vendasPorPeriodo(LocalDate inicio, LocalDate fim) {
        return vendaRepository.findByDataBetween(
                inicio.atStartOfDay(), fim.atTime(23,59,59)
        );
    }

    public double totalVendidoNoPeriodo(LocalDate inicio, LocalDate fim) {
        return vendaRepository.findByDataBetween(
                        inicio.atStartOfDay(), fim.atTime(23,59,59)
                ).stream()
                .mapToDouble(Venda::getValorTotal)
                .sum();
    }
}
