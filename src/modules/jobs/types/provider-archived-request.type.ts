import { OfferEntity } from '../entities/offer.entity';
import { ContractEntity } from '../entities/contract.entity';

export type ProviderArchivedRequestItem =
    | { kind: 'withdrawn_offer'; item: OfferEntity }
    | { kind: 'cancelled_contract'; item: ContractEntity };
