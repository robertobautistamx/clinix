import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  // GET /api/v1/recommendations - Recomendaciones formato frontend (default)
  @Get()
  async getRecommendations() {
    const data = await this.recommendationsService.getRecommendationsForFrontend();
    return { data, total: data.length };
  }

  // GET /api/v1/recommendations/apriori - Combos completos
  @Get('apriori')
  async getApriori(@Query('minSupport') minSupport: string = '2') {
    const data = await this.recommendationsService.getAprioriRecommendations(
      parseInt(minSupport, 10),
    );
    return { data, total: data.length };
  }

  // GET /api/v1/recommendations/product/:id - Recomendaciones para un producto
  @Get('product/:id')
  async getForProduct(@Param('id') id: string) {
    const data = await this.recommendationsService.getProductRecommendations(parseInt(id, 10));
    return { data, total: data.length };
  }
}
