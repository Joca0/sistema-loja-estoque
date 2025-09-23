package com.joca0.estoque.repositories;

import com.joca0.estoque.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByClienteIdOrderByDataDesc(Long id);
    List<Venda> findByDataBetween(LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT SUM(v.valorTotal) FROM Venda v WHERE v.data BETWEEN :inicio AND :fim")
    double totalVendido(LocalDateTime inicio, LocalDateTime fim);
}
