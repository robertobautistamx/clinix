import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsEntity } from '../../models/transactions_entity';
import { ProductsEntity } from '../../models/products_entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
  ) {}

  /**
   * Algoritmo Apriori - encuentra combos de productos comprados juntos
   * @param minSupport - mínimo de veces que debe aparecer un combo (default: 2)
   */
  async getAprioriRecommendations(minSupport: number = 2) {
    const query = `
      SELECT 
        GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ' + ') AS combo_productos,
        GROUP_CONCAT(DISTINCT p.product_id ORDER BY p.product_id) AS product_ids,
        GROUP_CONCAT(DISTINCT t.patient_id) AS pacientes,
        COUNT(DISTINCT t.transaction_code) AS veces_comprado,
        ROUND(COUNT(DISTINCT t.transaction_code) / (SELECT COUNT(DISTINCT transaction_code) FROM transactions) * 100, 2) AS soporte_pct
      FROM transactions t
      INNER JOIN products p ON t.product_id = p.product_id
      GROUP BY (
        SELECT GROUP_CONCAT(DISTINCT product_id ORDER BY product_id)
        FROM transactions t2
        WHERE t2.transaction_code = t.transaction_code
      )
      HAVING COUNT(DISTINCT t.transaction_code) >= ?
        AND COUNT(DISTINCT p.product_id) >= 2
      ORDER BY veces_comprado DESC
    `;

    const results = await this.transactionsRepository.query(query, [minSupport]);
    return results;
  }

  /**
   * Obtiene productos recomendados para un producto específico
   * Retorna formato visual amigable para el frontend
   */
  async getProductRecommendations(productId: number) {
    const query = `
      SELECT 
        p2.product_id,
        p2.name,
        p2.category,
        p2.unit_price,
        COUNT(DISTINCT t1.transaction_code) AS veces_juntos,
        ROUND(
          COUNT(DISTINCT t1.transaction_code) / 
          (SELECT COUNT(DISTINCT transaction_code) FROM transactions WHERE product_id = ?) * 100, 
          2
        ) AS confianza_pct
      FROM transactions t1
      INNER JOIN transactions t2 ON t1.transaction_code = t2.transaction_code 
        AND t1.product_id != t2.product_id
      INNER JOIN products p2 ON t2.product_id = p2.product_id
      WHERE t1.product_id = ?
      GROUP BY p2.product_id, p2.name, p2.category, p2.unit_price
      ORDER BY veces_juntos DESC
      LIMIT 5
    `;

    const results = await this.transactionsRepository.query(query, [productId, productId]);
    return results;
  }

  /**
   * Obtiene recomendaciones formato amigable para el frontend
   * Devuelve: producto base + producto recomendado + probabilidad
   */
  async getRecommendationsForFrontend() {
    const query = `
      SELECT 
        p1.product_id AS base_id,
        p1.name AS producto_base,
        p1.category AS categoria_base,
        p2.product_id AS recomendado_id,
        p2.name AS producto_recomendado,
        p2.category AS categoria_recomendada,
        COUNT(DISTINCT t1.transaction_code) AS veces_juntos,
        ROUND(
          COUNT(DISTINCT t1.transaction_code) / 
          (SELECT COUNT(DISTINCT transaction_code) FROM transactions WHERE product_id = p1.product_id) * 100, 
          2
        ) AS probabilidad
      FROM transactions t1
      INNER JOIN transactions t2 ON t1.transaction_code = t2.transaction_code 
        AND t1.product_id < t2.product_id
      INNER JOIN products p1 ON t1.product_id = p1.product_id
      INNER JOIN products p2 ON t2.product_id = p2.product_id
      GROUP BY p1.product_id, p1.name, p1.category, p2.product_id, p2.name, p2.category
      HAVING COUNT(DISTINCT t1.transaction_code) >= 2
      ORDER BY veces_juntos DESC, probabilidad DESC
      LIMIT 12
    `;

    const results = await this.transactionsRepository.query(query);
    
    // Asignar iconos según categoría
    const getIcono = (categoria: string): string => {
      const cat = (categoria || '').toLowerCase();
      if (cat.includes('analgésic') || cat.includes('antibiót')) return '💊';
      if (cat.includes('expectorante') || cat.includes('jarabe')) return '🧴';
      if (cat.includes('material') || cat.includes('vendaje')) return '🩹';
      if (cat.includes('desinfectante') || cat.includes('alcohol')) return '🧴';
      if (cat.includes('protección') || cat.includes('guante') || cat.includes('mascarilla')) return '🧤';
      if (cat.includes('equipo') || cat.includes('termómetro')) return '🌡️';
      if (cat.includes('antidiabét')) return '💉';
      return '💊';
    };

    return results.map((rec: any) => ({
      base_id: rec.base_id,
      producto_base: rec.producto_base,
      recomendado_id: rec.recomendado_id,
      producto_recomendado: rec.producto_recomendado,
      probabilidad: parseFloat(rec.probabilidad),
      veces_juntos: parseInt(rec.veces_juntos),
      icono: getIcono(rec.categoria_base),
    }));
  }
}
