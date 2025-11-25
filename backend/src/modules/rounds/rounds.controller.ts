import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, UseInterceptors } from '@nestjs/common';
import { UniversalResponseInterceptor } from '@common/interceptors/universal-response.interceptor';
import { UniversalResponse } from '@common/decorators/universal-response.decorator';
import { JwtAuth } from '@modules/login/auth.guard';
import { Context } from '@common/decorators/context.decorator';
import { type ContextData } from '@common/types';
import { RoundsService } from './rounds.service';
import { UnauthorizedToCreateRoundError } from './rounds.errors';
import { RoundResDTO } from './dto/round.res.dto';
import roundsConfig from '@configs/rounds.config';
import { type ConfigType } from '@nestjs/config';
import { TapResDTO } from './dto/tap.res.dto';
import { RoundExtendedResDTO } from './dto/round-extended.res.dto';

@Controller({
  path: 'api/rounds',
  version: '1',
})
@ApiTags('rounds')
@UseInterceptors(UniversalResponseInterceptor)
export class RoundsController {
  constructor(
    @Inject(roundsConfig.KEY) private readonly config: ConfigType<typeof roundsConfig>,
    private readonly service: RoundsService,
  ) {}

  @Post()
  @UniversalResponse(RoundResDTO)
  @JwtAuth()
  create(@Context() context?: ContextData) {
    if (context?.role !== this.config.role_for_round_creation) {
      throw new UnauthorizedToCreateRoundError();
    }
    return this.service.create();
  }

  @Get()
  @UniversalResponse(RoundResDTO, true)
  @JwtAuth()
  getRoundsList() {
    return this.service.getRoundsList();
  }

  @Post(':round_id/tap')
  @HttpCode(HttpStatus.OK)
  @UniversalResponse(TapResDTO)
  @JwtAuth()
  tap(@Param('round_id') round_id: string, @Context() context?: ContextData) {
    return this.service.tap(round_id, context?.id || 0);
  }

  @Get(':round_id')
  @UniversalResponse(RoundExtendedResDTO)
  @JwtAuth()
  getRoundInfo(@Param('round_id') round_id: string, @Context() context?: ContextData) {
    return this.service.getRound(round_id, context?.id || 0);
  }
}
