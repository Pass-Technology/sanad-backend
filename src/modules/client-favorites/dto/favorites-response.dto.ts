import { ApiProperty } from '@nestjs/swagger';

export class FavoriteServiceDto {
    @ApiProperty()
    serviceId: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameAr: string;
}

export class FavoriteProviderDto {
    @ApiProperty()
    providerId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    rating: number;

    @ApiProperty()
    usedTimes: number;
}

export class FavoritesResponseDto {
    @ApiProperty({ type: [FavoriteServiceDto] })
    favoriteServices: FavoriteServiceDto[];

    @ApiProperty({ type: [FavoriteProviderDto] })
    favoriteProviders: FavoriteProviderDto[];
}
