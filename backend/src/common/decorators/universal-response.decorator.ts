import { UniversalResponseDTO } from '@common/interceptors/universal-response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

const types = new Set<Type>([Boolean, Number, String]);

function getType(type: Type) {
  if (types.has(type)) return { type: type.name.toLowerCase() };

  return { $ref: getSchemaPath(type) };
}

export const UniversalResponse = <DataDto extends Type<unknown>>(dataDto?: DataDto, isArray: boolean = false) => {
  if (!dataDto) {
    return applyDecorators(
      ApiExtraModels(UniversalResponseDTO),
      ApiOkResponse({
        schema: {
          allOf: [{ $ref: getSchemaPath(UniversalResponseDTO) }],
        },
      }),
    );
  }

  const data = isArray ? { type: 'array', items: getType(dataDto) } : getType(dataDto);

  return applyDecorators(
    ApiExtraModels(UniversalResponseDTO, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(UniversalResponseDTO) },
          {
            properties: {
              data,
            },
          },
        ],
      },
    }),
  );
};
